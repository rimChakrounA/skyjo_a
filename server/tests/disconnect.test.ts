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

function createRoom(client: TestClient): Promise<AckResponse<RoomJoinedData>> {
  return new Promise((resolve) => client.emit('room:create', { playerName: 'Alice' }, resolve));
}

function joinRoom(client: TestClient, code: string): Promise<AckResponse<RoomJoinedData>> {
  return new Promise((resolve) => client.emit('room:join', { code, playerName: 'Bob' }, resolve));
}

describe('déconnexion en lobby', () => {
  it('retire le joueur déconnecté et notifie les autres', async () => {
    const host = await connectClient(env.url);
    const created = await createRoom(host);
    if (!created.ok) throw new Error('création échouée');

    const guest = await connectClient(env.url);
    const firstUpdate = waitFor(host, 'room:update');
    await joinRoom(guest, created.data.room.code);
    await firstUpdate;

    const afterLeave = waitFor(host, 'room:update');
    guest.close();
    const [room] = await afterLeave;

    expect(room.players).toHaveLength(1);
    expect(room.players[0]?.id).toBe(host.id);

    host.close();
  });
});
