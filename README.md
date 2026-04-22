# Rappi store availability dashboard

Dashboard operativo en tiempo real para monitorear la disponibilidad de tiendas en la plataforma Rappi, equipado con análisis histórico, visualizaciones interactivas y un asistente conversacional basado en IA.

### Autor: Joann Alejandro Zamudio Castro

## URGENTE: Filtro de "todos los días" genera sobrecarga en el aplicativo, no utilizar para mejor experiencia de navegación

<img width="785" height="421" alt="advertencia" src="https://github.com/user-attachments/assets/d64009b3-f866-4bb9-ac70-551bc44f96cf" />

## Tabla de Contenidos

- [Descripción General](#descripcion-general)
- [Características](#caracteristicas)
- [Tecnologías](#tecnologias)
- [Instalación](#instalacion)
- [Arquitectura](#arquitectura)
- [Generación del timeseries.json](#generacion-del-timeseriesjson)
- [Explicación](#explicacion)
- [Problemas a corregir](#problemas-a-corregir)
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

## Tecnologías

### Frontend
- HTML5 / CSS3  
- JavaScript (Vanilla)  
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

- [Node.js](https://nodejs.org/) v18 o superior
- npm (incluido con Node.js)
- Cuenta en [Hugging Face](https://huggingface.co/) con una API key activa

---

### 1. Clonar el repositorio

```bash
git clone https://github.com/Joannz11-dev/Rappi-dashboard.git
cd Rappi-dashboard
```

---

### 2. Instalar dependencias

```bash
npm install
```

---

### 3. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto con el siguiente contenido:

```env
HF_API_KEY=tu_api_key_de_huggingface
PORT=3000
```

> Puedes obtener tu API key en [https://huggingface.co/settings/tokens](https://huggingface.co/settings/tokens)

---

### 4. Iniciar el servidor

```bash
node app.js
```

---

### 5. Abrir en el navegador

```
http://localhost:3000
```

> ⚠️ **Nota importante:** Evita usar el filtro **"Todos los días"** ya que genera sobrecarga en el aplicativo. Usa filtros por día específico para una mejor experiencia.

---

### Estructura de archivos relevantes

```
Rappi-dashboard/
├── public/          # Frontend (HTML, CSS, JS)
├── assets/          # Recursos estáticos
├── app.js           # Servidor Express y lógica principal
├── dataset_entrenamiento.json  # Respuestas predefinidas del asistente
└── .env             # Variables de entorno (no subir a git)
```

> 💡 Si no tienes el archivo `timeseries.json`, puedes generarlo siguiendo el proceso documentado en este [Google Colab](https://colab.research.google.com/drive/173wsovdvyZr0jpPYVRzKn2GxpzKELwcH?usp=sharing).

---
## Arquitectura

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                          CLIENTE (Navegador)                            │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │                        Carpeta /public                            │  │
│  │  ┌──────────────┐      ┌──────────────┐      ┌──────────────┐     │  │
│  │  │  index.html  │◄────►│  style.css   │      │  script.js   │     │  │
│  │  │   (Vista)    │      │  (Diseño)    │      │ (Lógica Neg) │     │  │
│  │  └──────────────┘      └──────────────┘      └──────┬───────┘     │  │
│  └──────────────────────────────────────────────────────│────────────┘  │
└─────────────────────────────────────────────────────────│───────────────┘
                                                          │
                                         Llamadas Internas│(Funciones/Eventos)
                                                          ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                          CONTROLADOR LOCAL                              │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │                            app.js                                 │  │
│  │       (Maneja conexión API, Salida Local y Rutas Express)         │  │
│  └──────────┬──────────────────────┬───────────────────────┬─────────┘  │
└─────────────│──────────────────────│───────────────────────│────────────┘
              │                      │                       │
              ▼                      ▼                       ▼
    ┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐
    │   Hugging Face   │    │  Archivos JSON   │    │   Assets / Git   │
    │   Inference API  │    │ (Entrenamiento)  │    │  (Estáticos/V)   │
    │   (Modelo IA)    │    │  (TimeSeries)    │    │  (.git/.agents)  │
    └──────────────────┘    └──────────────────┘    └──────────────────┘
```
---
## Generación del timeseries.json

En el siguiente repositorio de Google Colab se documenta el proceso completo de construcción del archivo `timeseries.json`:

https://colab.research.google.com/drive/173wsovdvyZr0jpPYVRzKn2GxpzKELwcH?usp=sharing

Este archivo es un componente central del proyecto, ya que consolida la información proveniente de **201 archivos CSV** en una única estructura unificada.

### Relevancia dentro del sistema

- **Unificación de datos**: Integra múltiples fuentes dispersas (CSV) en un solo dataset consistente.
- **Transformación estructural**: Convierte datos en formato de columnas (no convencional) a una serie temporal estándar.
- **Limpieza de datos**: Elimina duplicados por timestamp, evitando inconsistencias en métricas y visualizaciones.
- **Optimización para consumo**: Genera un formato JSON (`{ts, value}`) ideal para:
  - Visualización en frontend (gráficas)
  - Procesamiento por parte de la IA
  - Consultas rápidas y eficientes

### Importancia para la IA

El `timeseries.json` actúa como el **puente entre los datos crudos y la inteligencia del sistema**, permitiendo que los modelos trabajen con información:
- ordenada cronológicamente
- libre de redundancias
- estructurada de forma simple y predecible

Sin este proceso, el análisis directo sobre los CSV sería más complejo, costoso y propenso a errores.

---
## Explicación

[![Ver video](https://www.youtube.com/watch?v=wfg28VszK3E/)](https://www.youtube.com/watch?v=wfg28VszK3E)

---
## Problemas a corregir
- Optimizar código para hacer el programa más fluido
- Posibles fallos de compatibilidad con el navegador brave
- Mejorar la parte de la tabla con las incidencias para agregar filtros y buscadores
### URGENTE: Filtro de "todos los días" genera sobrecarga en el aplicativo, no utilizar para mejor experiencia de navegación

