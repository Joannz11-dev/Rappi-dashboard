require("dotenv").config();
const express = require("express");
const path = require("path");
const fs = require("fs");
const { HfInference } = require("@huggingface/inference");

const app = express();
const PORT = process.env.PORT || 5000;

let dataset = [];
let summary = null;
let timeseries = [];

try {
  const raw = fs.readFileSync(
    path.join(__dirname, "dataset_entrenamiento.json"),
    "utf8",
  );
  dataset = JSON.parse(raw);
  console.log(`dataset_entrenamiento.json cargado: ${dataset.length} entradas`);
} catch {
  console.warn("No se encontro dataset_entrenamiento.json");
}

try {
  const raw = fs.readFileSync(
    path.join(__dirname, "public", "summary.json"),
    "utf8",
  );
  summary = JSON.parse(raw);
  console.log("summary.json cargado");
} catch {
  console.warn("No se encontro public/summary.json");
}

try {
  const raw = fs.readFileSync(
    path.join(__dirname, "public", "timeseries.json"),
    "utf8",
  );
  const parsed = JSON.parse(raw);
  timeseries = parsed.data || parsed;
  console.log(`timeseries.json cargado: ${timeseries.length} puntos`);
} catch {
  console.warn("No se encontro public/timeseries.json");
}

function buildSummaryContext() {
  if (!summary) return "";

  const fmt = (v) => {
    if (v >= 1e6) return (v / 1e6).toFixed(2) + " millones";
    if (v >= 1e3) return (v / 1e3).toFixed(0) + " mil";
    return String(v);
  };

  const lines = [
    "Resumen general del dataset:",
    `- Rango de fechas: ${summary.date_range || "2026-02-01 a 2026-02-11"}`,
    `- Total de registros: ${summary.total_points?.toLocaleString() || "N/A"}`,
    `- Dias cubiertos: ${summary.days || "N/A"}`,
    `- Promedio general: ${fmt(summary.overall_avg)} tiendas`,
    `- Maximo historico: ${fmt(summary.overall_max)} tiendas`,
    `- Minimo historico: ${summary.overall_min} tiendas`,
    `- Hora pico: ${summary.peak_hour}:00`,
    `- Hora mas baja: ${summary.lowest_hour}:00`,
    `- Momentos criticos (menos de 100k tiendas): ${summary.critical_moments_count?.toLocaleString()}`,
    `- Mejor dia de la semana: ${summary.best_day_of_week}`,
    `- Peor dia de la semana: ${summary.worst_day_of_week}`,
  ];

  if (summary.per_hour?.length) {
    lines.push("Promedio por hora:");
    for (const h of summary.per_hour) {
      lines.push(`  ${h.hour}:00 -> ${fmt(h.avg)} tiendas`);
    }
  }

  if (summary.per_day?.length) {
    lines.push("Promedio por dia:");
    for (const d of summary.per_day) {
      lines.push(
        `  ${d.date}: avg ${fmt(d.avg)}, min ${d.min}, max ${fmt(d.max)}`,
      );
    }
  }

  if (summary.per_weekday?.length) {
    lines.push("Promedio por dia de la semana:");
    for (const w of summary.per_weekday) {
      lines.push(`  ${w.day}: ${fmt(w.avg)} tiendas`);
    }
  }

  return lines.join("\n");
}

function buildTimeseriesContext(pregunta) {
  if (!timeseries.length) return "";

  const norm = pregunta.toLowerCase();
  const dateMatch = norm.match(/(\d{4}-\d{2}-\d{2})/);
  const hourMatch = norm.match(/(\d{1,2})[:h ]/);

  if (!dateMatch && !hourMatch) return "";

  let puntos = timeseries;

  if (dateMatch) {
    puntos = puntos.filter((p) => p.ts?.startsWith(dateMatch[1]));
  }

  if (hourMatch) {
    const hora = parseInt(hourMatch[1]);
    puntos = puntos.filter((p) => {
      const h = new Date(p.ts).getHours();
      return h === hora;
    });
  }

  if (!puntos.length) return "";

  const valores = puntos.map((p) => p.value);
  const avg = Math.round(valores.reduce((a, b) => a + b, 0) / valores.length);
  const max = Math.max(...valores);
  const min = Math.min(...valores);

  const fmt = (v) => {
    if (v >= 1e6) return (v / 1e6).toFixed(2) + " millones";
    if (v >= 1e3) return (v / 1e3).toFixed(0) + " mil";
    return String(v);
  };

  const tag = dateMatch
    ? `Datos de timeseries para ${dateMatch[1]}${hourMatch ? " a las " + hourMatch[1] + ":00" : ""}:`
    : `Datos de timeseries para las ${hourMatch[1]}:00:`;

  return `${tag}\n- Promedio: ${fmt(avg)}\n- Maximo: ${fmt(max)}\n- Minimo: ${fmt(min)}\n- Puntos analizados: ${puntos.length}`;
}

