export type Point = { x: number; y: number };

export function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
}

export function easeOutBack(t: number): number {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * (t - 1) ** 3 + c1 * (t - 1) ** 2;
}

/** Point sur une courbe de Bézier quadratique (arc). arcHeight négatif = vers le haut à l'écran. */
export function arcPoint(from: Point, to: Point, t: number, arcHeight: number): Point {
  const mid = { x: (from.x + to.x) / 2, y: (from.y + to.y) / 2 };
  const control = { x: mid.x, y: mid.y + arcHeight };
  const u = 1 - t;
  return {
    x: u * u * from.x + 2 * u * t * control.x + t * t * to.x,
    y: u * u * from.y + 2 * u * t * control.y + t * t * to.y,
  };
}

export function animateArcFlight(
  from: Point,
  to: Point,
  duration: number,
  arcHeight: number,
  rotationStart: number,
  rotationEnd: number,
  onFrame: (x: number, y: number, rot: number, scale: number) => void,
): Promise<void> {
  return new Promise((resolve) => {
    const start = performance.now();
    const tick = (now: number): void => {
      const raw = Math.min(1, (now - start) / duration);
      const t = easeInOutCubic(raw);
      const settleT = raw < 0.88 ? t : t + easeOutBack((raw - 0.88) / 0.12) * 0.04;
      const p = arcPoint(from, to, settleT, arcHeight);
      const rot = rotationStart + (rotationEnd - rotationStart) * t;
      const scale = 1 + Math.sin(Math.min(raw, 1) * Math.PI) * 0.05;
      onFrame(p.x, p.y, rot, scale);
      if (raw < 1) {
        requestAnimationFrame(tick);
      } else {
        resolve();
      }
    };
    requestAnimationFrame(tick);
  });
}

export function rectCenter(rect: DOMRect): Point {
  return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
}

export function cardSizeFromRect(rect: DOMRect): { width: number; height: number } {
  return { width: rect.width, height: rect.height };
}
