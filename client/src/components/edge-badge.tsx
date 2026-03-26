export function EdgeBadge({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center ${className}`}
      aria-label="Edge"
    >
      <svg
        width="44"
        height="18"
        viewBox="0 0 44 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <rect width="44" height="18" rx="3" fill="#2563EB" />
        <text
          x="50%"
          y="50%"
          dominantBaseline="central"
          textAnchor="middle"
          fill="white"
          fontFamily="'Inter', 'Helvetica Neue', Arial, sans-serif"
          fontWeight="800"
          fontSize="9.5"
          letterSpacing="1.6"
          style={{ textTransform: "uppercase" }}
        >
          EDGE
        </text>
      </svg>
    </span>
  );
}
