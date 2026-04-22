const SUMMARY = {
  total_points: 67141,
  days: 11,
  date_range: "2026-02-01 to 2026-02-11",
  overall_avg: 3208766,
  overall_max: 6198472,
  overall_min: 0,
  peak_hour: 17,
  lowest_hour: 6,
  critical_moments_count: 7240,
  per_day: [
    { date: "2026-02-01", avg: 3022546.0, min: 37, max: 5280107 },
    { date: "2026-02-02", avg: 2620567.0, min: 28, max: 4554582 },
    { date: "2026-02-03", avg: 3379388.0, min: 0, max: 5708166 },
    { date: "2026-02-04", avg: 3524982.0, min: 0, max: 5917626 },
    { date: "2026-02-05", avg: 3663628.0, min: 0, max: 6107574 },
    { date: "2026-02-06", avg: 3722633.0, min: 0, max: 6198472 },
    { date: "2026-02-07", avg: 3480623.0, min: 155, max: 5738300 },
    { date: "2026-02-08", avg: 2741441.0, min: 101, max: 4969210 },
    { date: "2026-02-09", avg: 3067439.0, min: 22, max: 5122526 },
    { date: "2026-02-10", avg: 3209286.0, min: 0, max: 5767000 },
    { date: "2026-02-11", avg: 2462669.0, min: 82, max: 5710374 },
  ],
  per_hour: [
    { hour: 0, avg: 656208.0 },
    { hour: 6, avg: 13241.0 },
    { hour: 7, avg: 37815.0 },
    { hour: 8, avg: 371483.0 },
    { hour: 9, avg: 1234260.0 },
    { hour: 10, avg: 2154596.0 },
    { hour: 11, avg: 2883113.0 },
    { hour: 12, avg: 3726390.0 },
    { hour: 13, avg: 4510963.0 },
    { hour: 14, avg: 5158840.0 },
    { hour: 15, avg: 5199630.0 },
    { hour: 16, avg: 5146310.0 },
    { hour: 17, avg: 5247763.0 },
    { hour: 18, avg: 4983317.0 },
    { hour: 19, avg: 4915166.0 },
    { hour: 20, avg: 4482142.0 },
    { hour: 21, avg: 3757024.0 },
    { hour: 22, avg: 2849578.0 },
    { hour: 23, avg: 1626171.0 },
  ],
  per_weekday: [
    { day: "Friday", avg: 3722633.0 },
    { day: "Monday", avg: 2844577.0 },
    { day: "Saturday", avg: 3480623.0 },
    { day: "Sunday", avg: 2885579.0 },
    { day: "Thursday", avg: 3663628.0 },
    { day: "Tuesday", avg: 3294185.0 },
    { day: "Wednesday", avg: 3171794.0 },
  ],
  sample_incidents: [
    { ts: "2026-02-01 06:11", value: 37 },
    { ts: "2026-02-03 06:11", value: 0 },
    { ts: "2026-02-04 06:11", value: 0 },
    { ts: "2026-02-05 06:11", value: 0 },
    { ts: "2026-02-06 06:11", value: 0 },
    { ts: "2026-02-10 06:11", value: 0 },
  ],
  best_day_of_week: "Friday",
  worst_day_of_week: "Monday",
};

let ALL_TS = [];
let filteredDay = "all";

// Función para formatear números exactos
const fmt = (v) => {
  return v.toLocaleString("es-CO");
};

// Función para encontrar el timestamp del máximo valor
function findMaxTimestamp(data) {
  if (!data || data.length === 0) return null;

  let maxValue = -Infinity;
  let maxTimestamp = null;

  data.forEach((point) => {
    if (point.value > maxValue) {
      maxValue = point.value;
      maxTimestamp = point.ts;
    }
  });

  return { value: maxValue, timestamp: maxTimestamp };
}

