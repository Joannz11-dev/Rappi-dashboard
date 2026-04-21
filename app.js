const express = require("express");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.static("public"));

app.post("/api/chat", async (req, res) => {
  try {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.3/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.Huggingfkey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(req.body),
      },
    );

    const data = await response.json();
    res.json(data);
  } catch (err) {
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
