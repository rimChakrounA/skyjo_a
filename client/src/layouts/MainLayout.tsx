import type { ReactNode } from 'react';
import { useSocket } from '@/hooks/useSocket';
import styles from './MainLayout.module.css';

export function MainLayout({ children }: { children: ReactNode }): JSX.Element {
  const { connected } = useSocket();

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <h1 className={styles.title}>Skyjo Online</h1>
        <span className={connected ? styles.online : styles.offline}>
          {connected ? 'Connecté' : 'Hors ligne'}
        </span>
      </header>
      <main className={styles.main}>{children}</main>
    </div>
  );
}
