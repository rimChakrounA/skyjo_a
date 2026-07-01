/** URL publique d'un asset dans `client/public/assets/`. */
export function assetUrl(path: string): string {
  const normalized = path.startsWith('/') ? path.slice(1) : path;
  return `${import.meta.env.BASE_URL}assets/${normalized}`;
}
