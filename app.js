const express = require('express');
const app = express();
const PORT = 5000;

app.use(express.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Rappi Dashboard - WoodlandFlow</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
        }
        .container {
          text-align: center;
          padding: 60px 40px;
          background: rgba(255,255,255,0.05);
          border-radius: 20px;
          border: 1px solid rgba(255,255,255,0.1);
          backdrop-filter: blur(10px);
          max-width: 600px;
          width: 90%;
        }
        h1 {
          font-size: 2.5rem;
          margin-bottom: 10px;
          background: linear-gradient(90deg, #e94560, #0f3460);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .subtitle {
          font-size: 1.1rem;
          color: rgba(255,255,255,0.7);
          margin-bottom: 30px;
        }
        .description {
          font-size: 0.95rem;
          color: rgba(255,255,255,0.6);
          line-height: 1.8;
          margin-bottom: 40px;
        }
        .badge {
          display: inline-block;
          background: rgba(233,69,96,0.2);
          border: 1px solid #e94560;
          color: #e94560;
          padding: 6px 18px;
          border-radius: 20px;
          font-size: 0.85rem;
          letter-spacing: 1px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Rappi Dashboard</h1>
        <p class="subtitle">WoodlandFlow Chatbot Generator</p>
        <p class="description">
          A JavaScript-based system for generating chatbots using flowcharts,
          making chatbot creation accessible to everyone — no technical knowledge required.
        </p>
        <span class="badge">RUNNING</span>
      </div>
    </body>
    </html>
  `);
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Rappi Dashboard running on http://0.0.0.0:${PORT}`);
});
