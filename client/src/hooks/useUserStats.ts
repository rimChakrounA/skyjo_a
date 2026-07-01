import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { loadToken } from '@/services/authService';

const SERVER_URL = import.meta.env.VITE_SERVER_URL ?? 'http://localhost:3001';

export interface UserStats {
  played: number;
  wins: number;
  avgScore: number;
  bestScore: number;
}

export interface UserLevel {
  level: number;
  label: string;
}

export function getUserLevel(wins: number): UserLevel {
  if (wins >= 20) {
    return { level: 4, label: 'Expert' };
  }
  if (wins >= 10) {
    return { level: 3, label: 'Confirmé' };
  }
  if (wins >= 3) {
    return { level: 2, label: 'Initié' };
  }
  return { level: 1, label: 'Débutant' };
}

export function getWinRate(played: number, wins: number): number {
  if (played === 0) {
    return 0;
  }
  return Math.round((wins / played) * 100);
}

export interface UseUserStatsResult {
  stats: UserStats | null;
  loading: boolean;
}

/** Charge les statistiques du compte connecté. */
export function useUserStats(enabled: boolean): UseUserStatsResult {
  const { user } = useAuth();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!enabled || user === null) {
      setStats(null);
      setLoading(false);
      return;
    }

    const token = loadToken();
    if (token === null) {
      setStats(null);
      return;
    }

    setLoading(true);
    void fetch(`${SERVER_URL}/api/users/me/stats`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        if (!res.ok) {
          throw new Error('Stats indisponibles.');
        }
        const data = (await res.json()) as { stats: UserStats };
        setStats(data.stats);
      })
      .catch(() => {
        setStats(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [enabled, user]);

  return { stats, loading };
}
