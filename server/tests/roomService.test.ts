import { describe, expect, it } from 'vitest';
import { createRoom, joinRoom, leaveRoom } from '../src/services/roomService.js';
import { RoomStore } from '../src/services/roomStore.js';

describe('createRoom', () => {
  it("crée une salle avec l'hôte comme premier joueur", () => {
    const store = new RoomStore();
    const room = createRoom(store, 'host', 'Hôte');
    expect(room.players).toHaveLength(1);
    expect(room.players[0]?.isHost).toBe(true);
    expect(room.hostId).toBe('host');
    expect(room.minPlayers).toBe(2);
    expect(room.maxPlayers).toBe(8);
    expect(store.has(room.code)).toBe(true);
  });

  it('accepte des bornes min/max personnalisées', () => {
    const store = new RoomStore();
    const room = createRoom(store, 'host', 'Hôte', { minPlayers: 3, maxPlayers: 5 });
    expect(room.minPlayers).toBe(3);
    expect(room.maxPlayers).toBe(5);
  });

  it('refuse un minimum supérieur au maximum', () => {
    const store = new RoomStore();
    expect(() => createRoom(store, 'host', 'Hôte', { minPlayers: 6, maxPlayers: 4 })).toThrow(
      /minimum/i,
    );
  });
});

describe('joinRoom', () => {
  it('ajoute un joueur à une salle existante', () => {
    const store = new RoomStore();
    const room = createRoom(store, 'host', 'Hôte');
    joinRoom(store, room.code, 'p2', 'Bob');
    expect(store.get(room.code)?.players).toHaveLength(2);
  });

  it('refuse de rejoindre une salle introuvable', () => {
    const store = new RoomStore();
    expect(() => joinRoom(store, 'ZZZZZ', 'p2', 'Bob')).toThrow(/introuvable/i);
  });

  it('refuse de rejoindre une salle complète', () => {
    const store = new RoomStore();
    const room = createRoom(store, 'host', 'Hôte');
    for (let i = 0; i < room.maxPlayers - 1; i++) {
      joinRoom(store, room.code, `p${i}`, `Joueur ${i}`);
    }
    expect(() => joinRoom(store, room.code, 'extra', 'Trop')).toThrow(/complète/i);
  });
});

describe('leaveRoom', () => {
  it("réattribue l'hôte lorsqu'il quitte la salle", () => {
    const store = new RoomStore();
    const room = createRoom(store, 'host', 'Hôte');
    joinRoom(store, room.code, 'p2', 'Bob');
    const updated = leaveRoom(store, room.code, 'host');
    expect(updated?.hostId).toBe('p2');
    expect(updated?.players[0]?.isHost).toBe(true);
  });

  it('supprime la salle lorsque le dernier joueur la quitte', () => {
    const store = new RoomStore();
    const room = createRoom(store, 'host', 'Hôte');
    const updated = leaveRoom(store, room.code, 'host');
    expect(updated).toBeNull();
    expect(store.has(room.code)).toBe(false);
  });
});
