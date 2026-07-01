import type { RoomPlayer } from '@shared/types/room.js';
import { Badge } from '@/components/ui/Badge';
import styles from './PlayerList.module.css';

export interface PlayerListProps {
  players: RoomPlayer[];
  currentSocketId: string | null;
}

export function PlayerList({ players, currentSocketId }: PlayerListProps): JSX.Element {
  return (
    <ul className={styles.list}>
      {players.map((player) => (
        <li key={player.id} className={styles.item}>
          <span className={styles.name}>
            {player.name}
            {player.id === currentSocketId && <span className={styles.you}> (vous)</span>}
          </span>
          <span className={styles.tags}>
            {player.isHost && <Badge variant="primary">Hôte</Badge>}
            {!player.connected && <Badge variant="danger">Déconnecté</Badge>}
          </span>
        </li>
      ))}
    </ul>
  );
}
