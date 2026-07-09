import { GameError } from '../game/errors.js';
import { GameSession } from './gameSession.js';
import type { Room } from './room.js';

/** Indique si une salle en lobby peut démarrer (minimum atteint, pas besoin d'attendre le max). */
export function isLobbyReadyToStart(room: Room): boolean {
  return room.status === 'lobby' && room.players.length >= room.minPlayers;
}

/** Démarre la partie en lobby lorsque le minimum de joueurs est atteint. */
export function startLobbyGame(room: Room): void {
  if (!isLobbyReadyToStart(room)) {
    throw new GameError(`Il faut au moins ${room.minPlayers} joueurs pour démarrer.`);
  }
  room.game = new GameSession(
    room.players.map((player) => ({
      id: player.id,
      name: player.name,
      connected: player.connected,
    })),
  );
  room.status = 'in-game';
  room.insufficientPlayersSince = null;
}

/** Démarre automatiquement si le minimum est atteint. Retourne `true` si la partie a démarré. */
export function tryAutoStartLobby(room: Room): boolean {
  if (!isLobbyReadyToStart(room)) {
    return false;
  }
  startLobbyGame(room);
  return true;
}
