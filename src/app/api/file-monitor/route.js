import fs from 'fs';
import path from 'path';
import WebSocket from 'ws';

let clients = []; // Store WebSocket clients
const filePath = path.resolve('D:/test.txt');

export async function GET(req) {
  // Check if the request is a WebSocket upgrade request
  if (req.headers.get('upgrade')?.toLowerCase() !== 'websocket') {
    return new Response('WebSocket upgrade required', { status: 426 });
  }

  const { socket, response } = await upgradeWebSocket(req);

  clients.push(socket);

  // Watch for changes in the file
  const watcher = fs.watch(filePath, (eventType) => {
    if (eventType === 'change') {
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        // Notify all connected clients about the updated content
        clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ content }));
          }
        });
      } catch (err) {
        console.error('Error reading file:', err.message);
      }
    }
  });

  // Handle WebSocket closure
  socket.onclose = () => {
    clients = clients.filter((client) => client !== socket);
    if (clients.length === 0) {
      watcher.close(); // Stop watching if no clients are connected
    }
  };

  return response;
}

// Upgrade the request to a WebSocket
async function upgradeWebSocket(req) {
  const ws = new WebSocket.Server({ noServer: true });
  ws.handleUpgrade(req, req.socket, Buffer.alloc(0), (socket) => {
    ws.emit('connection', socket, req);
  });
  return ws;
}
