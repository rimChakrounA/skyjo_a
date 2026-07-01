/** Illustration SVG originale : joueurs autour d'une table. */
export function PlayersIllustration(): JSX.Element {
  return (
    <svg
      className="playersIllustration"
      viewBox="0 0 200 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <ellipse cx="100" cy="95" rx="70" ry="12" fill="rgba(45,122,74,0.2)" />
      <rect x="55" y="72" width="90" height="28" rx="14" fill="#8B6914" />
      <rect x="58" y="75" width="84" height="22" rx="11" fill="#A67C00" />
      {/* Personnage gauche */}
      <circle cx="45" cy="52" r="14" fill="#FFDAB9" />
      <path d="M31 68 Q45 58 59 68 L59 85 Q45 78 31 85 Z" fill="#4A90E2" />
      {/* Personnage centre */}
      <circle cx="100" cy="48" r="16" fill="#FFDAB9" />
      <path d="M82 66 Q100 54 118 66 L118 88 Q100 80 82 88 Z" fill="#27AE60" />
      {/* Personnage droite */}
      <circle cx="155" cy="52" r="14" fill="#FFDAB9" />
      <path d="M141 68 Q155 58 169 68 L169 85 Q155 78 141 85 Z" fill="#E74C3C" />
      {/* Cartes sur la table */}
      <rect x="82" y="78" width="16" height="22" rx="3" fill="#fff" stroke="#ccc" />
      <rect x="102" y="78" width="16" height="22" rx="3" fill="#74B9FF" stroke="#0984E3" />
    </svg>
  );
}
