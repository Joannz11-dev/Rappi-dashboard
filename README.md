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
```text
---

## Tecnologías

### Frontend
- HTML5 / CSS3  
- JavaScript (Vanilla)  
- Chart.js 4.4.1 — Visualización de datos  
- Google Fonts (DM Mono, Syne)  

### Backend
- Node.js  
- Express.js 4.x  
- @huggingface/inference — API de modelos IA  
- dotenv — Gestión de variables de entorno  

### Modelo IA
- Modelo: Qwen/Qwen2.5-Coder-32B-Instruct  
- Proveedor: Hugging Face Inference API  

---

## Instalación

### Requisitos Previos
- Node.js (v18 o superior)  
- npm o yarn  
- Cuenta en Hugging Face (para API key)  

### Pasos

1. Clonar el repositorio
```bash
git clone https://github.com/tu-usuario/rappi-store-availability.git
cd rappi-store-availability
