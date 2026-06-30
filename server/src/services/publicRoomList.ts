import type { PublicRoomListItem } from '@shared/types/room.js';
import type { Room } from './room.js';

function hostName(room: Room): string {
  return room.players.find((player) => player.id === room.hostId)?.name ?? 'Inconnu';
}

/** Convertit une salle interne en entrée de liste publique (sans cartes ni main). */
export function toPublicRoomListItem(room: Room): PublicRoomListItem {
  const connectedCount =
    room.status === 'in-game' && room.game !== null
      ? room.game.connectedCount()
      : room.players.filter((player) => player.connected).length;

  const item: PublicRoomListItem = {
    code: room.code,
    status: room.status,
    hostName: hostName(room),
    playerCount: room.players.length,
    connectedCount,
    minPlayers: room.minPlayers,
    maxPlayers: room.maxPlayers,
  };

  if (room.status === 'in-game' && room.game !== null) {
    const state = room.game.getState();
    const currentPlayerId = room.game.currentPlayerId();
    const currentPlayer = state.players.find((player) => player.id === currentPlayerId);

    item.round = state.round;
    item.phase = state.phase;
    item.currentPlayerName = currentPlayer?.name ?? null;
    item.standings = state.players
      .map((player) => ({ name: player.name, totalScore: player.totalScore }))
      .sort((a, b) => a.totalScore - b.totalScore);
  }

  return item;
}

/** Liste publique de toutes les salles actives. */
export function listPublicRooms(rooms: readonly Room[]): PublicRoomListItem[] {
  return rooms.map(toPublicRoomListItem);
}
