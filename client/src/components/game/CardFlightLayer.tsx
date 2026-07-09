import { createPortal } from 'react-dom';
import { CardView } from '@/components/CardView';
import { useGameFeel } from '@/contexts/GameFeelContext';
import styles from './CardFlightLayer.module.css';

export function CardFlightLayer(): JSX.Element | null {
  const { activeFlights } = useGameFeel();
  if (activeFlights.length === 0) {
    return null;
  }

  return createPortal(
    <div className={styles.layer} aria-hidden="true">
      {activeFlights.map((flight) => (
        <div
          key={flight.id}
          className={styles.flight}
          style={{
            left: flight.x,
            top: flight.y,
            width: flight.width,
            height: flight.height,
            transform: `translate(-50%, -50%) rotate(${flight.rot}deg) scale(${flight.scale})`,
          }}
        >
          <CardView cell={flight.cell} />
        </div>
      ))}
    </div>,
    document.body,
  );
}
