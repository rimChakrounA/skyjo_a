/** Configuration du serveur, dérivée des variables d'environnement. */
export const config = {
  port: Number(process.env.PORT ?? 3001),
  /** Origine autorisée pour CORS. */
  clientOrigin: process.env.CLIENT_ORIGIN ?? '*',
  /** Clé secrète pour la signature des JWT. */
  jwtSecret: process.env.JWT_SECRET ?? 'skyjo-dev-secret-change-in-production',
  /** Durée de vie des JWT (ex : '7d'). */
  jwtExpiresIn: '7d',
} as const;
