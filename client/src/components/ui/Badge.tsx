import type { HTMLAttributes, ReactNode } from 'react';
import styles from './Badge.module.css';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'accent' | 'success' | 'danger';
  children: ReactNode;
}

export function Badge({
  variant = 'default',
  className,
  children,
  ...props
}: BadgeProps): JSX.Element {
  return (
    <span className={[styles.badge, styles[variant], className ?? ''].filter(Boolean).join(' ')} {...props}>
      {children}
    </span>
  );
}
