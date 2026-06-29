import type { PublicGameState } from '@shared/types/game.js';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Board } from '@/components/Board';
import { DiscardPile } from '@/components/DiscardPile';
import { GameOver } from '@/components/GameOver';
import { Scoreboard } from '@/components/Scoreboard';
import { useGame } from '@/hooks/useGame';
import { useGameState } from '@/hooks/useGameState';
import { useSocket } from '@/hooks/useSocket';
import { MainLayout } from '@/layouts/MainLayout';
import { leaveRoom } from '@/services/socket';
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

export function GamePage(): JSX.Element {
  const navigate = useNavigate();
  const { socketId } = useSocket();
  const { roomSummary, closedReason, reset } = useGameState();
  const game = useGame();
  const { gameState } = game;

  useEffect(() => {
    if (closedReason !== null) {
      window.alert(closedReason);
      navigate('/');
    }
  }, [closedReason, navigate]);

  const backToLobby = async (): Promise<void> => {
    await leaveRoom();
    reset();
    navigate('/');
  };

  if (gameState === null) {
    return (
      <MainLayout>
        <div className={styles.center}>
          <p>En attente de la partie…</p>
          <button type="button" className="secondary" onClick={() => void backToLobby()}>
            Retour à l’accueil
          </button>
        </div>
      </MainLayout>
    );
  }

  if (gameState.phase === 'gameOver') {
    return (
      <MainLayout>
        <GameOver
          players={gameState.players}
          winnerId={gameState.winnerId}
          onBackToLobby={() => void backToLobby()}
        />
      </MainLayout>
    );
  }

  const isHost = roomSummary?.hostId === socketId;
  const self = gameState.players.find((player) => player.id === socketId) ?? null;
  const others = gameState.players.filter((player) => player.id !== socketId);

  return (
    <MainLayout>
      <div className={styles.game}>
        <div className={styles.status}>
          <span className={styles.round}>Manche {gameState.round}</span>
          <span className={styles.instruction}>{instruction(gameState, game.isMyTurn)}</span>
        </div>

        {game.error !== null && <p className={styles.error}>{game.error}</p>}

        {gameState.phase === 'roundOver' ? (
          <div className={styles.roundOver}>
            <Scoreboard players={gameState.players} roundEnderId={gameState.roundEnderId} />
            {isHost ? (
              <button type="button" onClick={game.nextRound}>
                Manche suivante
              </button>
            ) : (
              <p className={styles.waiting}>En attente de la manche suivante…</p>
            )}
          </div>
        ) : (
          <DiscardPile
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
              player={self}
              isSelf
              isCurrent={gameState.currentPlayerId === self.id}
              canClick={(index) => game.canClickCard(self.id, index)}
              onCardClick={(index) => game.onCardClick(self.id, index)}
            />
          )}
          {others.map((player) => (
            <Board
              key={player.id}
              player={player}
              isSelf={false}
              isCurrent={gameState.currentPlayerId === player.id}
            />
          ))}
        </div>

        <button type="button" className="secondary" onClick={() => void backToLobby()}>
          Quitter la partie
        </button>
      </div>
    </MainLayout>
  );
}
