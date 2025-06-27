
# Aire Limpio Ahora

Una aplicación web moderna y responsiva para monitorear y predecir la calidad del aire en tiempo real, diseñada para empoderar a los ciudadanos con información crucial sobre su entorno.

## 🌟 Características Principales

- **Dashboard Interactivo**: Visualización en tiempo real del Índice de Calidad del Aire (ICA)
- **Monitoreo Multi-ubicación**: Seguimiento de múltiples puntos de la ciudad
- **Predicciones con IA**: Integración con modelos de lenguaje para predicciones de 24 horas
- **Sistema de Alertas**: Notificaciones automáticas cuando la calidad del aire es peligrosa
- **Consejos de Salud**: Recomendaciones personalizadas basadas en los niveles de contaminación
- **Diseño Responsivo**: Optimizado para dispositivos móviles, tablets y desktop

## 🏗️ Tecnologías Utilizadas

- **Frontend**: React 18 con TypeScript
- **Estilos**: Tailwind CSS + shadcn/ui
- **Gráficos**: Recharts para visualizaciones interactivas
- **Iconos**: Lucide React
- **Build Tool**: Vite

## 🚀 Instalación y Uso

### Prerrequisitos
- Node.js (versión 16 o superior)
- npm o yarn

### Pasos de instalación

1. **Clonar el repositorio**
   ```bash
   git clone <repository-url>
   cd aire-limpio-ahora
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Iniciar el servidor de desarrollo**
   ```bash
   npm run dev
   ```

4. **Abrir en el navegador**
   ```
   http://localhost:5173
   ```

## 📊 Funcionalidades Detalladas

### Dashboard Principal
- **Indicador Global de ICA**: Muestra el promedio de calidad del aire de toda la ciudad
- **Código de colores**: Verde (Buena), Amarillo (Moderada), Naranja/Rojo (Insalubre)
- **Actualización automática**: Los datos se actualizan cada 15 segundos

### Monitoreo por Ubicaciones
- Centro Histórico
- Samborondón  
- Alborada
- Urdesa
- Kennedy

### Contaminantes Monitoreados
- **PM2.5**: Partículas finas menores a 2.5 micrómetros
- **NO2**: Dióxido de nitrógeno
- **O3**: Ozono troposférico
- **CO**: Monóxido de carbono
- **SO2**: Dióxido de azufre

### Predicciones con IA
- Análisis de tendencias actuales
- Predicciones para las próximas 24 horas
- Justificación de las predicciones
- Visualización gráfica de tendencias

## 🎨 Guía de Colores ICA

| Rango ICA | Estado | Color | Descripción |
|-----------|--------|-------|-------------|
| 0-50 | Buena | Verde | Calidad satisfactoria, poco o ningún riesgo |
| 51-100 | Moderada | Amarillo | Aceptable para la mayoría, sensibles pueden verse afectados |
| 101-150 | Insalubre para grupos sensibles | Naranja | Grupos sensibles pueden experimentar problemas |
| 151-200 | Insalubre | Rojo | Todos pueden comenzar a experimentar problemas |
| 201-300 | Muy insalubre | Púrpura | Advertencias de salud más serias |
| 301+ | Peligrosa | Marrón | Emergencia de salud |

## 🏥 Consejos de Salud Integrados

### Días de Buena Calidad (ICA 0-50)
- Ideal para actividades al aire libre
- Ventilación natural recomendada
- Perfecto para ejercicio exterior

### Días de Calidad Moderada (ICA 51-100)
- Precaución para personas sensibles
- Limitar ejercicio prolongado al aire libre
- Considerar purificadores de aire

### Días Insalubres (ICA 101+)
- Evitar actividades extenuantes
- Usar mascarillas N95
- Permanecer en interiores
- Tener medicamentos respiratorios a mano

## 🔧 Configuración de Desarrollo

### Scripts Disponibles
```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build de producción
npm run preview      # Vista previa del build
npm run lint         # Verificación de código
```

### Estructura del Proyecto
```
src/
├── components/     # Componentes reutilizables
├── pages/         # Páginas principales
├── hooks/         # Custom hooks
├── lib/           # Utilidades y configuraciones
└── index.css      # Estilos globales
```

## 📱 Responsividad

La aplicación está optimizada para:
- **Móviles**: < 768px
- **Tablets**: 768px - 1024px  
- **Desktop**: > 1024px

Utiliza un sistema de grid adaptativo y componentes que se reorganizan según el tamaño de pantalla.



## 🤝 Contribuciones

Las contribuciones son bienvenidas. Para contribuir:

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/nueva-caracteristica`)
3. Commit tus cambios (`git commit -m 'Agregar nueva característica'`)
4. Push a la rama (`git push origin feature/nueva-caracteristica`)
5. Abrir un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.


---

**Aire Limpio Ahora** - *Respirar mejor, vivir mejor* 🌱
