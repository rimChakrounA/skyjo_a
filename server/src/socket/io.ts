import type { Server as HttpServer } from 'node:http';
import jwt from 'jsonwebtoken';
import { Server } from 'socket.io';
import { config } from '../config.js';
import type { JwtPayload } from '../middleware/auth.js';
import type { ClientToServerEvents, ServerToClientEvents } from '@shared/types/socket.js';
import type { InterServerEvents, SocketData, TypedServer } from './types.js';

/** Crée et configure le serveur Socket.IO typé avec middleware d'authentification optionnel. */
export function createSocketServer(httpServer: HttpServer): TypedServer {
  const io = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>(
    httpServer,
    {
      cors: { origin: config.clientOrigin },
    },
  );

  // Middleware : lit le JWT si fourni, attache userId (null pour les invités)
  io.use((socket, next) => {
    socket.data.userId = null;
    const token = socket.handshake.auth.token as string | undefined;
    if (typeof token === 'string' && token.length > 0) {
      try {
        const payload = jwt.verify(token, config.jwtSecret) as JwtPayload;
        socket.data.userId = payload.userId;
      } catch {
        // Token invalide : l'utilisateur joue en tant qu'invité
      }
    }
    next();
  });

  return io;
}
