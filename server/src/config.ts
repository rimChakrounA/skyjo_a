/** Configuration du serveur, dérivée des variables d'environnement. */
export const config = {
  port: Number(process.env.PORT ?? 3001),
  /** Origine autorisée pour CORS (client Vite par défaut). */
  clientOrigin: process.env.CLIENT_ORIGIN ?? '*',
} as const;
