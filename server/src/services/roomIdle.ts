import { LOBBY_INSUFFICIENT_PLAYERS_TIMEOUT_MS } from '@shared/constants/game.js';
import type { TypedServer } from '../socket/types.js';
import type { Room } from './room.js';
import type { RoomStore } from './roomStore.js';
import { sessionStore as defaultSessionStore, type SessionStore } from './sessionStore.js';

/** Indique si une salle en lobby attend encore assez de joueurs. */
export function hasInsufficientPlayers(room: Room): boolean {
  return room.status === 'lobby' && room.players.length < room.minPlayers;
}

/** Démarre ou annule le compte à rebours d'attente de joueurs. */
export function syncInsufficientPlayersTimer(room: Room, now = Date.now()): void {
  if (!hasInsufficientPlayers(room)) {
    room.insufficientPlayersSince = null;
    return;
  }
  if (room.insufficientPlayersSince === null) {
    room.insufficientPlayersSince = now;
  }
}

/** Vérifie si une salle en lobby a dépassé le délai d'attente. */
export function isLobbyExpired(room: Room, now = Date.now()): boolean {
  if (!hasInsufficientPlayers(room) || room.insufficientPlayersSince === null) {
    return false;
  }
  return now - room.insufficientPlayersSince >= LOBBY_INSUFFICIENT_PLAYERS_TIMEOUT_MS;
}

/** Ferme une salle, notifie les clients et nettoie les sessions. */
export function closeRoom(
  io: TypedServer,
  store: RoomStore,
  code: string,
  reason: string,
  sessions: SessionStore = defaultSessionStore,
): void {
  if (!store.has(code)) {
    return;
  }
  io.to(code).emit('room:closed', { reason });
  sessions.deleteByRoom(code);
  store.delete(code);
}

/** Supprime les salles en lobby restées sous le minimum de joueurs trop longtemps. */
export function sweepExpiredLobbyRooms(
  io: TypedServer,
  store: RoomStore,
  now = Date.now(),
  sessions: SessionStore = defaultSessionStore,
): string[] {
  const closed: string[] = [];
  for (const room of store.all()) {
    if (isLobbyExpired(room, now)) {
      closeRoom(
        io,
        store,
        room.code,
        'La salle a été fermée : pas assez de joueurs depuis plus de 5 minutes.',
        sessions,
      );
      closed.push(room.code);
    }
  }
  return closed;
}
