import { createServer, type Server } from 'node:http';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';

vi.mock('../src/repositories/finishedGameRepository.js', () => ({
  findFinishedGame: vi.fn(async (_prisma: unknown, id: string) =>
    id === 'known' ? { id: 'known', code: 'ABCDE', players: [] } : null,
  ),
  saveFinishedGame: vi.fn(),
}));

const { createApp } = await import('../src/app.js');

let server: Server;
let baseUrl: string;

beforeAll(async () => {
  server = createServer(createApp());
  await new Promise<void>((resolve) => server.listen(0, resolve));
  const address = server.address();
  if (address === null || typeof address === 'string') {
    throw new Error('Adresse de test indisponible.');
  }
  baseUrl = `http://localhost:${address.port}`;
});

afterAll(async () => {
  await new Promise<void>((resolve, reject) => {
    server.close((err) => (err ? reject(err) : resolve()));
  });
});

describe('GET /api/games/:id', () => {
  it('renvoie 404 pour une partie inconnue', async () => {
    const response = await fetch(`${baseUrl}/api/games/unknown`);
    expect(response.status).toBe(404);
  });

  it('renvoie 200 pour une partie connue', async () => {
    const response = await fetch(`${baseUrl}/api/games/known`);
    expect(response.status).toBe(200);
    const body = (await response.json()) as { id: string };
    expect(body.id).toBe('known');
  });
});
