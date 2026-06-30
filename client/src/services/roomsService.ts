import type { PublicRoomListItem } from '@shared/types/room.js';

const SERVER_URL = import.meta.env.VITE_SERVER_URL ?? 'http://localhost:3001';

/** Récupère la liste publique des salles actives. */
export async function fetchPublicRooms(): Promise<PublicRoomListItem[]> {
  const response = await fetch(`${SERVER_URL}/api/rooms`);
  if (!response.ok) {
    throw new Error('Impossible de charger les salles.');
  }
  const body = (await response.json()) as { rooms: PublicRoomListItem[] };
  return body.rooms;
}
