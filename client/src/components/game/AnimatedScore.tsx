import { useEffect, useState } from 'react';
import styles from './AnimatedScore.module.css';

export interface AnimatedScoreProps {
  value: number;
  className?: string;
}

export function AnimatedScore({ value, className }: AnimatedScoreProps): JSX.Element {
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    if (display === value) {
      return;
    }
    const start = display;
    const delta = value - start;
    const duration = 420;
    const t0 = performance.now();
    let frame = 0;

    const tick = (now: number): void => {
      const t = Math.min(1, (now - t0) / duration);
      const eased = 1 - (1 - t) ** 3;
      setDisplay(Math.round(start + delta * eased));
      if (t < 1) {
        frame = requestAnimationFrame(tick);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value, display]);

  return <span className={[styles.score, className].filter(Boolean).join(' ')}>{display}</span>;
}
