import type {
  ClientToServerEvents,
  GameActionPayload,
  RoomJoinedData,
  ServerToClientEvents,
} from '@shared/types/socket.js';
import type { AckResponse } from '@shared/types/socket.js';
import type { GameAction } from '@shared/types/actions.js';
import { io, type Socket } from 'socket.io-client';
import { saveSession } from './identity.js';
import { loadToken } from './authService.js';

const SERVER_URL = import.meta.env.VITE_SERVER_URL ?? 'http://localhost:3001';

/** Socket typé : le serveur émet `ServerToClientEvents`, le client émet `ClientToServerEvents`. */
export type AppSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

let socket: AppSocket | null = null;

/** Renvoie l'instance unique du socket (créée à la première demande). */
export function getSocket(): AppSocket {
  if (socket === null) {
    socket = io(SERVER_URL, {
      transports: ['websocket', 'polling'],
      autoConnect: true,
      auth: { token: loadToken() ?? '' },
    });
  }
  return socket;
}

export function createRoom(
  playerName: string,
  options: { minPlayers?: number; maxPlayers?: number } = {},
): Promise<AckResponse<RoomJoinedData>> {
  return new Promise((resolve) => {
    const payload: { playerName: string; minPlayers?: number; maxPlayers?: number } = {
      playerName,
    };
    if (options.minPlayers !== undefined) {
      payload.minPlayers = options.minPlayers;
    }
    if (options.maxPlayers !== undefined) {
      payload.maxPlayers = options.maxPlayers;
    }
    getSocket().emit('room:create', payload, (response) => {
      if (response.ok) {
        saveSession({
          sessionToken: response.data.sessionToken,
          roomCode: response.data.room.code,
          playerId: response.data.playerId,
        });
      }
      resolve(response);
    });
  });
}

export function joinRoom(code: string, playerName: string): Promise<AckResponse<RoomJoinedData>> {
  return new Promise((resolve) => {
    getSocket().emit('room:join', { code, playerName }, (response) => {
      if (response.ok) {
        saveSession({
          sessionToken: response.data.sessionToken,
          roomCode: response.data.room.code,
          playerId: response.data.playerId,
        });
      }
      resolve(response);
    });
  });
}

export function leaveRoom(): Promise<AckResponse<null>> {
  return new Promise((resolve) => {
    getSocket().emit('room:leave', resolve);
  });
}

export function startGame(): Promise<AckResponse<null>> {
  return new Promise((resolve) => {
    getSocket().emit('game:start', resolve);
  });
}

export function sendAction(action: GameAction): Promise<AckResponse<null>> {
  const payload: GameActionPayload = { action };
  return new Promise((resolve) => {
    getSocket().emit('game:action', payload, resolve);
  });
}

export function restoreSession(sessionToken: string): Promise<AckResponse<RoomJoinedData>> {
  return new Promise((resolve) => {
    getSocket().emit('session:restore', { sessionToken }, resolve);
  });
}

export function requestRematch(): Promise<AckResponse<null>> {
  return new Promise((resolve) => {
    getSocket().emit('game:rematch', resolve);
  });
}
