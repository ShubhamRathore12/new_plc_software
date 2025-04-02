const express = require("express");
const next = require("next");
const http = require("http");
const { Server } = require("ws");
const { initWebSocketServer } = require("./src/app/api/socket"); // Path to your WebSocket API route

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  // Create an HTTP server with express
  const httpServer = http.createServer(server);

  // Initialize WebSocket server, passing the HTTP server instance
  initWebSocketServer(httpServer);

  server.all("*", (req, res) => {
    return handle(req, res); // Let Next.js handle all routes
  });

  httpServer.listen(3000, (err) => {
    if (err) throw err;
    console.log("> Ready on http://localhost:3000");
  });
});
