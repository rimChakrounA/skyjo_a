import type { RoomSummary } from '@shared/types/room.js';
import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { PlayerList } from '@/components/PlayerList';
import { useGameState } from '@/hooks/useGameState';
import { usePlayerIdentity } from '@/hooks/usePlayerIdentity';
import { useSocket } from '@/hooks/useSocket';
import { MainLayout } from '@/layouts/MainLayout';
import { clearSession } from '@/services/identity';
import { joinRoom, leaveRoom, startGame } from '@/services/socket';
import type { RoomLocationState } from '@/types/navigation';
import styles from './RoomPage.module.css';

export function RoomPage(): JSX.Element {
  const { code = '' } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { socket, socketId, playerId } = useSocket();
  const { name } = usePlayerIdentity();
  const { gameState, closedReason, reset } = useGameState();

  const initialRoom = (location.state as RoomLocationState | null)?.room ?? null;
  const [room, setRoom] = useState<RoomSummary | null>(initialRoom);
  const [error, setError] = useState<string | null>(null);
  const joinAttempted = useRef(false);

  useEffect(() => {
    const onUpdate = (summary: RoomSummary): void => setRoom(summary);
    socket.on('room:update', onUpdate);
    return () => {
      socket.off('room:update', onUpdate);
    };
  }, [socket]);

  // Rejoint la salle en cas d'accès direct / rafraîchissement.
  useEffect(() => {
    if (initialRoom !== null || joinAttempted.current) {
      return;
    }
    joinAttempted.current = true;
    if (name.trim().length === 0) {
      navigate('/');
      return;
    }
    void joinRoom(code, name.trim()).then((response) => {
      if (response.ok) {
        setRoom(response.data.room);
      } else {
        setError(response.error);
      }
    });
  }, [initialRoom, name, code, navigate]);

  // Navigue vers la partie dès qu'un état de jeu est disponible.
  useEffect(() => {
    if (gameState !== null) {
      navigate(`/game/${code}`);
    }
  }, [gameState, code, navigate]);

  // Retour à l'accueil si la salle est fermée.
  useEffect(() => {
    if (closedReason !== null) {
      navigate('/');
    }
  }, [closedReason, navigate]);

  const handleStart = async (): Promise<void> => {
    setError(null);
    const response = await startGame();
    if (!response.ok) {
      setError(response.error);
    }
  };

  const handleLeave = async (): Promise<void> => {
    clearSession();
    await leaveRoom();
    reset();
    navigate('/');
  };

  if (room === null) {
    return (
      <MainLayout>
        <p>Connexion à la salle…</p>
      </MainLayout>
    );
  }

  const isHost = room.hostId === (playerId ?? socketId);
  const canStart = isHost && room.players.length >= room.minPlayers;

  return (
    <MainLayout>
      <section className={styles.room}>
        <header className={styles.head}>
          <div>
            <h2 className={styles.heading}>Salle</h2>
            <p className={styles.code}>
              Code : <strong>{room.code}</strong> · {room.players.length} / {room.maxPlayers}{' '}
              joueurs (min. {room.minPlayers})
            </p>
          </div>
          <div className={styles.headerActions}>
            <button
              type="button"
              className="secondary"
              title="Copier le lien d'invitation"
              onClick={() => {
                const base = window.location.href.split('#')[0];
                const link = `${base}#/join/${room.code}`;
                void navigator.clipboard.writeText(link);
              }}
            >
              Copier le lien
            </button>
            <button type="button" className="secondary" onClick={() => void handleLeave()}>
              Quitter
            </button>
          </div>
        </header>

        <PlayerList players={room.players} currentSocketId={playerId ?? socketId} />

        {error !== null && <p className={styles.error}>{error}</p>}

        {isHost ? (
          <button type="button" disabled={!canStart} onClick={() => void handleStart()}>
            Démarrer la partie
          </button>
        ) : (
          <p className={styles.waiting}>En attente du lancement par l’hôte…</p>
        )}

        {isHost && room.players.length < room.minPlayers && (
          <p className={styles.hint}>Il faut au moins {room.minPlayers} joueurs pour commencer.</p>
        )}
      </section>
    </MainLayout>
  );
}
