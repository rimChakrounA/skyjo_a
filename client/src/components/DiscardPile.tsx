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

  return (

    <div className={`${styles.area} ${compact ? styles.compact : ''}`}>

      <div className={styles.pile}>

        <span className={styles.label}>Pioche ({deckCount})</span>

        <CardView

          cell={{ faceUp: false }}

          clickable={canDraw}

          ariaLabel="Piocher une carte"

          onClick={canDraw ? onDraw : undefined}

        />

        {canDraw && (

          <Button

            size="sm"

            fullWidth

            className={compact ? styles.compactBtn : undefined}

            onClick={onDraw}

          >

            Piocher

          </Button>

        )}

      </div>



      <div className={styles.pile}>

        <span className={styles.label}>Défausse</span>

        <CardView

          cell={discardTop === null ? null : { faceUp: true, value: discardTop }}

          clickable={canTake}

          ariaLabel="Prendre la carte de la défausse"

          onClick={canTake ? onTake : undefined}

        />

        {canTake && (

          <Button

            variant="accent"

            size="sm"

            fullWidth

            className={compact ? styles.compactBtn : undefined}

            onClick={onTake}

          >

            Prendre

          </Button>

        )}

      </div>



      {drawnCard !== null && (

        <div className={styles.pile}>

          <span className={styles.label}>En main</span>

          <CardView

            cell={{ faceUp: true, value: drawnCard }}

            clickable={canDiscardDrawn}

            ariaLabel={`Carte piochée : ${drawnCard}`}

            onClick={canDiscardDrawn ? onDiscardDrawn : undefined}

          />

          {canDiscardDrawn && (

            <Button

              variant="secondary"

              size="sm"

              fullWidth

              className={compact ? styles.compactBtn : undefined}

              onClick={onDiscardDrawn}

            >

              Défausser

            </Button>

          )}

        </div>

      )}

    </div>

  );

}


