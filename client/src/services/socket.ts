import type {
  ClientToServerEvents,
  GameActionPayload,
  RoomJoinedData,
  ServerToClientEvents,
} from '@shared/types/socket.js';
import type { AckResponse } from '@shared/types/socket.js';
import type { GameAction } from '@shared/types/actions.js';
import { io, type Socket } from 'socket.io-client';

const SERVER_URL = import.meta.env.VITE_SERVER_URL ?? 'http://localhost:3001';

/** Socket typé : le serveur émet `ServerToClientEvents`, le client émet `ClientToServerEvents`. */
export type AppSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

let socket: AppSocket | null = null;

/** Renvoie l'instance unique du socket (créée à la première demande). */
export function getSocket(): AppSocket {
  if (socket === null) {
    socket = io(SERVER_URL, { transports: ['websocket'], autoConnect: true });
  }
  return socket;
}

export function createRoom(playerName: string): Promise<AckResponse<RoomJoinedData>> {
  return new Promise((resolve) => {
    getSocket().emit('room:create', { playerName }, resolve);
  });
}

export function joinRoom(code: string, playerName: string): Promise<AckResponse<RoomJoinedData>> {
  return new Promise((resolve) => {
    getSocket().emit('room:join', { code, playerName }, resolve);
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
