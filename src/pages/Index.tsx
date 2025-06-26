import React, { useState, useEffect, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { AlertTriangle, Wind, MapPin, TrendingUp, Shield, Lightbulb, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

// Tipos de datos
interface SensorData {
  id: string;
  name: string;
  aqi: number;
  pm25: number;
  no2: number;
  o3: number;
  co: number;
  so2: number;
  timestamp: Date;
  temperature: number;
  humidity: number;
}

interface PredictionData {
  current: number;
  predicted: number;
  time: string;
}

// Función para obtener el estado de calidad del aire
const getAQIStatus = (aqi: number) => {
  if (aqi <= 50) return { status: 'Buena', color: 'bg-green-500', textColor: 'text-green-700' };
  if (aqi <= 100) return { status: 'Moderada', color: 'bg-yellow-500', textColor: 'text-yellow-700' };
  if (aqi <= 150) return { status: 'Insalubre para grupos sensibles', color: 'bg-orange-500', textColor: 'text-orange-700' };
  if (aqi <= 200) return { status: 'Insalubre', color: 'bg-red-500', textColor: 'text-red-700' };
  if (aqi <= 300) return { status: 'Muy insalubre', color: 'bg-purple-500', textColor: 'text-purple-700' };
  return { status: 'Peligrosa', color: 'bg-red-800', textColor: 'text-red-900' };
};

// Datos históricos simulados para los gráficos
const generateHistoricalData = (currentValue: number, pollutant: string) => {
  const data = [];
  const baseValue = currentValue;
  
  for (let i = 23; i >= 0; i--) {
    const variation = (Math.random() - 0.5) * 0.3 * baseValue;
    const value = Math.max(0, Math.round(baseValue + variation));
    data.push({
      time: i === 0 ? 'Ahora' : `${i}h`,
      value: value,
      [pollutant]: value
    });
  }
  
  return data;
};

// Componente para tarjetas de información expandibles
const InfoCard: React.FC<{ 
  title: string; 
  value: number; 
  unit: string; 
  description: string; 
  icon: React.ReactNode;
  pollutant: string;
  isExpanded: boolean;
  onToggle: () => void;
}> = ({ title, value, unit, description, icon, pollutant, isExpanded, onToggle }) => {
  const historicalData = useMemo(() => generateHistoricalData(value, pollutant), [value, pollutant]);

  return (
    <Card className="h-full hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center justify-between">
          <div className="flex items-center gap-2">
            {icon}
            {title}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="h-6 w-6 p-0"
          >
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-primary">
          {value.toFixed(1)} <span className="text-sm font-normal text-muted-foreground">{unit}</span>
        </div>
        <p className="text-xs text-muted-foreground mt-2">{description}</p>
        
        {isExpanded && (
          <div className="mt-4 h-48">
            <h4 className="text-sm font-medium mb-2">Tendencia últimas 24 horas</h4>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={historicalData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="time" 
                  fontSize={10}
                  tick={{ fontSize: 10 }}
                />
                <YAxis 
                  fontSize={10}
                  tick={{ fontSize: 10 }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #ccc',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  dot={{ fill: '#10b981', strokeWidth: 0, r: 3 }}
                  activeDot={{ r: 5, stroke: '#10b981', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Componente principal
const Index: React.FC = () => {
  const [sensorData, setSensorData] = useState<SensorData[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string>('global');
  const [predictionData, setPredictionData] = useState<PredictionData[]>([]);
  const [predictionText, setPredictionText] = useState<string>('');
  const [isPredicting, setIsPredicting] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});

  // Función para manejar el toggle de las tarjetas expandibles
  const toggleCard = (cardId: string) => {
    setExpandedCards(prev => ({
      ...prev,
      [cardId]: !prev[cardId]
    }));
  };

  // Ubicaciones de sensores simulados
  const sensorLocations = [
    { id: 'centro', name: 'Centro Histórico', lat: -2.1969, lng: -79.8862 },
    { id: 'samborondon', name: 'Samborondón', lat: -2.1356, lng: -79.8839 },
    { id: 'alborada', name: 'Alborada', lat: -2.1333, lng: -79.8833 },
    { id: 'urdesa', name: 'Urdesa', lat: -2.2000, lng: -79.9000 },
    { id: 'kennedy', name: 'Kennedy', lat: -2.1500, lng: -79.8900 }
  ];

  // Función para generar datos simulados
  const generateSensorData = (): SensorData[] => {
    return sensorLocations.map(location => {
      const baseAQI = Math.random() * 200;
      return {
        id: location.id,
        name: location.name,
        aqi: Math.round(baseAQI + (Math.random() - 0.5) * 20),
        pm25: Math.round(baseAQI * 0.4 + Math.random() * 10),
        no2: Math.round(baseAQI * 0.3 + Math.random() * 15),
        o3: Math.round(baseAQI * 0.35 + Math.random() * 12),
        co: Math.round(baseAQI * 0.1 + Math.random() * 5),
        so2: Math.round(baseAQI * 0.2 + Math.random() * 8),
        timestamp: new Date(),
        temperature: Math.round(22 + Math.random() * 10),
        humidity: Math.round(60 + Math.random() * 30)
      };
    });
  };

  // ICA global calculado
  const globalAQI = useMemo(() => {
    if (sensorData.length === 0) return 0;
    const average = sensorData.reduce((sum, sensor) => sum + sensor.aqi, 0) / sensorData.length;
    return Math.round(average);
  }, [sensorData]);

  // Datos del sensor seleccionado
  const selectedSensorData = useMemo(() => {
    if (selectedLocation === 'global') return null;
    return sensorData.find(sensor => sensor.id === selectedLocation) || null;
  }, [selectedLocation, sensorData]);

  // Función para obtener predicción de IA
  const fetchPrediction = async () => {
    setIsPredicting(true);
    try {
      const currentData = sensorData.map(sensor => 
        `${sensor.name}: ICA ${sensor.aqi}, PM2.5 ${sensor.pm25}μg/m³`
      ).join('; ');

      const prompt = `Basándote en los siguientes datos actuales de calidad del aire de Guayaquil: ${currentData}. 
      Predice el ICA promedio para las próximas 24 horas y proporciona una justificación breve en español de máximo 100 palabras.
      Formato: "Predicción: [número] - [justificación]"`;

      // Simulación de respuesta de IA para el entorno de desarrollo
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const predictedAQI = Math.round(globalAQI + (Math.random() - 0.5) * 30);
      const prediction = `Predicción: ${predictedAQI} - Basándome en las tendencias actuales y patrones meteorológicos típicos, se espera que la calidad del aire ${predictedAQI > globalAQI ? 'empeore ligeramente' : 'mejore'} en las próximas 24 horas debido a las condiciones atmosféricas y el tráfico vehicular esperado.`;
      
      setPredictionText(prediction);
      
      // Generar datos para el gráfico
      const chartData: PredictionData[] = [
        { current: globalAQI, predicted: globalAQI, time: 'Ahora' },
        { current: globalAQI, predicted: Math.round(globalAQI + (predictedAQI - globalAQI) * 0.3), time: '6h' },
        { current: globalAQI, predicted: Math.round(globalAQI + (predictedAQI - globalAQI) * 0.7), time: '12h' },
        { current: globalAQI, predicted: predictedAQI, time: '24h' }
      ];
      
      setPredictionData(chartData);
    } catch (error) {
      console.error('Error al obtener predicción:', error);
      setPredictionText('Error al generar predicción. Inténtalo nuevamente.');
    } finally {
      setIsPredicting(false);
    }
  };

  // Efecto para simular datos en tiempo real
  useEffect(() => {
    // Generar datos iniciales
    setSensorData(generateSensorData());
    setLastUpdate(new Date());

    // Actualizar datos cada 15 segundos
    const interval = setInterval(() => {
      setSensorData(generateSensorData());
      setLastUpdate(new Date());
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  // Efecto para mostrar alertas
  useEffect(() => {
    if (globalAQI > 150) {
      setShowAlert(true);
    } else {
      setShowAlert(false);
    }
  }, [globalAQI]);

  const aqiStatus = getAQIStatus(globalAQI);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Wind className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Aire Limpio Ahora</h1>
                <p className="text-sm text-gray-600">Monitoreo de Calidad del Aire - Guayaquil</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Última actualización</p>
              <p className="text-sm font-medium">{lastUpdate.toLocaleTimeString()}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Alerta de Calidad del Aire */}
        {showAlert && (
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <strong>¡Atención!</strong> La calidad del aire está en un nivel insalubre. Se recomienda limitar las actividades al aire libre y usar mascarilla si es necesario salir.
            </AlertDescription>
          </Alert>
        )}

        {/* Indicador Global de ICA */}
        <Card className="overflow-hidden">
          <CardContent className="p-8">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-3 mb-6">
                <Wind className="h-8 w-8 text-gray-600" />
                <h2 className="text-2xl font-bold text-gray-900">Índice de Calidad del Aire Global</h2>
              </div>
              
              <div className={`inline-flex items-center justify-center w-32 h-32 rounded-full ${aqiStatus.color} text-white shadow-lg`}>
                <div className="text-center">
                  <div className="text-3xl font-bold">{globalAQI}</div>
                  <div className="text-sm">ICA</div>
                </div>
              </div>
              
              <div>
                <Badge variant="secondary" className={`text-lg px-4 py-2 ${aqiStatus.textColor} bg-white border-2`}>
                  {aqiStatus.status}
                </Badge>
              </div>
              
              <p className="text-gray-600 max-w-md mx-auto">
                Promedio calculado de {sensorData.length} ubicaciones monitoreadas en tiempo real
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Selector de Ubicación */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Seleccionar Ubicación
            </CardTitle>
          </CardHeader>
          <CardContent>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="global">Vista Global de la Ciudad</option>
              {sensorData.map(sensor => (
                <option key={sensor.id} value={sensor.id}>
                  {sensor.name} - ICA: {sensor.aqi}
                </option>
              ))}
            </select>
          </CardContent>
        </Card>

        {/* Detalles de Contaminantes */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Detalles de Contaminantes
            {selectedSensorData && (
              <span className="text-base font-normal text-gray-600">- {selectedSensorData.name}</span>
            )}
          </h3>
          
          {selectedLocation === 'global' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <InfoCard
                title="PM2.5 Promedio"
                value={sensorData.reduce((sum, s) => sum + s.pm25, 0) / (sensorData.length || 1)}
                unit="μg/m³"
                description="Partículas finas que pueden penetrar profundamente en los pulmones"
                icon={<Wind className="h-4 w-4" />}
                pollutant="pm25"
                isExpanded={expandedCards['global-pm25'] || false}
                onToggle={() => toggleCard('global-pm25')}
              />
              <InfoCard
                title="NO2 Promedio"
                value={sensorData.reduce((sum, s) => sum + s.no2, 0) / (sensorData.length || 1)}
                unit="ppb"
                description="Dióxido de nitrógeno, principalmente de vehículos y plantas de energía"
                icon={<AlertTriangle className="h-4 w-4" />}
                pollutant="no2"
                isExpanded={expandedCards['global-no2'] || false}
                onToggle={() => toggleCard('global-no2')}
              />
              <InfoCard
                title="O3 Promedio"
                value={sensorData.reduce((sum, s) => sum + s.o3, 0) / (sensorData.length || 1)}
                unit="ppb"
                description="Ozono troposférico, puede causar problemas respiratorios"
                icon={<Shield className="h-4 w-4" />}
                pollutant="o3"
                isExpanded={expandedCards['global-o3'] || false}
                onToggle={() => toggleCard('global-o3')}
              />
            </div>
          ) : selectedSensorData && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <InfoCard
                title="PM2.5"
                value={selectedSensorData.pm25}
                unit="μg/m³"
                description="Partículas finas que pueden penetrar profundamente en los pulmones"
                icon={<Wind className="h-4 w-4" />}
                pollutant="pm25"
                isExpanded={expandedCards[`${selectedLocation}-pm25`] || false}
                onToggle={() => toggleCard(`${selectedLocation}-pm25`)}
              />
              <InfoCard
                title="NO2"
                value={selectedSensorData.no2}
                unit="ppb"
                description="Dióxido de nitrógeno, principalmente de vehículos"
                icon={<AlertTriangle className="h-4 w-4" />}
                pollutant="no2"
                isExpanded={expandedCards[`${selectedLocation}-no2`] || false}
                onToggle={() => toggleCard(`${selectedLocation}-no2`)}
              />
              <InfoCard
                title="O3"
                value={selectedSensorData.o3}
                unit="ppb"
                description="Ozono troposférico, puede causar problemas respiratorios"
                icon={<Shield className="h-4 w-4" />}
                pollutant="o3"
                isExpanded={expandedCards[`${selectedLocation}-o3`] || false}
                onToggle={() => toggleCard(`${selectedLocation}-o3`)}
              />
              <InfoCard
                title="CO"
                value={selectedSensorData.co}
                unit="ppm"
                description="Monóxido de carbono, gas incoloro y tóxico"
                icon={<AlertTriangle className="h-4 w-4" />}
                pollutant="co"
                isExpanded={expandedCards[`${selectedLocation}-co`] || false}
                onToggle={() => toggleCard(`${selectedLocation}-co`)}
              />
              <InfoCard
                title="SO2"
                value={selectedSensorData.so2}
                unit="ppb"
                description="Dióxido de azufre, puede irritar el sistema respiratorio"
                icon={<Wind className="h-4 w-4" />}
                pollutant="so2"
                isExpanded={expandedCards[`${selectedLocation}-so2`] || false}
                onToggle={() => toggleCard(`${selectedLocation}-so2`)}
              />
              <InfoCard
                title="Temperatura"
                value={selectedSensorData.temperature}
                unit="°C"
                description="Temperatura ambiente actual en la ubicación"
                icon={<TrendingUp className="h-4 w-4" />}
                pollutant="temperature"
                isExpanded={expandedCards[`${selectedLocation}-temperature`] || false}
                onToggle={() => toggleCard(`${selectedLocation}-temperature`)}
              />
            </div>
          )}
        </div>

        {/* Predicción con IA */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Predicción de Calidad del Aire (24h)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Button
              onClick={fetchPrediction}
              disabled={isPredicting}
              className="w-full md:w-auto"
            >
              {isPredicting ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Generando predicción...
                </>
              ) : (
                <>
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Obtener Predicción IA
                </>
              )}
            </Button>

            {predictionText && (
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="text-blue-800">{predictionText}</p>
              </div>
            )}

            {predictionData.length > 0 && (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={predictionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="predicted" 
                      stroke="#3b82f6" 
                      strokeWidth={3}
                      name="ICA Predicho"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Consejos de Salud */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5" />
              Consejos y Recomendaciones
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-green-700">Días de Buena Calidad (ICA 0-50)</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• Disfruta de actividades al aire libre</li>
                  <li>• Ventila tu hogar abriendo ventanas</li>
                  <li>• Momento ideal para ejercitarse afuera</li>
                </ul>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-semibold text-yellow-700">Días de Calidad Moderada (ICA 51-100)</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• Personas sensibles deben limitar ejercicio prolongado</li>
                  <li>• Mantén ventanas cerradas durante horas pico</li>
                  <li>• Considera usar purificadores de aire en casa</li>
                </ul>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-semibold text-red-700">Días Insalubres (ICA 101+)</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• Evita actividades extenuantes al aire libre</li>
                  <li>• Usa mascarilla N95 si debes salir</li>
                  <li>• Mantén medicamentos para asma a mano</li>
                  <li>• Permanece en interiores tanto como sea posible</li>
                </ul>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-semibold text-blue-700">Consejos Generales</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• Usa transporte público o bicicleta</li>
                  <li>• Planta árboles y mantén áreas verdes</li>
                  <li>• Reporta fuentes de contaminación</li>
                  <li>• Mantente informado sobre la calidad del aire</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">Aire Limpio Ahora</h3>
              <p className="text-gray-300 text-sm">
                Plataforma ciudadana para el monitoreo de la calidad del aire en tiempo real.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Recursos</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• Ministerio de Salud Pública</li>
                <li>• Instituto Nacional de Meteorología</li>
                <li>• Organización Mundial de la Salud</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contacto</h4>
              <p className="text-sm text-gray-300">
                Para reportar problemas o sugerencias sobre la calidad del aire en tu zona.
              </p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-4 text-center text-sm text-gray-400">
            <p>Datos simulados con fines educativos y de demostración.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
