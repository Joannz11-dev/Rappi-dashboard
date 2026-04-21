# Rappi Store Availability Dashboard

Dashboard operativo en tiempo real para monitorear la disponibilidad de tiendas en la plataforma Rappi, equipado con análisis histórico, visualizaciones interactivas y un asistente conversacional basado en IA.

## Tabla de Contenidos

- [Descripción General](#descripción-general)
- [Características](#características)
- [Arquitectura](#arquitectura)
- [Tecnologías](#tecnologías)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [API](#api)
- [Dataset](#dataset)
- [Despliegue](#despliegue)
- [Contribución](#contribución)
- [Licencia](#licencia)

---

##  Descripción General

Este proyecto proporciona una solución integral para el análisis de disponibilidad de tiendas en Rappi durante el período del 1 al 11 de febrero de 2026. Combina un dashboard visual con capacidades analíticas avanzadas y un asistente inteligente que responde preguntas sobre los datos utilizando un modelo de lenguaje de Hugging Face.

---

## Características

### Dashboard Operativo

- **Métricas clave (KPIs)**: Promedio de tiendas online, pico máximo, hora pico y momentos críticos  
- **Filtros por fecha**: Visualización segmentada por día específico  
- **Series temporales**: Gráfico de disponibilidad con resolución de 5 minutos  
- **Patrones horarios**: Análisis de comportamiento por hora del día  
- **Comparativas diarias**: Visualización de promedio, mínimo y máximo por día  
- **Análisis semanal**: Distribución por día de la semana  
- **Alertas de incidentes**: Detección y listado de momentos críticos  

### Asistente Inteligente

- Respuestas contextuales basadas en el dataset histórico  
- Sistema de búsqueda por similitud en respuestas predefinidas  
- Fallback a modelo de lenguaje Hugging Face (Qwen2.5-Coder-32B-Instruct)  
- Memoria conversacional por sesión  
- Sugerencias de preguntas predefinidas  

---

## Arquitectura

```text
┌─────────────────────────────────────────────────────────┐
│                        Frontend                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
│  │ Dashboard   │  │ Charts      │  │ Chatbot     │     │
│  │ (HTML)      │  │ (Chart.js)  │  │ (Custom)    │     │
│  └─────────────┘  └─────────────┘  └─────────────┘     │
└─────────────────────────┬───────────────────────────────┘
                          │ HTTP/JSON
┌─────────────────────────▼───────────────────────────────┐
│                     Backend (Express)                   │
│  ┌─────────────────────────────────────────────────┐   │
│  │                /api/chat Endpoint               │   │
│  └─────────────────────────────────────────────────┘   │
│                         │                              │
│       ┌─────────────────┼─────────────────┐            │
│       ▼                 ▼                 ▼            │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐        │
│  │ Dataset    │  │ HF         │  │ Memoria    │        │
│  │ Search     │  │ Inference  │  │ Sesión     │        │
│  └────────────┘  └────────────┘  └────────────┘        │
└─────────────────────────────────────────────────────────┘
# Tecnologías
Frontend
HTML5 / CSS3
JavaScript (Vanilla)
Chart.js 4.4.1 - Visualización de datos
Google Fonts (DM Mono, Syne)
Backend
Node.js
Express.js 4.x
@huggingface/inference - API de modelos IA
dotenv - Gestión de variables de entorno
Modelo IA
Modelo: Qwen/Qwen2.5-Coder-32B-Instruct
Proveedor: Hugging Face Inference API
# Instalación
Requisitos Previos
Node.js (v18 o superior)
npm o yarn
Cuenta en Hugging Face (para API key)
Pasos
Clonar el repositorio
git clone https://github.com/tu-usuario/rappi-store-availability.git
cd rappi-store-availability
Instalar dependencias
npm install
Configurar variables de entorno
cp .env.example .env
# Editar .env con tu API key de Hugging Face
Preparar datasets
# Colocar dataset_entrenamiento.json en la raíz del proyecto
# Colocar timeseries.json en la carpeta public/
Iniciar el servidor
npm start
# o para desarrollo con auto-reload
npm run dev
Acceder al dashboard
http://localhost:5000
# Configuración
Variables de Entorno (.env)
Variable	Descripción	Ejemplo
PORT	Puerto del servidor	5000
HF_API_KEY	API key de Hugging Face	hf_xxxxxxxxxxxxx
Estructura del Dataset de Entrenamiento
[
  {
    "pregunta": "¿Cuántas tiendas hay en promedio?",
    "respuesta": "El promedio general de tiendas disponibles es de 3.21M."
  },
  {
    "pregunta": "¿Cuál fue el máximo histórico?",
    "respuesta": "El máximo histórico alcanzado fue de 6.20M tiendas el 6 de febrero a las 17:00 hrs."
  }
]
# Estructura del Proyecto
rappi-store-availability/
├── public/
│   ├── index.html
│   ├── style.css
│   ├── script.js
│   └── timeseries.json
├── server.js
├── dataset_entrenamiento.json
├── package.json
├── .env
└── README.md
# API
Endpoint de Chat

POST /api/chat

Request Body
{
  "message": "¿Cuántas tiendas hay en promedio?"
}
Response
{
  "reply": "El promedio general de tiendas disponibles es de 3.21M."
}
Códigos de Respuesta
200 - Éxito
400 - Mensaje vacío
500 - Error interno del servidor
Dataset
Datos Disponibles
Período: 1-11 de febrero de 2026 (11 días)
Total de puntos: 67,141 registros
Resolución: 5 minutos
Métricas Principales
Métrica	Valor
Promedio global	3.21M
Pico máximo	6.20M
Hora pico	17:00 hrs
Momentos críticos (<100K)	7,240
Distribución por Día
Día	Promedio	Máximo
Viernes	3.72M	6.20M
Jueves	3.66M	6.11M
Miércoles	3.38M	5.71M
Sábado	3.48M	5.74M
Lunes	2.84M	5.12M
