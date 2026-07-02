import type { CardValue } from '@shared/types/game.js';
import { Button } from '@/components/ui/Button';
import { CardView } from './CardView';
import styles from './DiscardPile.module.css';

export interface DiscardPileProps {
  discardTop: CardValue | null;
  deckCount: number;
  drawnCard: CardValue | null;
  canDraw: boolean;
  canTake: boolean;
  canDiscardDrawn: boolean;
  compact?: boolean;
  onDraw: () => void;
  onTake: () => void;
  onDiscardDrawn: () => void;
}

function deckLabel(count: number): string {
  return `Pioche (${count} carte${count !== 1 ? 's' : ''})`;
}

export function DiscardPile({
  discardTop,
  deckCount,
  drawnCard,
  canDraw,
  canTake,
  canDiscardDrawn,
  compact = false,
  onDraw,
  onTake,
  onDiscardDrawn,
}: DiscardPileProps): JSX.Element {
  const discardKey = discardTop === null ? 'empty' : String(discardTop);

  return (
    <div className={`${styles.area} ${compact ? styles.compact : ''}`}>
      <div className={styles.pilesRow}>
        <div className={styles.pilesMain}>
          <div className={styles.pile}>
            <span className={styles.label}>{deckLabel(deckCount)}</span>
            <div className={`${styles.pileStack} ${styles.drawStack}`}>
              <div className={styles.deckLayers} aria-hidden="true">
                <span className={styles.deckLayer} />
                <span className={styles.deckLayer} />
              </div>
              <CardView
                cell={{ faceUp: false }}
                clickable={canDraw}
                ariaLabel="Piocher une carte"
                onClick={canDraw ? onDraw : undefined}
              />
            </div>
            <Button
              variant="accent"
              size="sm"
              fullWidth
              disabled={!canDraw}
              className={styles.actionBtn}
              onClick={onDraw}
            >
              Piocher
            </Button>
          </div>

          <div className={styles.ou} aria-hidden="true">
            <span>ou</span>
          </div>

          <div className={styles.pile}>
            <span className={styles.label}>Défausse</span>
            <div className={styles.pileStack}>
              <div key={discardKey} className={styles.discardChange}>
                <CardView
                  cell={discardTop === null ? null : { faceUp: true, value: discardTop }}
                  clickable={canTake}
                  ariaLabel="Prendre la carte de la défausse"
                  onClick={canTake ? onTake : undefined}
                />
              </div>
            </div>
            <Button
              variant="primary"
              size="sm"
              fullWidth
              disabled={!canTake}
              className={styles.actionBtn}
              onClick={onTake}
            >
              <span className={styles.btnLabelFull}>Prendre la défausse</span>
              <span className={styles.btnLabelShort}>Prendre</span>
            </Button>
          </div>
        </div>

        {drawnCard !== null && (
          <div className={`${styles.pile} ${styles.handPile}`}>
            <span className={styles.label}>En main</span>
            <div className={styles.pileStack}>
              <CardView
                cell={{ faceUp: true, value: drawnCard }}
                clickable={canDiscardDrawn}
                ariaLabel={`Carte piochée : ${drawnCard}`}
                onClick={canDiscardDrawn ? onDiscardDrawn : undefined}
              />
            </div>
            <Button
              variant="danger"
              size="sm"
              fullWidth
              disabled={!canDiscardDrawn}
              className={styles.actionBtn}
              onClick={onDiscardDrawn}
            >
              Défausser
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
