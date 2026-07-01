import type { GamePhase } from '@shared/types/game.js';
import type { PublicRoomListItem } from '@shared/types/room.js';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import styles from './RoomList.module.css';

const PHASE_LABELS: Record<GamePhase, string> = {
  initialReveal: 'Révélation initiale',
  playing: 'En jeu',
  lastRound: 'Dernière manche',
  roundOver: 'Fin de manche',
  gameOver: 'Partie terminée',
};

export interface RoomListProps {
  rooms: PublicRoomListItem[];
  loading: boolean;
  error: string | null;
  onJoin: (code: string) => void;
  busy: boolean;
}

export function RoomList({ rooms, loading, error, onJoin, busy }: RoomListProps): JSX.Element {
  const lobbyRooms = rooms.filter((room) => room.status === 'lobby');
  const inGameRooms = rooms.filter((room) => room.status === 'in-game');

  if (loading && rooms.length === 0) {
    return <p className={styles.status}>Chargement des salles…</p>;
  }

  if (error !== null) {
    return <p className={styles.error}>{error}</p>;
  }

  if (rooms.length === 0) {
    return <p className={styles.status}>Aucune salle active pour le moment.</p>;
  }

  return (
    <div className={styles.lists}>
      {lobbyRooms.length > 0 && (
        <section className={styles.section}>
          <h3 className={styles.heading}>Salles ouvertes</h3>
          <ul className={styles.list}>
            {lobbyRooms.map((room) => (
              <li key={room.code} className={styles.item}>
                <div className={styles.itemHeader}>
                  <div className={styles.meta}>
                    <span className={styles.code}>{room.code}</span>
                    <span>Hôte : {room.hostName}</span>
                    <span>
                      {room.playerCount} / {room.maxPlayers} joueurs · min. {room.minPlayers}
                    </span>
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    disabled={busy || room.playerCount >= room.maxPlayers}
                    onClick={() => onJoin(room.code)}
                  >
                    {room.playerCount >= room.maxPlayers ? 'Complète' : 'Rejoindre'}
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {inGameRooms.length > 0 && (
        <section className={styles.section}>
          <h3 className={styles.heading}>Parties en cours</h3>
          <ul className={styles.list}>
            {inGameRooms.map((room) => (
              <li key={room.code} className={styles.item}>
                <div className={styles.meta}>
                  <span className={styles.code}>{room.code}</span>
                  <span>
                    {room.playerCount} joueur{room.playerCount > 1 ? 's' : ''} ·{' '}
                    {room.connectedCount} connecté{room.connectedCount > 1 ? 's' : ''}
                  </span>
                  {room.round !== undefined && <span>Manche {room.round}</span>}
                  {room.phase !== undefined && (
                    <Badge variant="accent">{PHASE_LABELS[room.phase]}</Badge>
                  )}
                  {room.currentPlayerName !== undefined && room.currentPlayerName !== null && (
                    <span>Tour de {room.currentPlayerName}</span>
                  )}
                </div>
                {room.standings !== undefined && room.standings.length > 0 && (
                  <ul className={styles.scores}>
                    {room.standings.map((entry) => (
                      <li key={entry.name} className={styles.scoreChip}>
                        {entry.name} — {entry.totalScore} pts
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
