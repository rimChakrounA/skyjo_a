const SERVER_URL = import.meta.env.VITE_SERVER_URL ?? 'http://localhost:3001';
const TOKEN_KEY = 'skyjo.authToken';

export interface AuthUser {
  id: string;
  username: string;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

/** Enregistre le token JWT localement. */
export function saveToken(token: string): void {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch {
    // ignore
  }
}

/** Charge le token JWT depuis le localStorage. */
export function loadToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

/** Supprime le token JWT. */
export function removeToken(): void {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch {
    // ignore
  }
}

function authHeaders(): HeadersInit {
  const token = loadToken();
  return token !== null ? { Authorization: `Bearer ${token}` } : {};
}

export async function apiRegister(username: string, password: string): Promise<AuthResponse> {
  const res = await fetch(`${SERVER_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify({ username, password }),
  });
  const data = await res.json() as Record<string, unknown>;
  if (!res.ok) {
    throw new Error((data.error as string | undefined) ?? 'Erreur inconnue.');
  }
  return data as unknown as AuthResponse;
}

export async function apiLogin(username: string, password: string): Promise<AuthResponse> {
  const res = await fetch(`${SERVER_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  const data = await res.json() as Record<string, unknown>;
  if (!res.ok) {
    throw new Error((data.error as string | undefined) ?? 'Erreur inconnue.');
  }
  return data as unknown as AuthResponse;
}

export async function apiMe(): Promise<AuthUser | null> {
  const token = loadToken();
  if (token === null) {
    return null;
  }
  const res = await fetch(`${SERVER_URL}/api/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    return null;
  }
  const data = await res.json() as { user: AuthUser };
  return data.user;
}