const hf = new HfInference(process.env.HF_API_KEY);
const HF_MODEL = "Qwen/Qwen2.5-Coder-32B-Instruct";

const basePrompt = `Eres un asistente especializado en disponibilidad de tiendas Rappi.
Tienes acceso a datos historicos del 1 al 11 de febrero de 2026.
Responde de forma concisa y util en espanol.
Si no sabes algo con certeza, dilo claramente.`;

const summaryContext = buildSummaryContext();

const conversationHistory = new Map();

function normalizarTexto(texto) {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[¿?¡!.,;:]/g, "")
    .trim();
}

function calcularSimilitud(preguntaUsuario, preguntaDataset) {
  const palabrasUsuario = new Set(
    normalizarTexto(preguntaUsuario).split(/\s+/),
  );
  const palabrasDataset = normalizarTexto(preguntaDataset).split(/\s+/);

  let coincidencias = 0;
  for (const palabra of palabrasDataset) {
    if (palabrasUsuario.has(palabra)) coincidencias++;
  }

  return coincidencias / Math.max(palabrasDataset.length, palabrasUsuario.size);
}

function buscarEnDataset(pregunta) {
  const UMBRAL = 0.45;
  let mejorPuntaje = 0;
  let mejorRespuesta = null;

  for (const entrada of dataset) {
    const puntaje = calcularSimilitud(pregunta, entrada.pregunta);
    if (puntaje > mejorPuntaje) {
      mejorPuntaje = puntaje;
      mejorRespuesta = entrada.respuesta;
    }
  }

  if (mejorPuntaje >= UMBRAL) {
    return { respuesta: mejorRespuesta, puntaje: mejorPuntaje };
  }

  return null;
}

async function preguntarIA(userId, prompt) {
  const tsContext = buildTimeseriesContext(prompt);

  const systemContent = [
    basePrompt,
    summaryContext ? "\n" + summaryContext : "",
    tsContext ? "\n" + tsContext : "",
  ]
    .filter(Boolean)
    .join("\n");

  const systemMessage = { role: "system", content: systemContent };
  let userHistory = conversationHistory.get(userId) || [];
  userHistory.push({ role: "user", content: prompt });

  const messages = [systemMessage, ...userHistory];

  const response = await hf.chatCompletion({
    model: HF_MODEL,
    messages,
    max_tokens: 600,
  });

  const botMessage =
    response.choices?.[0]?.message?.content?.trim() ||
    "Lo siento, no pude generar una respuesta.";

  userHistory.push({ role: "assistant", content: botMessage });
  conversationHistory.set(userId, userHistory);

  return botMessage;
}

async function getResponse(userId, prompt) {
  try {
    const resultadoLocal = buscarEnDataset(prompt);

    if (resultadoLocal) {
      const confianza = (resultadoLocal.puntaje * 100).toFixed(0);
      console.log(`Dataset [${confianza}%]: "${prompt.slice(0, 60)}"`);
      return resultadoLocal.respuesta;
    }

    console.log(`HuggingFace: "${prompt.slice(0, 60)}"`);
    return await preguntarIA(userId, prompt);
  } catch (err) {
    console.error("Error al generar respuesta:", err);
    return "Hubo un problema al procesar tu pregunta. Por favor intenta mas tarde.";
  }
}

app.use(express.json());
app.use(express.static("public"));

app.post("/api/chat", async (req, res) => {
  try {
    const userId = req.ip;
    const userMessage = req.body.message;

    if (!userMessage) {
      return res.status(400).json({ error: "Mensaje vacio" });
    }

    const reply = await getResponse(userId, userMessage);
    res.json({ reply });
  } catch (error) {
    console.error("ERROR GENERAL:", error);
    res.status(500).json({
      error: "Lo siento, hubo un error al procesar tu mensaje.",
    });
  }
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Local: http://localhost:${PORT}`);
  console.log(`Model: ${HF_MODEL}`);
  console.log(`Dataset: ${dataset.length} entradas`);
  console.log(`Summary: ${summary ? "cargado" : "no disponible"}`);
  console.log(`Timeseries: ${timeseries.length} puntos`);
});
