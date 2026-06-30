import { MIN_PLAYERS } from '@shared/constants/game.js';
import { GameError } from '../game/errors.js';
import { saveFinishedGame } from '../repositories/finishedGameRepository.js';
import { prisma } from '../repositories/prismaClient.js';
import { gameActionPayloadSchema } from '../schemas/game.js';
import { GameSession } from '../services/gameSession.js';
import { toRoomSummary, type Room } from '../services/room.js';
import { roomStore } from '../services/roomStore.js';
import { sessionStore } from '../services/sessionStore.js';
import { parsePayload } from '../utils/validate.js';
import { errorMessage, fail, ok } from './ack.js';
import { emitRoomUpdate } from './roomHandlers.js';
import type { TypedServer, TypedSocket } from './types.js';

/** Persiste la partie terminée une seule fois. */
async function persistIfFinished(room: Room): Promise<void> {
  if (room.game === null || room.game.phase !== 'gameOver' || room.persisted) {
    return;
  }
  const standings = room.game.getStandings();
  if (standings === null) {
    return;
  }
  room.persisted = true;
  try {
    // Enrichir les joueurs avec leur userId si authentifiés
    const playersWithUserId = standings.players.map((p) => {
      const token = sessionStore.findByPlayer(room.code, p.playerId);
      const userId = token !== undefined ? (sessionStore.get(token)?.userId ?? null) : null;
      return { ...p, userId };
    });
    await saveFinishedGame(prisma, { code: room.code, ...standings, players: playersWithUserId });
  } catch (err) {
    console.error('Échec de la persistance de la partie terminée :', err);
  }
}

/** Diffuse à chaque joueur de la salle sa vue filtrée de la partie. */
export async function broadcastGameState(io: TypedServer, room: Room): Promise<void> {
  if (room.game === null) {
    return;
  }
  const sockets = await io.in(room.code).fetchSockets();
  for (const s of sockets) {
    const viewerId = s.data.playerId ?? s.id;
    s.emit('game:state', room.game.publicStateFor(viewerId));
  }
}

/** Récupère la salle du socket et vérifie qu'il en est l'hôte. */
function requireHostRoom(socket: TypedSocket): Room {
  const code = socket.data.roomCode;
  if (code === null) {
    throw new GameError("Vous n'êtes dans aucune salle.");
  }
  const room = roomStore.get(code);
  if (room === undefined) {
    throw new GameError('Salle introuvable.');
  }
  const playerId = socket.data.playerId ?? socket.id;
  if (room.hostId !== playerId) {
    throw new GameError("Seul l'hôte peut effectuer cette action.");
  }
  return room;
}

export function registerGameHandlers(io: TypedServer, socket: TypedSocket): void {
  socket.on('game:start', async (ack) => {
    try {
      const room = requireHostRoom(socket);

      if (room.status === 'lobby') {
        if (room.players.length < MIN_PLAYERS) {
          throw new GameError(`Il faut au moins ${MIN_PLAYERS} joueurs pour démarrer.`);
        }
        room.game = new GameSession(
          room.players.map((player) => ({
            id: player.id,
            name: player.name,
            connected: player.connected,
          })),
        );
        room.status = 'in-game';
      } else if (room.game !== null && room.game.phase === 'roundOver') {
        room.game.nextRound();
      } else {
        throw new GameError('La partie ne peut pas être démarrée maintenant.');
      }

      ack(ok(null));
      emitRoomUpdate(io, room);
      await broadcastGameState(io, room);
    } catch (err) {
      ack(fail(errorMessage(err)));
    }
  });

  socket.on('game:rematch', (ack) => {
    try {
      const room = requireHostRoom(socket);
      if (room.game === null || room.game.phase !== 'gameOver') {
        throw new GameError('La revanche n\'est disponible qu\'en fin de partie.');
      }
      // Réinitialiser la salle vers le lobby
      room.status = 'lobby';
      room.game = null;
      room.persisted = false;
      ack(ok(null));
      // Notifier tous les joueurs de la revanche
      io.to(room.code).emit('game:rematch', toRoomSummary(room));
    } catch (err) {
      ack(fail(errorMessage(err)));
    }
  });

  socket.on('game:action', async (payload, ack) => {
    try {
      const code = socket.data.roomCode;
      const room = code !== null ? roomStore.get(code) : undefined;
      if (room === undefined || room.game === null) {
        throw new GameError('Aucune partie en cours dans cette salle.');
      }
      const { action } = parsePayload(gameActionPayloadSchema, payload);
      const playerId = socket.data.playerId ?? socket.id;
      room.game.dispatch(playerId, action);
      ack(ok(null));
      await broadcastGameState(io, room);
      await persistIfFinished(room);
    } catch (err) {
      socket.emit('game:error', { message: errorMessage(err) });
      ack(fail(errorMessage(err)));
    }
  });
}
