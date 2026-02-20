const express = require("express");
const cors = require("cors");
const { WebSocketServer } = require("ws");

const app = express();
app.use(cors());
app.use(express.json());

// --------- WEBSOCKET SERVER (FIRST) ----------
const wss = new WebSocketServer({ port: 5001 });
console.log("WebSocket server running on port 5001");

wss.on("connection", (ws) => {
  console.log("WebSocket client connected");
});

// --------- IN-MEMORY DATA ----------
let application = {
  studentId: 1,
  status: "APPLIED",
};

// --------- REST API ----------
app.post("/status", (req, res) => {
  const { status } = req.body;
  application.status = status;

  console.log("STATUS UPDATED:", status);

  wss.clients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(JSON.stringify(application));
    }
  });

  res.json(application);
});

// --------- HTTP SERVER ----------
app.listen(5000, () => {
  console.log("HTTP server running on port 5000");
});
