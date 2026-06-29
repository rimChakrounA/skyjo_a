import type { AckResponse, RoomJoinedData } from '@shared/types/socket.js';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { connectClient, startTestServer, waitFor, type TestClient, type TestEnv } from './socketHelpers.js';

let env: TestEnv;

beforeEach(async () => {
  env = await startTestServer();
});

afterEach(async () => {
  await env.close();
});

function createRoom(client: TestClient, playerName: string): Promise<AckResponse<RoomJoinedData>> {
  return new Promise((resolve) => {
    client.emit('room:create', { playerName }, resolve);
  });
}

function joinRoom(
  client: TestClient,
  code: string,
  playerName: string,
): Promise<AckResponse<RoomJoinedData>> {
  return new Promise((resolve) => {
    client.emit('room:join', { code, playerName }, resolve);
  });
}

describe('événements de salle', () => {
  it('crée une salle avec un seul joueur', async () => {
    const client = await connectClient(env.url);
    const response = await createRoom(client, 'Alice');
    expect(response.ok).toBe(true);
    if (response.ok) {
      expect(response.data.room.players).toHaveLength(1);
      expect(response.data.playerId).toBe(client.id);
    }
    client.close();
  });

  it('notifie les membres lorsqu’un joueur rejoint', async () => {
    const host = await connectClient(env.url);
    const created = await createRoom(host, 'Alice');
    if (!created.ok) throw new Error('création échouée');
    const code = created.data.room.code;

    const guest = await connectClient(env.url);
    const updatePromise = waitFor(host, 'room:update');
    const joined = await joinRoom(guest, code, 'Bob');

    expect(joined.ok).toBe(true);
    const [room] = await updatePromise;
    expect(room.players).toHaveLength(2);

    host.close();
    guest.close();
  });

  it('refuse de rejoindre une salle inexistante', async () => {
    const client = await connectClient(env.url);
    const response = await joinRoom(client, 'ZZZZZ', 'Bob');
    expect(response.ok).toBe(false);
    client.close();
  });
});
