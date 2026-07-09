import { LOBBY_INSUFFICIENT_PLAYERS_TIMEOUT_MS } from '@shared/constants/game.js';
import { describe, expect, it, vi } from 'vitest';
import type { Room } from '../src/services/room.js';
import { closeRoom, isLobbyExpired, sweepExpiredLobbyRooms, syncInsufficientPlayersTimer } from '../src/services/roomIdle.js';
import { RoomStore } from '../src/services/roomStore.js';
import { SessionStore } from '../src/services/sessionStore.js';
import type { TypedServer } from '../src/socket/types.js';

function lobbyRoom(players: number, minPlayers = 2): Room {
  return {
    code: 'ABCDE',
    hostId: 'p1',
    status: 'lobby',
    minPlayers,
    maxPlayers: 8,
    players: Array.from({ length: players }, (_, index) => ({
      id: `p${index + 1}`,
      name: `Joueur ${index + 1}`,
      isHost: index === 0,
      connected: true,
    })),
    game: null,
    persisted: false,
    insufficientPlayersSince: null,
  };
}

describe('syncInsufficientPlayersTimer', () => {
  it('démarre le compte à rebours quand il manque des joueurs', () => {
    const room = lobbyRoom(1);
    syncInsufficientPlayersTimer(room, 1_000);
    expect(room.insufficientPlayersSince).toBe(1_000);
  });

  it('conserve le début du compte à rebours', () => {
    const room = lobbyRoom(1);
    room.insufficientPlayersSince = 500;
    syncInsufficientPlayersTimer(room, 2_000);
    expect(room.insufficientPlayersSince).toBe(500);
  });

  it('annule le compte à rebours quand le minimum est atteint', () => {
    const room = lobbyRoom(2);
    room.insufficientPlayersSince = 500;
    syncInsufficientPlayersTimer(room);
    expect(room.insufficientPlayersSince).toBeNull();
  });
});

describe('isLobbyExpired', () => {
  it('retourne false avant la fin du délai', () => {
    const room = lobbyRoom(1);
    room.insufficientPlayersSince = 0;
    const now = LOBBY_INSUFFICIENT_PLAYERS_TIMEOUT_MS - 1;
    expect(isLobbyExpired(room, now)).toBe(false);
  });

  it('retourne true après 5 minutes d’attente', () => {
    const room = lobbyRoom(1);
    room.insufficientPlayersSince = 0;
    const now = LOBBY_INSUFFICIENT_PLAYERS_TIMEOUT_MS;
    expect(isLobbyExpired(room, now)).toBe(true);
  });
});

describe('sweepExpiredLobbyRooms', () => {
  it('ferme les salles expirées et notifie les clients', () => {
    const store = new RoomStore();
    const sessions = new SessionStore();
    const room = lobbyRoom(1);
    room.insufficientPlayersSince = 0;
    store.set(room);
    const token = sessions.create(room.code, 'p1', 'Hôte');
    const emit = vi.fn();
    const io = {
      to: () => ({ emit }),
    } as unknown as TypedServer;

    const closed = sweepExpiredLobbyRooms(io, store, LOBBY_INSUFFICIENT_PLAYERS_TIMEOUT_MS, sessions);

    expect(closed).toEqual(['ABCDE']);
    expect(store.has('ABCDE')).toBe(false);
    expect(emit).toHaveBeenCalledWith('room:closed', {
      reason: 'La salle a été fermée : pas assez de joueurs depuis plus de 5 minutes.',
    });
    expect(sessions.get(token)).toBeUndefined();
  });
});

describe('closeRoom', () => {
  it('supprime la salle du store', () => {
    const store = new RoomStore();
    const sessions = new SessionStore();
    store.set(lobbyRoom(1));
    const emit = vi.fn();
    const io = { to: () => ({ emit }) } as unknown as TypedServer;

    closeRoom(io, store, 'ABCDE', 'Fermée.', sessions);

    expect(store.has('ABCDE')).toBe(false);
    expect(emit).toHaveBeenCalledWith('room:closed', { reason: 'Fermée.' });
  });
});