// Función para calcular estadísticas desde los datos reales
function calculateStatsFromData(data) {
  if (!data || data.length === 0) return null;

  const values = data.map((d) => d.value);
  const sum = values.reduce((a, b) => a + b, 0);
  const avg = sum / values.length;
  const max = Math.max(...values);
  const min = Math.min(...values);

  // Calcular momentos críticos (valores < 100,000)
  const criticalMoments = values.filter((v) => v < 100000).length;

  // Calcular promedio por hora
  const hourMap = new Map();
  data.forEach((point) => {
    const hour = new Date(point.ts).getHours();
    if (!hourMap.has(hour)) {
      hourMap.set(hour, []);
    }
    hourMap.get(hour).push(point.value);
  });

  let peakHour = 0;
  let peakHourAvg = 0;

  hourMap.forEach((values, hour) => {
    const hourAvg = values.reduce((a, b) => a + b, 0) / values.length;
    if (hourAvg > peakHourAvg) {
      peakHourAvg = hourAvg;
      peakHour = hour;
    }
  });

  return { avg, max, min, criticalMoments, peakHour, peakHourAvg };
}

// Función para actualizar KPIs con datos reales
function updateKPIsWithRealData() {
  if (ALL_TS && ALL_TS.length > 0) {
    const stats = calculateStatsFromData(ALL_TS);
    const maxInfo = findMaxTimestamp(ALL_TS);

    document.getElementById("kpi-avg").textContent = fmt(Math.round(stats.avg));
    document.getElementById("kpi-max").textContent = fmt(stats.max);
    document.getElementById("kpi-peak").textContent = `${stats.peakHour}:00`;
    document.getElementById("kpi-crit").textContent = fmt(
      stats.criticalMoments,
    );

    if (maxInfo && maxInfo.timestamp) {
      const date = new Date(maxInfo.timestamp);
      const formattedDate = `${date.getMonth() + 1}/${date.getDate()}`;
      const formattedHour = date.getHours().toString().padStart(2, "0");
      const formattedMinute = date.getMinutes().toString().padStart(2, "0");
      document.getElementById("kpi-max-sub").textContent =
        `${formattedDate} · ${formattedHour}:${formattedMinute} hrs`;
    }
  } else {
    // Fallback a SUMMARY si no hay datos
    document.getElementById("kpi-avg").textContent = fmt(SUMMARY.overall_avg);
    document.getElementById("kpi-max").textContent = fmt(SUMMARY.overall_max);
    document.getElementById("kpi-peak").textContent = `${SUMMARY.peak_hour}:00`;
    document.getElementById("kpi-crit").textContent = fmt(
      SUMMARY.critical_moments_count,
    );
    document.getElementById("kpi-max-sub").textContent = `Feb 06 · 17:00 hrs`;
  }
}

fetch("timeseries.json")
  .then((r) => r.json())
  .then((d) => {
    ALL_TS = d.data;
    updateKPIsWithRealData();
    renderTimeChart(ALL_TS);
  })
  .catch(() => {
    console.warn("timeseries.json not found, using summary data");
    updateKPIsWithRealData();
    renderTimeChart([]);
  });

Chart.defaults.color = "#5a5a72";
Chart.defaults.borderColor = "#1e1e2e";
Chart.defaults.font.family = "'DM Mono', monospace";
Chart.defaults.font.size = 10;

let timeChart;
function renderTimeChart(data) {
  const ctx = document.getElementById("timeChart").getContext("2d");
  if (timeChart) timeChart.destroy();

  const filtered =
    filteredDay === "all"
      ? data
      : data.filter((d) => d.ts.startsWith(filteredDay));
  const labels = filtered.map((d) => d.ts);
  const values = filtered.map((d) => d.value);

  timeChart = new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "Tiendas Visibles",
          data: values,
          borderColor: "#7b61ff",
          backgroundColor: "rgba(123,97,255,0.08)",
          borderWidth: 1.5,
          pointRadius: 0,
          tension: 0.3,
          fill: true,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: "#17171f",
          borderColor: "#1e1e2e",
          borderWidth: 1,
          callbacks: {
            label: (ctx) => "  " + fmt(ctx.raw) + " tiendas",
            title: (ctx) => ctx[0].label.replace("T", " "),
          },
        },
      },
      scales: {
        x: {
          ticks: {
            maxTicksLimit: 12,
            callback: (_, i, arr) => {
              if (!labels[i]) return "";
              return labels[i].slice(5, 16).replace("T", " ");
            },
          },
          grid: { color: "#1e1e2e" },
        },
        y: {
          ticks: { callback: (v) => fmt(v) },
          grid: { color: "#1e1e2e" },
        },
      },
    },
  });
}

