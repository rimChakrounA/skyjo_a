import type { AckResponse, RoomJoinedData } from '@shared/types/socket.js';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  connectClient,
  startTestServer,
  waitFor,
  type TestClient,
  type TestEnv,
} from './socketHelpers.js';

let env: TestEnv;

beforeEach(async () => {
  env = await startTestServer();
});

afterEach(async () => {
  await env.close();
});

function create(client: TestClient): Promise<AckResponse<RoomJoinedData>> {
  return new Promise((resolve) => client.emit('room:create', { playerName: 'Alice' }, resolve));
}

function join(client: TestClient, code: string): Promise<AckResponse<RoomJoinedData>> {
  return new Promise((resolve) => client.emit('room:join', { code, playerName: 'Bob' }, resolve));
}

function start(client: TestClient): Promise<AckResponse<null>> {
  return new Promise((resolve) => client.emit('game:start', resolve));
}

describe('déconnexion en cours de partie', () => {
  it('ferme la partie lorsqu’il reste moins de deux joueurs', async () => {
    const host = await connectClient(env.url);
    const created = await create(host);
    if (!created.ok) throw new Error('création échouée');

    const guest = await connectClient(env.url);
    const hostUpdate = waitFor(host, 'room:update');
    await join(guest, created.data.room.code);
    await hostUpdate;
    await start(host);

    const closed = waitFor(host, 'room:closed');
    guest.close();
    const [data] = await closed;
    expect(data.reason).toMatch(/partie est terminée/i);

    host.close();
  });
});
