interface LogoProps {
  size?: number;
  className?: string;
}

export default function Logo({ size = 56, className = '' }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="HouseTasks"
    >
      {/* Background */}
      <rect width="48" height="48" rx="13" fill="#0d9488" />

      {/* House shadow layer for depth */}
      <path d="M24 9 L41 24 V41 H7 V24 L24 9Z" fill="#0f766e" />

      {/* House (white) */}
      <path d="M24 8 L40 23 V40 H8 V23 L24 8Z" fill="white" />

      {/* Roof ridge (subtle teal line for definition) */}
      <path
        d="M6 24 L24 7 L42 24"
        stroke="#0d9488"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Door */}
      <rect x="19.5" y="29.5" width="9" height="10.5" rx="2" fill="#0d9488" />

      {/* Checkmark (orange accent) */}
      <path
        d="M13 27.5 L19.5 34 L35 20"
        stroke="#f97316"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