const hourCtx = document.getElementById("hourChart").getContext("2d");
const hourData = SUMMARY.per_hour;
new Chart(hourCtx, {
  type: "bar",
  data: {
    labels: hourData.map((h) => `${h.hour}:00`),
    datasets: [
      {
        data: hourData.map((h) => h.avg),
        backgroundColor: hourData.map((h) =>
          h.avg < 100000
            ? "rgba(255,77,109,0.7)"
            : h.avg > 5000000
              ? "rgba(0,212,170,0.7)"
              : "rgba(123,97,255,0.5)",
        ),
        borderRadius: 4,
      },
    ],
  },
  options: {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: { label: (ctx) => " " + fmt(ctx.raw) + " tiendas" },
      },
    },
    scales: {
      x: { grid: { display: false } },
      y: {
        ticks: { callback: (v) => fmt(v) },
        grid: { color: "#1e1e2e" },
      },
    },
  },
});

const dayCtx = document.getElementById("dayChart").getContext("2d");
new Chart(dayCtx, {
  type: "bar",
  data: {
    labels: SUMMARY.per_day.map((d) => d.date.slice(5)),
    datasets: [
      {
        label: "Promedio",
        data: SUMMARY.per_day.map((d) => d.avg),
        backgroundColor: "rgba(123,97,255,0.6)",
        borderRadius: 3,
      },
      {
        label: "Máximo",
        data: SUMMARY.per_day.map((d) => d.max),
        backgroundColor: "rgba(0,212,170,0.3)",
        borderRadius: 3,
      },
      {
        label: "Mínimo",
        data: SUMMARY.per_day.map((d) => d.min),
        backgroundColor: "rgba(255,77,109,0.4)",
        borderRadius: 3,
      },
    ],
  },
  options: {
    responsive: true,
    plugins: {
      legend: { labels: { boxWidth: 10, font: { size: 9 } } },
      tooltip: {
        callbacks: {
          label: (ctx) => " " + ctx.dataset.label + ": " + fmt(ctx.raw),
        },
      },
    },
    scales: {
      x: { grid: { display: false } },
      y: {
        ticks: { callback: (v) => fmt(v) },
        grid: { color: "#1e1e2e" },
      },
    },
  },
});

const wdOrder = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];
const wdEs = [
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
  "Domingo",
];
const wdMap = {};
SUMMARY.per_weekday.forEach((d) => (wdMap[d.day] = d.avg));
const wdCtx = document.getElementById("weekdayChart").getContext("2d");
new Chart(wdCtx, {
  type: "bar",
  data: {
    labels: wdEs,
    datasets: [
      {
        data: wdOrder.map((d) => wdMap[d] || 0),
        backgroundColor: wdOrder.map((d) =>
          d === "Friday"
            ? "rgba(0,212,170,0.7)"
            : d === "Monday"
              ? "rgba(255,77,109,0.6)"
              : "rgba(123,97,255,0.45)",
        ),
        borderRadius: 5,
      },
    ],
  },
  options: {
    indexAxis: "y",
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: { label: (ctx) => " " + fmt(ctx.raw) + " tiendas" },
      },
    },
    scales: {
      x: {
        ticks: { callback: (v) => fmt(v) },
        grid: { color: "#1e1e2e" },
      },
      y: { grid: { display: false } },
    },
  },
});

const incidents = [
  { ts: "2026-02-01 06:11", value: 37, sev: "critical" },
  { ts: "2026-02-02 00:03", value: 599871, sev: "high" },
  { ts: "2026-02-03 06:11", value: 0, sev: "critical" },
  { ts: "2026-02-04 06:11", value: 0, sev: "critical" },
  { ts: "2026-02-05 06:11", value: 0, sev: "critical" },
  { ts: "2026-02-06 06:11", value: 0, sev: "critical" },
  { ts: "2026-02-10 06:11", value: 0, sev: "critical" },
];

