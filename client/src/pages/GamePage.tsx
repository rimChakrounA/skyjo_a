import type { PublicGameState } from '@shared/types/game.js';
import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Board } from '@/components/Board';
import { DiscardPile } from '@/components/DiscardPile';
import { GameOver } from '@/components/GameOver';
import { SceneShell } from '@/components/home/SceneShell';
import { Scoreboard } from '@/components/Scoreboard';
import { useGame } from '@/hooks/useGame';
import { useGameState } from '@/hooks/useGameState';
import { useSocket } from '@/hooks/useSocket';
import { Button } from '@/components/ui/Button';
import { Panel } from '@/components/ui/Panel';
import { MainLayout } from '@/layouts/MainLayout';
import { clearSession } from '@/services/identity';
import { leaveRoom, requestRematch } from '@/services/socket';
import styles from './GamePage.module.css';

function instruction(state: PublicGameState, isMyTurn: boolean): string {
  if (state.phase === 'initialReveal') {
    return 'Révélez deux de vos cartes pour commencer.';
  }
  if (state.phase === 'roundOver') {
    return 'Manche terminée.';
  }
  if (!isMyTurn) {
    const current = state.players.find((player) => player.id === state.currentPlayerId);
    return `Au tour de ${current?.name ?? '...'}.`;
  }
  switch (state.turnPhase) {
    case 'chooseSource':
      return 'À vous : piochez ou prenez la défausse.';
    case 'resolveDraw':
      return 'Remplacez une carte ou défaussez la carte piochée.';
    case 'resolveTake':
      return 'Choisissez la carte à remplacer.';
    case 'flip':
      return 'Révélez une carte cachée.';
    default:
      return '';
  }
}

function GameScene({ children, compact = false }: { children: ReactNode; compact?: boolean }): JSX.Element {
  return (
    <MainLayout variant="scene">
      <SceneShell compact={compact}>{children}</SceneShell>
    </MainLayout>
  );
}

export function GamePage(): JSX.Element {
  const navigate = useNavigate();
  const { selfId } = useSocket();
  const { roomSummary, closedReason, rematchRoomCode, clearRematchRoomCode, reset } = useGameState();
  const game = useGame();
  const { gameState } = game;

  useEffect(() => {
    if (closedReason !== null) {
      window.alert(closedReason);
      navigate('/');
    }
  }, [closedReason, navigate]);

  useEffect(() => {
    if (rematchRoomCode !== null) {
      clearRematchRoomCode();
      navigate(`/room/${rematchRoomCode}`);
    }
  }, [rematchRoomCode, clearRematchRoomCode, navigate]);

  const backToLobby = async (): Promise<void> => {
    clearSession();
    await leaveRoom();
    reset();
    navigate('/');
  };

  if (gameState === null) {
    return (
      <GameScene compact>
        <Panel className={styles.centerPanel} padding="md">
          <h2 className={styles.pageTitle}>Partie en cours</h2>
          <p className={styles.pageMeta}>En attente de la partie…</p>
          <Button variant="secondary" onClick={() => void backToLobby()}>
            Retour à l&apos;accueil
          </Button>
        </Panel>
      </GameScene>
    );
  }

  const isHost = roomSummary?.hostId === selfId;

  if (gameState.phase === 'gameOver') {
    return (
      <GameScene>
        <GameOver
          players={gameState.players}
          winnerId={gameState.winnerId}
          isHost={isHost}
          onRematch={() => void requestRematch()}
          onBackToLobby={() => void backToLobby()}
        />
      </GameScene>
    );
  }

  const self = selfId !== null ? (gameState.players.find((player) => player.id === selfId) ?? null) : null;
  const others = selfId !== null ? gameState.players.filter((player) => player.id !== selfId) : gameState.players;

  return (
    <GameScene compact>
      <Panel className={styles.gamePanel} padding="sm">
        <div className={styles.topBar}>
          <div className={styles.statusLine}>
            <span className={styles.round}>Manche {gameState.round}</span>
            <span className={styles.dot} aria-hidden="true">
              ·
            </span>
            <p className={styles.instruction}>{instruction(gameState, game.isMyTurn)}</p>
          </div>
          <Button variant="danger" size="sm" onClick={() => void backToLobby()}>
            Quitter
          </Button>
        </div>

        {game.error !== null && <p className={styles.error}>{game.error}</p>}

        {self === null && (
          <p className={styles.error}>
            Impossible d&apos;identifier votre joueur. Quittez la partie et rejoignez la salle à nouveau.
          </p>
        )}

        {gameState.phase === 'roundOver' ? (
          <div className={styles.roundOver}>
            <Scoreboard players={gameState.players} roundEnderId={gameState.roundEnderId} />
            {isHost ? (
              <Button fullWidth onClick={game.nextRound}>
                Manche suivante
              </Button>
            ) : (
              <p className={styles.waiting}>En attente de la manche suivante…</p>
            )}
          </div>
        ) : (
          <DiscardPile
            compact
            discardTop={gameState.discardTop}
            deckCount={gameState.deckCount}
            drawnCard={gameState.drawnCard}
            canDraw={game.canDraw}
            canTake={game.canTake}
            canDiscardDrawn={game.canDiscardDrawn}
            onDraw={game.draw}
            onTake={game.takeDiscard}
            onDiscardDrawn={game.discardDrawn}
          />
        )}

        <div className={styles.boards}>
          {self !== null && (
            <Board
              compact
              player={self}
              isSelf
              isCurrent={game.isPlayerActive(self.id)}
              canClick={(index) => game.canClickCard(selfId ?? self.id, index)}
              onCardClick={(index) => game.onCardClick(selfId ?? self.id, index)}
            />
          )}
          {others.map((player) => (
            <Board
              key={player.id}
              compact
              player={player}
              isSelf={false}
              isCurrent={game.isPlayerActive(player.id)}
            />
          ))}
        </div>
      </Panel>
    </GameScene>
  );
}
