import { describe, expect, it } from 'vitest';
import type { Room } from '../src/services/room.js';
import { RoomStore } from '../src/services/roomStore.js';

function sampleRoom(code: string): Room {
  return {
    code,
    hostId: 'p1',
    status: 'lobby',
    minPlayers: 2,
    maxPlayers: 8,
    players: [{ id: 'p1', name: 'Hôte', isHost: true, connected: true }],
    game: null,
    persisted: false,
  };
}

describe('RoomStore', () => {
  it('enregistre et récupère une salle', () => {
    const store = new RoomStore();
    store.set(sampleRoom('ABCDE'));
    expect(store.has('ABCDE')).toBe(true);
    expect(store.get('ABCDE')?.hostId).toBe('p1');
  });

  it('supprime une salle', () => {
    const store = new RoomStore();
    store.set(sampleRoom('ABCDE'));
    store.delete('ABCDE');
    expect(store.has('ABCDE')).toBe(false);
    expect(store.size).toBe(0);
  });

  it('liste toutes les salles', () => {
    const store = new RoomStore();
    store.set(sampleRoom('AAAAA'));
    store.set(sampleRoom('BBBBB'));
    expect(store.all()).toHaveLength(2);
  });
});
