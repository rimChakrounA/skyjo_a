import { useEffect, useRef } from 'react';
import styles from './Confetti.module.css';

export function Confetti(): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas === null) {
      return;
    }
    const ctx = canvas.getContext('2d');
    if (ctx === null) {
      return;
    }

    const resize = (): void => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const colors = ['#4a90e2', '#27ae60', '#f1c40f', '#e74c3c', '#9b59b6', '#ffd89b'];
    const pieces = Array.from({ length: 80 }, () => ({
      x: Math.random() * canvas.width,
      y: -20 - Math.random() * canvas.height * 0.5,
      w: 6 + Math.random() * 6,
      h: 10 + Math.random() * 8,
      color: colors[Math.floor(Math.random() * colors.length)] ?? '#4a90e2',
      rot: Math.random() * 360,
      vy: 2 + Math.random() * 3,
      vx: -1 + Math.random() * 2,
      vr: -4 + Math.random() * 8,
    }));

    let frame = 0;
    let running = true;
    const start = performance.now();

    const draw = (now: number): void => {
      if (!running || now - start > 4000) {
        return;
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of pieces) {
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vr;
        if (p.y > canvas.height + 20) {
          p.y = -20;
          p.x = Math.random() * canvas.width;
        }
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rot * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      }
      frame = requestAnimationFrame(draw);
    };

    frame = requestAnimationFrame(draw);
    return () => {
      running = false;
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />;
}
