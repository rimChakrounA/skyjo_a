import { useContext } from 'react';
import { SocketContext, type SocketContextValue } from '@/contexts/SocketContext';

/** Accès au contexte Socket.IO. Lève une erreur hors du `SocketProvider`. */
export function useSocket(): SocketContextValue {
  const context = useContext(SocketContext);
  if (context === null) {
    throw new Error('useSocket doit être utilisé à l’intérieur d’un SocketProvider.');
  }
  return context;
}
