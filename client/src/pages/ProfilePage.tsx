import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { MainLayout } from '@/layouts/MainLayout';
import { loadToken } from '@/services/authService';
import styles from './ProfilePage.module.css';

const SERVER_URL = import.meta.env.VITE_SERVER_URL ?? 'http://localhost:3001';

interface GameEntry {
  id: string;
  code: string;
  rounds: number;
  winnerId: string;
  winnerName: string;
  createdAt: string;
  myScore: number;
  won: boolean;
  players: { name: string; score: number }[];
}

interface Stats {
  played: number;
  wins: number;
  avgScore: number;
  bestScore: number;
}

async function fetchJson<T>(path: string): Promise<T> {
  const token = loadToken();
  const res = await fetch(`${SERVER_URL}${path}`, {
    headers: token !== null ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) {
    throw new Error('Erreur réseau.');
  }
  return res.json() as Promise<T>;
}

export function ProfilePage(): JSX.Element {
  const { user } = useAuth();
  const [games, setGames] = useState<GameEntry[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user === null) return;
    void Promise.all([
      fetchJson<{ games: GameEntry[] }>('/api/users/me/games'),
      fetchJson<{ stats: Stats }>('/api/users/me/stats'),
    ])
      .then(([gData, sData]) => {
        setGames(gData.games);
        setStats(sData.stats);
      })
      .finally(() => setLoading(false));
  }, [user]);

  if (user === null) {
    return <Navigate to="/login" />;
  }

  return (
    <MainLayout>
      <div className={styles.profile}>
        <h2 className={styles.title}>Profil de {user.username}</h2>

        {stats !== null && (
          <section className={styles.statsGrid}>
            <div className={styles.statCard}>
              <span className={styles.statValue}>{stats.played}</span>
              <span className={styles.statLabel}>Parties jouées</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statValue}>{stats.wins}</span>
              <span className={styles.statLabel}>Victoires</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statValue}>
                {stats.played > 0
                  ? `${Math.round((stats.wins / stats.played) * 100)} %`
                  : '—'}
              </span>
              <span className={styles.statLabel}>Taux de victoire</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statValue}>{stats.avgScore}</span>
              <span className={styles.statLabel}>Score moyen</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statValue}>{stats.played > 0 ? stats.bestScore : '—'}</span>
              <span className={styles.statLabel}>Meilleur score</span>
            </div>
          </section>
        )}

        <section>
          <h3 className={styles.subtitle}>Historique des parties</h3>
          {loading ? (
            <p className={styles.empty}>Chargement…</p>
          ) : games.length === 0 ? (
            <p className={styles.empty}>Aucune partie terminée pour le moment.</p>
          ) : (
            <ul className={styles.gameList}>
              {games.map((game) => (
                <li key={game.id} className={`${styles.gameEntry} ${game.won ? styles.won : styles.lost}`}>
                  <div className={styles.gameHeader}>
                    <span className={styles.gameResult}>{game.won ? '🏆 Victoire' : 'Défaite'}</span>
                    <span className={styles.gameDate}>
                      {new Date(game.createdAt).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                  <div className={styles.gameMeta}>
                    <span>{game.rounds} manche{game.rounds > 1 ? 's' : ''}</span>
                    <span>Mon score : <strong>{game.myScore}</strong></span>
                    <span>Vainqueur : {game.winnerName}</span>
                  </div>
                  <ul className={styles.playerScores}>
                    {game.players
                      .sort((a, b) => a.score - b.score)
                      .map((p) => (
                        <li key={p.name}>
                          {p.name} — {p.score}
                        </li>
                      ))}
                  </ul>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </MainLayout>
  );
}
