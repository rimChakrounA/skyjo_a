import type { ReactNode } from 'react';

import { assetUrl } from '@/utils/assetUrl';

import styles from './SceneShell.module.css';

export interface SceneShellProps {
  children: ReactNode;
  footer?: ReactNode;
  compact?: boolean;
}

export function SceneShell({ children, footer, compact = false }: SceneShellProps): JSX.Element {
  return (
    <div className={`${styles.scene} ${compact ? styles.sceneCompact : ''}`}>
      <div className={styles.skyLayer} aria-hidden="true">
        <img className={styles.skyImage} src={assetUrl('background/sky.webp')} alt="" />
        <div className={styles.skyOverlay} />
      </div>

      <div className={`${styles.content} ${compact ? styles.contentCompact : ''}`}>{children}</div>

      {footer !== undefined && footer}
    </div>
  );
}
