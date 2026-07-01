import type { HTMLAttributes, ReactNode } from 'react';
import styles from './Panel.module.css';

export interface PanelProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  elevated?: boolean;
  glow?: boolean;
  glass?: boolean;
  padding?: 'sm' | 'md' | 'lg';
}

export function Panel({
  children,
  elevated = false,
  glow = false,
  glass = false,
  padding = 'md',
  className,
  ...props
}: PanelProps): JSX.Element {
  const paddingClass = { sm: styles.paddingSm, md: styles.paddingMd, lg: styles.paddingLg }[padding];

  const classes = [
    styles.panel,
    elevated ? styles.elevated : '',
    glass ? styles.glass : '',
    paddingClass,
    glow ? styles.glow : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
}
