import { describe, expect, it } from 'vitest';
import { GameSession } from '../src/services/gameSession.js';
import { listPublicRooms, toPublicRoomListItem } from '../src/services/publicRoomList.js';
import type { Room } from '../src/services/room.js';

function lobbyRoom(overrides: Partial<Room> = {}): Room {
  return {
    code: 'ABCDE',
    hostId: 'host',
    status: 'lobby',
    minPlayers: 2,
    maxPlayers: 6,
    players: [
      { id: 'host', name: 'Alice', isHost: true, connected: true },
      { id: 'p2', name: 'Bob', isHost: false, connected: true },
    ],
    game: null,
    persisted: false,
    insufficientPlayersSince: null,
    ...overrides,
  };
}

describe('toPublicRoomListItem', () => {
  it('expose les infos publiques d’une salle en lobby', () => {
    const item = toPublicRoomListItem(lobbyRoom());
    expect(item).toMatchObject({
      code: 'ABCDE',
      status: 'lobby',
      hostName: 'Alice',
      playerCount: 2,
      connectedCount: 2,
      minPlayers: 2,
      maxPlayers: 6,
    });
    expect(item.round).toBeUndefined();
    expect(item.standings).toBeUndefined();
  });

  it('expose les scores et la manche pour une partie en cours', () => {
    const game = new GameSession([
      { id: 'host', name: 'Alice', connected: true },
      { id: 'p2', name: 'Bob', connected: true },
    ]);
    const item = toPublicRoomListItem(
      lobbyRoom({ status: 'in-game', game }),
    );

    expect(item.status).toBe('in-game');
    expect(item.round).toBe(1);
    expect(item.phase).toBe('initialReveal');
    expect(item.standings).toHaveLength(2);
    expect(item.standings?.[0]).toHaveProperty('totalScore', 0);
  });
});

describe('listPublicRooms', () => {
  it('convertit toutes les salles actives', () => {
    const items = listPublicRooms([lobbyRoom(), lobbyRoom({ code: 'FGHIJ' })]);
    expect(items).toHaveLength(2);
  });
});
