const express = require("express");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.static("public"));

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
