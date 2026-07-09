import { describe, expect, it } from 'vitest';
import { createSeededRng } from '../src/game/rng.js';
import { GameSession } from '../src/services/gameSession.js';
import { RoomStore } from '../src/services/roomStore.js';
import { createRoom, joinRoom } from '../src/services/roomService.js';
import { startLobbyGame } from '../src/services/lobbyStart.js';
import { isRoundReadyForNext, tryAutoStartNextRound } from '../src/services/roundAutoStart.js';
import type { Room } from '../src/services/room.js';

function roomWithRoundOver(): Room {
  const store = new RoomStore();
  const room = createRoom(store, 'host', 'Hôte', { minPlayers: 2, maxPlayers: 4 });
  joinRoom(store, room.code, 'p2', 'Bob');
  startLobbyGame(room);
  room.game!.getState().phase = 'roundOver';
  return room;
}

describe('roundAutoStart', () => {
  it('détecte une fin de manche prête à enchaîner', () => {
    const room = roomWithRoundOver();
    expect(isRoundReadyForNext(room)).toBe(true);
  });

  it('démarre automatiquement la manche suivante', () => {
    const room = roomWithRoundOver();
    const previousRound = room.game!.getState().round;
    expect(tryAutoStartNextRound(room)).toBe(true);
    expect(room.game!.phase).toBe('initialReveal');
    expect(room.game!.getState().round).toBe(previousRound + 1);
  });

  it('n’avance pas si la partie est terminée', () => {
    const room = roomWithRoundOver();
    room.game!.getState().phase = 'gameOver';
    expect(tryAutoStartNextRound(room)).toBe(false);
  });
});
