// server.js
const express = require("express");
const next = require("next");
const http = require("http");
const { Server } = require("socket.io");
const mysql = require("mysql2/promise");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const pool = mysql.createPool({
  host: "prosafeautomation.com",
  user: "prosafe_kabu",
  password: "P}y@=Q~207Tx",
  database: "prosafe_kabu",
});

app.prepare().then(() => {
  const server = express();
  const httpServer = http.createServer(server);

  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("✅ Client connected");

    const sendData = async () => {
      const [rows] = await pool.query("SELECT * FROM kabumachinedata");
      socket.emit("machine_data", rows);
    };

    sendData();
    const interval = setInterval(sendData, 1000);

    socket.on("disconnect", () => {
      console.log("❌ Client disconnected");
      clearInterval(interval);
    });
  });

  server.all("*", (req, res) => {
    return handle(req, res);
  });

  httpServer.listen(3000, () => {
    console.log("🚀 Server running at http://localhost:3000");
  });
});
