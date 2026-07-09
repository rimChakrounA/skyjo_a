import type { ReactNode } from 'react';
import { CardFlightLayer } from '@/components/game/CardFlightLayer';
import { ColumnClearFxLayer } from '@/components/game/ColumnClearFx';
import { useGameFeel } from '@/contexts/GameFeelContext';
import styles from './GameStage.module.css';

export interface GameStageProps {
  children: ReactNode;
  dimmed?: boolean;
}

export function GameStage({ children, dimmed = false }: GameStageProps): JSX.Element {
  const { camera } = useGameFeel();

  return (
    <div className={styles.wrapper}>
      {dimmed && <div className={styles.dim} aria-hidden="true" />}
      <div
        className={styles.stage}
        style={{
          transform: `scale(${camera.scale}) translate(${camera.x}px, ${camera.y}px)`,
        }}
      >
        {children}
      </div>
      <CardFlightLayer />
      <ColumnClearFxLayer />
    </div>
  );
}
