import type { CardValue } from '@shared/types/game.js';
import { useGameFeel, useAnchor } from '@/contexts/GameFeelContext';
import { usePileMotion } from '@/hooks/usePileMotion';
import { anchorDeck, anchorDiscard, anchorHand } from '@/utils/gameAnchors';
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
  const deckRef = useAnchor(anchorDeck());
  const discardRef = useAnchor(anchorDiscard());
  const handRef = useAnchor(anchorHand());
  const { isAnchorHidden } = useGameFeel();
  const { discardMotion, handMotion } = usePileMotion(discardTop, drawnCard);

  return (
    <div className={`${styles.area} ${compact ? styles.compact : ''}`}>
      <div className={styles.pilesRow}>
        <div className={styles.pilesMain}>
          <div className={styles.pile}>
            <span className={styles.label}>{deckLabel(deckCount)}</span>
            <div
              ref={deckRef}
              className={`${styles.pileStack} ${styles.drawStack} ${canDraw ? styles.drawReady : ''}`}
            >
              <div className={styles.deckLayers} aria-hidden="true">
                <span className={styles.deckLayer} />
                <span className={styles.deckLayer} />
              </div>
              <CardView
                cell={{ faceUp: false }}
                clickable={canDraw}
                hidden={isAnchorHidden(anchorDeck())}
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
            <div
              ref={discardRef}
              className={`${styles.pileStack} ${canTake ? styles.discardReady : ''}`}
            >
              <CardView
                cell={discardTop === null ? null : { faceUp: true, value: discardTop }}
                motion={discardMotion}
                clickable={canTake}
                hidden={isAnchorHidden(anchorDiscard())}
                ariaLabel="Prendre la carte de la défausse"
                onClick={canTake ? onTake : undefined}
              />
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
            <div ref={handRef} className={styles.pileStack}>
              <CardView
                cell={{ faceUp: true, value: drawnCard }}
                motion={handMotion}
                clickable={canDiscardDrawn}
                hidden={isAnchorHidden(anchorHand())}
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
