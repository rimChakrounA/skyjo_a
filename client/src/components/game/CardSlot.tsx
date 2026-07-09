import type { ReactNode } from 'react';
import { useAnchor } from '@/contexts/GameFeelContext';

export function CardSlot({
  slotKey,
  className,
  children,
}: {
  slotKey: string;
  className?: string;
  children: ReactNode;
}): JSX.Element {
  const ref = useAnchor(slotKey);
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
