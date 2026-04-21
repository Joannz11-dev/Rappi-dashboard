const express = require("express");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.static("public"));

app.post("/api/chat", async (req, res) => {
  try {
    const hfRes = await fetch(
      "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.3/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(req.body),
      }
    );

    const text = await hfRes.text();

    // 👇 DEBUG CLAVE
    console.log("HF raw response:", text.slice(0, 200));

    if (!hfRes.ok) {
      return res.status(hfRes.status).json({
        error: "Error desde HuggingFace",
        details: text,
      });
    }

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      return res.status(500).json({
        error: "Respuesta no es JSON",
        raw: text,
      });
    }

    res.json(data);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Rappi Dashboard running`);
  console.log(`📍 Local: http://localhost:${PORT}`);

  if (process.env.REPL_SLUG) {
    console.log(
      `🌍 Pública: https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co`,
    );
  }
});
