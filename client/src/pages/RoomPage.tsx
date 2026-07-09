import type { RoomSummary } from '@shared/types/room.js';
import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { SceneShell } from '@/components/home/SceneShell';
import { PlayerList } from '@/components/PlayerList';
import { Button } from '@/components/ui/Button';
import { Panel } from '@/components/ui/Panel';
import { useGameState } from '@/hooks/useGameState';
import { usePlayerIdentity } from '@/hooks/usePlayerIdentity';
import { useSocket } from '@/hooks/useSocket';
import { MainLayout } from '@/layouts/MainLayout';
import { clearSession } from '@/services/identity';
import { joinRoom, leaveRoom } from '@/services/socket';
import type { RoomLocationState } from '@/types/navigation';
import { assetUrl } from '@/utils/assetUrl';
import styles from './RoomPage.module.css';

function LinkIcon(): JSX.Element {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" width="18" height="18">
      <path
        d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function RoomPage(): JSX.Element {
  const { code = '' } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { socket, socketId, selfId } = useSocket();
  const { name } = usePlayerIdentity();
  const { gameState, closedReason, reset } = useGameState();

  const initialRoom = (location.state as RoomLocationState | null)?.room ?? null;
  const [room, setRoom] = useState<RoomSummary | null>(initialRoom);
  const [joining, setJoining] = useState(initialRoom === null);
  const [error, setError] = useState<string | null>(null);
  const joinAttempted = useRef(false);

  useEffect(() => {
    const onUpdate = (summary: RoomSummary): void => setRoom(summary);
    socket.on('room:update', onUpdate);
    return () => {
      socket.off('room:update', onUpdate);
    };
  }, [socket]);

  useEffect(() => {
    if (initialRoom !== null || joinAttempted.current) {
      return;
    }
    joinAttempted.current = true;
    if (name.trim().length === 0) {
      navigate('/');
      return;
    }
    setJoining(true);
    void joinRoom(code, name.trim()).then((response) => {
      setJoining(false);
      if (response.ok) {
        setRoom(response.data.room);
      } else {
        setError(response.error);
      }
    });
  }, [initialRoom, name, code, navigate]);

  useEffect(() => {
    if (gameState !== null) {
      navigate(`/game/${code}`);
    }
  }, [gameState, code, navigate]);

  useEffect(() => {
    if (closedReason !== null) {
      navigate('/');
    }
  }, [closedReason, navigate]);

  const handleLeave = async (): Promise<void> => {
    clearSession();
    await leaveRoom();
    reset();
    navigate('/');
  };

  if (room === null) {
    return (
      <MainLayout variant="scene">
        <SceneShell>
          <Panel className={styles.roomCard} padding="lg">
            <div className={styles.roomHeader}>
              {joining ? (
                <>
                  <h2 className={styles.roomTitle}>Connexion à la salle…</h2>
                  <p className={styles.roomMeta}>
                    Code : <strong className={styles.roomCode}>{code.toUpperCase()}</strong>
                    {' · '}
                    Veuillez patienter un instant
                  </p>
                </>
              ) : (
                <>
                  <h2 className={styles.roomTitle}>Impossible de rejoindre</h2>
                  {error !== null && <p className={styles.error}>{error}</p>}
                  <div className={styles.actions}>
                    <Button fullWidth size="lg" onClick={() => navigate('/')}>
                      Retour à l&apos;accueil
                    </Button>
                  </div>
                </>
              )}
            </div>
          </Panel>
        </SceneShell>
      </MainLayout>
    );
  }

  const waitingForPlayers = room.players.length < room.minPlayers;
  const slotsLeft = room.maxPlayers - room.players.length;
  const missingPlayers = room.minPlayers - room.players.length;
  const slotsHint =
    slotsLeft > 0
      ? ` · ${slotsLeft} place${slotsLeft > 1 ? 's' : ''} restante${slotsLeft > 1 ? 's' : ''}`
      : '';

  return (
    <MainLayout variant="scene">
      <SceneShell>
        <Panel className={styles.roomCard} padding="lg">
          <div className={styles.roomHeader}>
            <h2 className={styles.roomTitle}>Salle d&apos;attente</h2>
            <p className={styles.roomMeta}>
              Code : <strong className={styles.roomCode}>{room.code}</strong>
              {' · '}
              {room.players.length} / {room.maxPlayers} joueurs · démarrage auto à{' '}
              {room.minPlayers}
            </p>
          </div>

          <div className={styles.illustration}>
            <img
              className={styles.illustrationImg}
              src={assetUrl('characters/players-home.png')}
              alt="Joueurs autour d'une table de cartes"
              loading="lazy"
            />
          </div>

          <header className={styles.head}>
            <div>
              <h3 className={styles.cardTitle}>Joueurs connectés</h3>
              <p className={styles.cardSubtitle}>
                {waitingForPlayers
                  ? 'En attente de joueurs pour lancer la partie'
                  : 'La partie démarre automatiquement…'}
              </p>
            </div>
            <div className={styles.headerActions}>
              <Button
                variant="accent"
                size="sm"
                icon={<LinkIcon />}
                title="Copier le lien d'invitation"
                onClick={() => {
                  const base = window.location.href.split('#')[0];
                  const link = `${base}#/join/${room.code}`;
                  void navigator.clipboard.writeText(link);
                }}
              >
                Copier le lien
              </Button>
              <Button variant="danger" size="sm" onClick={() => void handleLeave()}>
                Quitter
              </Button>
            </div>
          </header>

          <PlayerList players={room.players} currentSocketId={selfId ?? socketId} />

          {error !== null && <p className={styles.error}>{error}</p>}

          <div className={styles.actions}>
            {waitingForPlayers ? (
              <p className={styles.waiting}>
                {missingPlayers} joueur{missingPlayers > 1 ? 's' : ''} manquant
                {missingPlayers > 1 ? 's' : ''} pour démarrer{slotsHint}
              </p>
            ) : (
              <p className={styles.waiting}>La partie démarre automatiquement…</p>
            )}
          </div>
        </Panel>
      </SceneShell>
    </MainLayout>
  );
}
