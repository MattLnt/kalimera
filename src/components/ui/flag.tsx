/**
 * Petits drapeaux dessinés (les drapeaux emoji ne s'affichent pas sous
 * Windows, qui les remplace par deux lettres). Format 3:2, coins arrondis.
 */
export type FlagCode = "be" | "fr" | "us" | "es" | "gb";

function Shapes({ code }: { code: FlagCode }) {
  switch (code) {
    case "be":
      return (
        <>
          <rect width="10" height="20" fill="#1A1A1A" />
          <rect x="10" width="10" height="20" fill="#FDDA24" />
          <rect x="20" width="10" height="20" fill="#EF3340" />
        </>
      );
    case "fr":
      return (
        <>
          <rect width="10" height="20" fill="#0055A4" />
          <rect x="10" width="10" height="20" fill="#FFFFFF" />
          <rect x="20" width="10" height="20" fill="#EF4135" />
        </>
      );
    case "es":
      return (
        <>
          <rect width="30" height="20" fill="#AA151B" />
          <rect y="5" width="30" height="10" fill="#F1BF00" />
        </>
      );
    case "gb":
      return (
        <>
          <rect width="30" height="20" fill="#012169" />
          <path d="M0 0l30 20M30 0L0 20" stroke="#FFF" strokeWidth="4" />
          <path d="M0 0l30 20M30 0L0 20" stroke="#C8102E" strokeWidth="1.6" />
          <path d="M15 0v20M0 10h30" stroke="#FFF" strokeWidth="6" />
          <path d="M15 0v20M0 10h30" stroke="#C8102E" strokeWidth="3.4" />
        </>
      );
    case "us":
      return (
        <>
          <rect width="30" height="20" fill="#FFFFFF" />
          {[0, 2, 4, 6, 8, 10, 12].map((stripe) => (
            <rect key={stripe} y={(stripe * 20) / 13} width="30" height={20 / 13} fill="#B22234" />
          ))}
          <rect width="13" height={(20 / 13) * 7} fill="#3C3B6E" />
          {[
            [2.2, 2], [5.4, 2], [8.6, 2], [11, 3.6], [3.8, 3.6], [7, 3.6],
            [2.2, 5.2], [5.4, 5.2], [8.6, 5.2], [3.8, 6.8], [7, 6.8], [10.2, 6.8], [2.2, 8.4], [5.4, 8.4], [8.6, 8.4],
          ].map(([x, y]) => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r="0.55" fill="#FFFFFF" />
          ))}
        </>
      );
  }
}

export function Flag({ code, label, className }: { code: FlagCode; label: string; className?: string }) {
  return (
    <svg viewBox="0 0 30 20" role="img" aria-label={label} className={className} style={{ borderRadius: 4, boxShadow: "0 0 0 1px rgba(7,33,63,0.12)" }}>
      <title>{label}</title>
      <Shapes code={code} />
    </svg>
  );
}
