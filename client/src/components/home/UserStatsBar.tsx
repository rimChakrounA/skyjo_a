import {
  getUserLevel,
  getWinRate,
  type UserStats,
} from '@/hooks/useUserStats';
import styles from './UserStatsBar.module.css';

export interface UserStatsBarProps {
  stats: UserStats | null;
  loading?: boolean;
}

function GamepadIcon(): JSX.Element {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="2" y="6" width="20" height="12" rx="4" stroke="currentColor" strokeWidth="2" />
      <path d="M8 12h4M10 10v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="16" cy="11" r="1" fill="currentColor" />
      <circle cx="18" cy="13" r="1" fill="currentColor" />
    </svg>
  );
}

function TrophyIcon(): JSX.Element {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M8 21h8M12 17v4M6 4h12l1 7H5l1-7zM7 11v5a5 5 0 0 0 10 0v-5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChartIcon(): JSX.Element {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 19V5M4 19h16M8 17V11M12 17V7M16 17v-4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function StarIcon(): JSX.Element {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 2l2.4 7.4H22l-6 4.6 2.3 7L12 17.8 5.7 21l2.3-7-6-4.6h7.6L12 2z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Stats personnelles — écran dashboard (compte connecté). */
export function UserStatsBar({ stats, loading = false }: UserStatsBarProps): JSX.Element {
  const played = stats?.played ?? 0;
  const wins = stats?.wins ?? 0;
  const winRate = getWinRate(played, wins);
  const level = getUserLevel(wins);

  return (
    <div className={styles.bar} role="status" aria-busy={loading}>
      <div className={styles.stat}>
        <span className={styles.icon}>
          <GamepadIcon />
        </span>
        <span className={styles.label}>
          <strong>{played}</strong> parties jouées
        </span>
      </div>
      <div className={styles.divider} />
      <div className={styles.stat}>
        <span className={styles.icon}>
          <TrophyIcon />
        </span>
        <span className={styles.label}>
          <strong>{wins}</strong> victoires
        </span>
      </div>
      <div className={styles.divider} />
      <div className={styles.stat}>
        <span className={styles.icon}>
          <ChartIcon />
        </span>
        <span className={styles.label}>
          <strong>{winRate} %</strong> taux de victoire
        </span>
      </div>
      <div className={styles.divider} />
      <div className={styles.stat}>
        <span className={styles.icon}>
          <StarIcon />
        </span>
        <span className={styles.label}>
          {level.label} <strong>Niveau {level.level}</strong>
        </span>
      </div>
    </div>
  );
}
