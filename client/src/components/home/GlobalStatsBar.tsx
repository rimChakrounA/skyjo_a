import type { PublicRoomListItem } from '@shared/types/room.js';
import styles from './GlobalStatsBar.module.css';

export interface GlobalStatsBarProps {
  rooms: PublicRoomListItem[];
}

function UsersIcon(): JSX.Element {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="9" cy="8" r="3" stroke="currentColor" strokeWidth="2" />
      <circle cx="17" cy="9" r="2.5" stroke="currentColor" strokeWidth="2" />
      <path
        d="M3 20c0-3.5 2.7-6 6-6M14 20c0-2.5 2-4.5 4.5-4.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
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

/** Stats globales du site — écran landing. */
export function GlobalStatsBar({ rooms }: GlobalStatsBarProps): JSX.Element {
  const inGame = rooms.filter((r) => r.status === 'in-game').length;
  const lobby = rooms.filter((r) => r.status === 'lobby').length;
  const players = rooms.reduce((sum, r) => sum + r.playerCount, 0);
  const totalGames = inGame + lobby;

  return (
    <div className={styles.bar} role="status">
      <div className={styles.stat}>
        <span className={styles.icon}>
          <UsersIcon />
        </span>
        <span className={styles.label}>
          <strong>{players}</strong> joueurs en ligne
        </span>
      </div>
      <div className={styles.divider} />
      <div className={styles.stat}>
        <span className={styles.icon}>
          <GamepadIcon />
        </span>
        <span className={styles.label}>
          <strong>{totalGames}</strong> parties jouées
        </span>
      </div>
      <div className={styles.divider} />
      <div className={styles.stat}>
        <span className={styles.icon}>
          <TrophyIcon />
        </span>
        <span className={styles.label}>
          <strong>{lobby}</strong> salles actives
        </span>
      </div>
    </div>
  );
}
