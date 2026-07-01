import type { ReactNode } from 'react';
import styles from './Field.module.css';

export interface FieldProps {
  label: string;
  error?: string | null;
  children: ReactNode;
}

export function Field({ label, error, children }: FieldProps): JSX.Element {
  return (
    <label className={styles.field}>
      <span className={styles.label}>{label}</span>
      {children}
      {error !== undefined && error !== null && error.length > 0 && (
        <span className={styles.error}>{error}</span>
      )}
    </label>
  );
}
