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
  it('démarre la partie automatiquement quand le minimum est atteint', async () => {
    const host = await connectClient(env.url);
    const created = await create(host);
    if (!created.ok) throw new Error('création échouée');

    const guest = await connectClient(env.url);
    const hostState = waitFor(host, 'game:state');
    const guestState = waitFor(guest, 'game:state');
    const hostUpdate = waitFor(host, 'room:update');
    const joined = await join(guest, created.data.room.code);
    await hostUpdate;

    expect(joined.ok).toBe(true);
    expect(joined.data.room.status).toBe('in-game');

    const [hostView] = await hostState;
    const [guestView] = await guestState;
    expect(hostView.phase).toBe('initialReveal');
    expect(guestView.players).toHaveLength(2);

    host.close();
    guest.close();
  });

  it('démarre automatiquement à 3 joueurs avec un minimum de 3', async () => {
    const host = await connectClient(env.url);
    const created = await new Promise<AckResponse<RoomJoinedData>>((resolve) =>
      host.emit('room:create', { playerName: 'Alice', minPlayers: 3, maxPlayers: 6 }, resolve),
    );
    if (!created.ok) throw new Error('création échouée');

    const guest1 = await connectClient(env.url);
    const guest2 = await connectClient(env.url);
    const hostState = waitFor(host, 'game:state');
    const joined1 = await join(guest1, created.data.room.code);
    expect(joined1.ok).toBe(true);
    expect(joined1.data.room.status).toBe('lobby');

    const joined2 = await join(guest2, created.data.room.code);
    expect(joined2.ok).toBe(true);
    expect(joined2.data.room.status).toBe('in-game');

    const [hostView] = await hostState;
    expect(hostView.players).toHaveLength(3);

    host.close();
    guest1.close();
    guest2.close();
  });

  it('refuse le démarrage par un joueur non hôte', async () => {
    const host = await connectClient(env.url);
    const created = await create(host);
    if (!created.ok) throw new Error('création échouée');

    const guest = await connectClient(env.url);
    await join(guest, created.data.room.code);

    const ack = await start(guest);
    expect(ack.ok).toBe(false);

    host.close();
    guest.close();
  });
});
