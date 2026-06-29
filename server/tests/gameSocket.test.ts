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

describe('événements de partie', () => {
  it('démarre la partie et diffuse l’état à tous les joueurs', async () => {
    const host = await connectClient(env.url);
    const created = await create(host);
    if (!created.ok) throw new Error('création échouée');

    const guest = await connectClient(env.url);
    const hostUpdate = waitFor(host, 'room:update');
    await join(guest, created.data.room.code);
    await hostUpdate;

    const hostState = waitFor(host, 'game:state');
    const guestState = waitFor(guest, 'game:state');
    const ack = await start(host);

    expect(ack.ok).toBe(true);
    const [hostView] = await hostState;
    const [guestView] = await guestState;
    expect(hostView.phase).toBe('initialReveal');
    expect(guestView.players).toHaveLength(2);

    host.close();
    guest.close();
  });

  it('refuse le démarrage par un joueur non hôte', async () => {
    const host = await connectClient(env.url);
    const created = await create(host);
    if (!created.ok) throw new Error('création échouée');

    const guest = await connectClient(env.url);
    const hostUpdate = waitFor(host, 'room:update');
    await join(guest, created.data.room.code);
    await hostUpdate;

    const ack = await start(guest);
    expect(ack.ok).toBe(false);

    host.close();
    guest.close();
  });
});