const incidentList = document.getElementById("incident-list");
incidents.forEach((inc) => {
  const row = document.createElement("div");
  row.className = "incident-row";
  row.innerHTML = `
  <span>${inc.ts}</span>
  <span>${inc.value === 0 ? '<span style="color:var(--accent)">CERO tiendas</span>' : fmt(inc.value)}</span>
  <span><span class="severity ${inc.sev === "critical" ? "sev-critical" : "sev-high"}">${inc.sev === "critical" ? "CRÍTICO" : "ALTO"}</span></span>
`;
  incidentList.appendChild(row);
});

function filterDay(day, btn) {
  filteredDay = day;
  document
    .querySelectorAll(".filter-btn")
    .forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");
  updateKPIs(day);
  renderTimeChart(ALL_TS);
}

function updateKPIs(day) {
  if (day === "all") {
    // Usar datos reales si están disponibles
    if (ALL_TS && ALL_TS.length > 0) {
      updateKPIsWithRealData();
    } else {
      document.getElementById("kpi-avg").textContent = fmt(SUMMARY.overall_avg);
      document.getElementById("kpi-max").textContent = fmt(SUMMARY.overall_max);
      document.getElementById("kpi-peak").textContent =
        SUMMARY.peak_hour + ":00";
      document.getElementById("kpi-crit").textContent = fmt(
        SUMMARY.critical_moments_count,
      );
      document.getElementById("kpi-max-sub").textContent = `Feb 06 · 17:00 hrs`;
    }
  } else {
    const d = SUMMARY.per_day.find((p) => p.date === day);
    if (d) {
      document.getElementById("kpi-avg").textContent = fmt(d.avg);
      document.getElementById("kpi-max").textContent = fmt(d.max);
      document.getElementById("kpi-peak").textContent = "—";
      document.getElementById("kpi-crit").textContent =
        d.min < 100000 ? "Sí" : "OK";
      document.getElementById("kpi-max-sub").textContent =
        `${day.slice(5)} · Máximo del día`;
    }
  }
}

let chatHistory = [];

function addMsg(role, text, isTyping = false) {
  const container = document.getElementById("chat-messages");
  const div = document.createElement("div");
  div.className = `msg ${role}`;
  const isBot = role === "bot";
  div.innerHTML = `
  <div class="msg-avatar">${isBot ? "AI" : "Tú"}</div>
  <div>
    <div class="msg-bubble" id="${isTyping ? "typing-msg" : ""}">${
      isTyping
        ? '<div class="typing-indicator"><div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div></div>'
        : text
    }</div>
    <div class="msg-time">${new Date().toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" })}</div>
  </div>
`;
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
  return div;
}

async function sendMessage() {
  const input = document.getElementById("chat-input");
  const text = input.value.trim();
  if (!text) return;

  input.value = "";
  input.style.height = "auto";
  document.getElementById("send-btn").disabled = true;

  addMsg("user", text);
  chatHistory.push({ role: "user", content: text });

  const typingDiv = addMsg("bot", "", true);

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: text }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Error en el servidor");
    }

    const reply = data.reply || "Sin respuesta";

    chatHistory.push({ role: "assistant", content: reply });

    typingDiv.querySelector(".msg-bubble").innerHTML = reply.replace(
      /\n/g,
      "<br>",
    );
  } catch (err) {
    console.error("Error:", err);
    typingDiv.querySelector(".msg-bubble").innerHTML =
      `<span style="color:var(--accent)">Error: ${err.message}</span><br><small>Verifica que el servidor esté corriendo y la API key esté configurada.</small>`;
  }

  document.getElementById("send-btn").disabled = false;
  document.getElementById("chat-messages").scrollTop = 99999;
}

function sendSuggestion(text) {
  document.getElementById("chat-input").value = text;
  sendMessage();
}
