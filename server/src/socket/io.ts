import type { Server as HttpServer } from 'node:http';
import { Server } from 'socket.io';
import { config } from '../config.js';
import type { InterServerEvents, SocketData, TypedServer } from './types.js';
import type { ClientToServerEvents, ServerToClientEvents } from '@shared/types/socket.js';

/** Crée et configure le serveur Socket.IO typé. */
export function createSocketServer(httpServer: HttpServer): TypedServer {
  return new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>(
    httpServer,
    {
      cors: { origin: config.clientOrigin },
    },
  );
}
