import { describe, expect, it } from 'vitest';
import { RoomStore } from '../src/services/roomStore.js';
import { createRoom, joinRoom } from '../src/services/roomService.js';
import { isLobbyReadyToStart, startLobbyGame, tryAutoStartLobby } from '../src/services/lobbyStart.js';

describe('lobbyStart', () => {
  it('ne démarre pas tant que le minimum n’est pas atteint', () => {
    const store = new RoomStore();
    const room = createRoom(store, 'host', 'Hôte', { minPlayers: 3, maxPlayers: 6 });
    expect(isLobbyReadyToStart(room)).toBe(false);
    expect(tryAutoStartLobby(room)).toBe(false);
    expect(room.status).toBe('lobby');
  });

  it('démarre automatiquement dès que le minimum est atteint (min 2)', () => {
    const store = new RoomStore();
    const room = createRoom(store, 'host', 'Hôte', { minPlayers: 2, maxPlayers: 8 });
    joinRoom(store, room.code, 'p2', 'Bob');
    expect(isLobbyReadyToStart(room)).toBe(true);
    expect(tryAutoStartLobby(room)).toBe(true);
    expect(room.status).toBe('in-game');
    expect(room.game).not.toBeNull();
  });

  it('démarre automatiquement à 3 joueurs quand le minimum est 3', () => {
    const store = new RoomStore();
    const room = createRoom(store, 'host', 'Hôte', { minPlayers: 3, maxPlayers: 8 });
    joinRoom(store, room.code, 'p2', 'Bob');
    expect(tryAutoStartLobby(room)).toBe(false);
    joinRoom(store, room.code, 'p3', 'Carol');
    expect(tryAutoStartLobby(room)).toBe(true);
    expect(room.players).toHaveLength(3);
    expect(room.status).toBe('in-game');
  });

  it('ne attend pas le maximum de joueurs', () => {
    const store = new RoomStore();
    const room = createRoom(store, 'host', 'Hôte', { minPlayers: 2, maxPlayers: 8 });
    joinRoom(store, room.code, 'p2', 'Bob');
    startLobbyGame(room);
    expect(room.players).toHaveLength(2);
    expect(room.maxPlayers).toBe(8);
    expect(room.status).toBe('in-game');
  });
});
