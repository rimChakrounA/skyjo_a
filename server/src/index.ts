import { createServer } from 'node:http';
import { createApp } from './app.js';
import { config } from './config.js';
import { createSocketServer } from './socket/io.js';
import { registerSocketHandlers } from './socket/handlers.js';

const app = createApp();
const httpServer = createServer(app);
const io = createSocketServer(httpServer);

registerSocketHandlers(io);

httpServer.listen(config.port, () => {
  console.log(`Serveur Skyjo démarré sur http://localhost:${config.port}`);
});
