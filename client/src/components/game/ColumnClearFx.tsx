import { COLUMN_CLEAR_DURATION_MS } from '@shared/constants/animation.js';
import { createPortal } from 'react-dom';
import { useGameFeel } from '@/contexts/GameFeelContext';
import styles from './ColumnClearFx.module.css';

export function ColumnClearFxLayer(): JSX.Element | null {
  const { columnEffects } = useGameFeel();
  if (columnEffects.length === 0) {
    return null;
  }

  return createPortal(
    <div className={styles.layer} aria-hidden="true">
      {columnEffects.map((fx) => (
        <div
          key={fx.id}
          className={styles.burst}
          style={{
            left: fx.rect.left + fx.rect.width / 2,
            top: fx.rect.top + fx.rect.height * 1.5,
            ['--col-clear-ms' as string]: `${COLUMN_CLEAR_DURATION_MS}ms`,
          }}
        >
          {Array.from({ length: 10 }).map((_, i) => (
            <span key={i} className={styles.particle} style={{ ['--i' as string]: i }} />
          ))}
        </div>
      ))}
    </div>,
    document.body,
  );
}
