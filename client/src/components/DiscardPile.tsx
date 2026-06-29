import type { CardValue } from '@shared/types/game.js';
import { CardView } from './CardView';
import styles from './DiscardPile.module.css';

export interface DiscardPileProps {
  discardTop: CardValue | null;
  deckCount: number;
  drawnCard: CardValue | null;
  canDraw: boolean;
  canTake: boolean;
  canDiscardDrawn: boolean;
  onDraw: () => void;
  onTake: () => void;
  onDiscardDrawn: () => void;
}

export function DiscardPile({
  discardTop,
  deckCount,
  drawnCard,
  canDraw,
  canTake,
  canDiscardDrawn,
  onDraw,
  onTake,
  onDiscardDrawn,
}: DiscardPileProps): JSX.Element {
  return (
    <div className={styles.area}>
      <div className={styles.pile}>
        <span className={styles.label}>Pioche ({deckCount})</span>
        <CardView cell={{ faceUp: false }} clickable={canDraw} onClick={canDraw ? onDraw : undefined} />
        {canDraw && (
          <button type="button" onClick={onDraw}>
            Piocher
          </button>
        )}
      </div>

      <div className={styles.pile}>
        <span className={styles.label}>Défausse</span>
        <CardView
          cell={discardTop === null ? null : { faceUp: true, value: discardTop }}
          clickable={canTake}
          onClick={canTake ? onTake : undefined}
        />
        {canTake && (
          <button type="button" className="secondary" onClick={onTake}>
            Prendre
          </button>
        )}
      </div>

      {drawnCard !== null && (
        <div className={styles.pile}>
          <span className={styles.label}>Carte en main</span>
          <CardView cell={{ faceUp: true, value: drawnCard }} />
          {canDiscardDrawn && (
            <button type="button" className="secondary" onClick={onDiscardDrawn}>
              Défausser
            </button>
          )}
        </div>
      )}
    </div>
  );
}
