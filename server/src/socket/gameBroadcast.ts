import type { Room } from '../services/room.js';
import type { TypedServer } from './types.js';

/** Diffuse à chaque joueur de la salle sa vue filtrée de la partie. */
export async function broadcastGameState(io: TypedServer, room: Room): Promise<void> {
  if (room.game === null) {
    return;
  }
  const sockets = await io.in(room.code).fetchSockets();
  for (const socket of sockets) {
    const viewerId = socket.data.playerId ?? socket.id;
    socket.emit('game:state', room.game.publicStateFor(viewerId));
  }
}
