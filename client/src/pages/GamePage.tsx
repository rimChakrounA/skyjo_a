import type { ReactNode } from 'react';
import { useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Board } from '@/components/Board';
import { DiscardPile } from '@/components/DiscardPile';
import { GameOver } from '@/components/GameOver';
import { GameHeader } from '@/components/game/GameHeader';
import { GameRulesBanner } from '@/components/game/GameRulesBanner';
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
import { assignPlayerAvatars } from '@/utils/playerAvatar';
import styles from './GamePage.module.css';

function GameScene({
  children,
  compact = false,
  footer,
}: {
  children: ReactNode;
  compact?: boolean;
  footer?: ReactNode;
}): JSX.Element {
  return (
    <MainLayout variant="scene">
      <SceneShell compact={compact} footer={footer}>
        {children}
      </SceneShell>
    </MainLayout>
  );
}

export function GamePage(): JSX.Element {
  const { code = '' } = useParams();
  const navigate = useNavigate();
  const { selfId } = useSocket();
  const { roomSummary, closedReason, rematchRoomCode, clearRematchRoomCode, reset } = useGameState();
  const game = useGame();
  const { gameState } = game;
  const playerAvatarKey = gameState?.players.map((player) => player.id).sort().join('|') ?? '';
  const playerAvatars = useMemo(
    () => assignPlayerAvatars(gameState?.players.map((player) => player.id) ?? []),
    [playerAvatarKey],
  );

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

  const gameFooter = (
    <footer className={styles.gameFooter}>
      <Button variant="navy" size="sm" onClick={() => navigate(`/room/${code}`)}>
        Salon · {roomSummary?.players.length ?? '—'} joueurs
      </Button>
      <Button variant="ghost" size="sm" disabled title="Bientôt disponible">
        Chat
      </Button>
    </footer>
  );

  if (gameState === null) {
    return (
      <GameScene compact footer={gameFooter}>
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
      <GameScene footer={gameFooter}>
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
  const currentPlayer = gameState.players.find((player) => player.id === gameState.currentPlayerId) ?? null;
  const maxTotalScore = Math.max(0, ...gameState.players.map((player) => player.totalScore));
  const showTurnBanner =
    gameState.phase !== 'roundOver' &&
    currentPlayer !== null &&
    (gameState.phase === 'playing' || gameState.phase === 'initialReveal' || gameState.phase === 'lastRound');

  return (
    <GameScene compact footer={gameFooter}>
      <Panel className={styles.gamePanel} padding="md">
        <GameHeader
          round={gameState.round}
          currentPlayerName={currentPlayer?.name ?? null}
          showTurnBanner={showTurnBanner}
          maxTotalScore={maxTotalScore}
          onQuit={() => void backToLobby()}
        />

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
              avatar={playerAvatars.get(self.id)!}
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
              avatar={playerAvatars.get(player.id)!}
              isSelf={false}
              isCurrent={game.isPlayerActive(player.id)}
            />
          ))}
        </div>

        <GameRulesBanner />
      </Panel>
    </GameScene>
  );
}
