import { createServer, type Server } from 'node:http';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createApp } from '../src/app.js';
import { createRoom } from '../src/services/roomService.js';
import { roomStore } from '../src/services/roomStore.js';

let server: Server;
let baseUrl: string;

beforeAll(async () => {
  server = createServer(createApp());
  await new Promise<void>((resolve) => server.listen(0, resolve));
  const address = server.address();
  if (address === null || typeof address === 'string') {
    throw new Error('Adresse du serveur de test indisponible.');
  }
  baseUrl = `http://localhost:${address.port}`;
});

afterAll(async () => {
  await new Promise<void>((resolve, reject) => {
    server.close((err) => (err ? reject(err) : resolve()));
  });
});

describe('GET /api/rooms', () => {
  it('répond 200 avec la liste publique des salles', async () => {
    createRoom(roomStore, 'host', 'Alice', { minPlayers: 3, maxPlayers: 5 });

    const response = await fetch(`${baseUrl}/api/rooms`);
    expect(response.status).toBe(200);

    const body = (await response.json()) as {
      rooms: Array<{ code: string; hostName: string; minPlayers: number; maxPlayers: number }>;
    };
    expect(body.rooms.length).toBeGreaterThanOrEqual(1);
    const room = body.rooms.find((entry) => entry.hostName === 'Alice');
    expect(room).toMatchObject({ minPlayers: 3, maxPlayers: 5 });
  });
});
