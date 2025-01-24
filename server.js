// server.js
const express = require('express');
const next = require('next');
const http = require('http');
const socketIO = require('socket.io');
const fs = require('fs');
const path = require('path');

// Set environment variables
require('dotenv').config({ path: './.env.local' });

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const filePath = path.resolve('D:/test.txt'); // Path to the file to monitor

app.prepare().then(() => {
  const server = express();
  const httpServer = http.createServer(server);

  const io = socketIO(httpServer, {
    cors: {
      origin: "*", // Allow all origins
      methods: ["GET", "POST"], // Allow specific methods
      allowedHeaders: ["my-custom-header"], // Custom headers (if needed)
      credentials: true, // Allow cookies
    },
  });

  // Monitor file changes and notify connected clients
  fs.watch(filePath, (eventType) => {
    if (eventType === 'change') {
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        io.emit('file-update', { content }); // Notify all clients
        console.log('File updated and changes sent to clients.');
      } catch (err) {
        console.error('Error reading file:', err.message);
      }
    }
  });

  // Handle WebSocket connections
  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    // Send the initial file content when a client connects
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      io.emit('file-update', { content }); // Send initial content to client
    } catch (err) {
      console.error('Error reading file on connection:', err.message);
    }

    // Handle client disconnection
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  // Handle all other routes with Next.js
  server.all('*', (req, res) => handle(req, res));

  const PORT = process.env.PORT || 3000;
  httpServer.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
});
