import { randomInt } from 'node:crypto';
import { MAX_PLAYERS, ROOM_CODE_LENGTH } from '@shared/constants/game.js';
import { GameError } from '../game/errors.js';
import type { Room } from './room.js';
import type { RoomStore } from './roomStore.js';

/** Alphabet sans caractères ambigus (pas de O/0, I/1, etc.). */
const CODE_ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';

function generateCode(): string {
  let code = '';
  for (let i = 0; i < ROOM_CODE_LENGTH; i++) {
    code += CODE_ALPHABET[randomInt(CODE_ALPHABET.length)];
  }
  return code;
}

/** Génère un code de salle unique dans le store. */
export function generateUniqueCode(store: RoomStore): string {
  let code = generateCode();
  while (store.has(code)) {
    code = generateCode();
  }
  return code;
}

/** Crée une salle et y place l'hôte. */
export function createRoom(store: RoomStore, hostId: string, hostName: string): Room {
  const code = generateUniqueCode(store);
  const room: Room = {
    code,
    hostId,
    status: 'lobby',
    maxPlayers: MAX_PLAYERS,
    players: [{ id: hostId, name: hostName, isHost: true, connected: true }],
    game: null,
    persisted: false,
  };
  store.set(room);
  return room;
}

/** Ajoute un joueur à une salle existante en lobby. */
export function joinRoom(
  store: RoomStore,
  code: string,
  playerId: string,
  playerName: string,
): Room {
  const room = store.get(code);
  if (room === undefined) {
    throw new GameError('Salle introuvable.');
  }
  if (room.status !== 'lobby') {
    throw new GameError('La partie a déjà commencé.');
  }
  if (room.players.length >= room.maxPlayers) {
    throw new GameError('La salle est complète.');
  }
  if (room.players.some((player) => player.id === playerId)) {
    return room;
  }
  room.players.push({ id: playerId, name: playerName, isHost: false, connected: true });
  return room;
}

/**
 * Retire un joueur d'une salle.
 * Réattribue l'hôte si nécessaire et supprime la salle devenue vide (renvoie `null`).
 */
export function leaveRoom(store: RoomStore, code: string, playerId: string): Room | null {
  const room = store.get(code);
  if (room === undefined) {
    return null;
  }

  room.players = room.players.filter((player) => player.id !== playerId);

  if (room.players.length === 0) {
    store.delete(code);
    return null;
  }

  if (room.hostId === playerId) {
    const newHost = room.players[0];
    if (newHost !== undefined) {
      room.hostId = newHost.id;
      room.players = room.players.map((player) => ({
        ...player,
        isHost: player.id === newHost.id,
      }));
    }
  }

  return room;
}

/** Met à jour l'état de connexion d'un joueur d'une salle. */
export function setRoomPlayerConnected(
  room: Room,
  playerId: string,
  connected: boolean,
): void {
  room.players = room.players.map((player) =>
    player.id === playerId ? { ...player, connected } : player,
  );
}
