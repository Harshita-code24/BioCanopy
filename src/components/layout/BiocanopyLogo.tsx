export function BiocanopyLogo({ className = 'h-10 w-10' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 80 80"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M39.8 8C24.6 8.4 13 20.4 13 35.6C13 52.7 26.8 66 43.9 66C54.5 66 64 60.7 69.5 52.6C63.3 54.9 56.2 54 50.9 49.8C43 43.5 42.5 31.6 49.9 25.8C54 22.5 59 21.5 63.6 22.6C59 14 50 7.8 39.8 8Z"
        stroke="#2DD4BF"
        strokeWidth="4"
        strokeLinejoin="round"
        style={{ filter: 'drop-shadow(0 0 10px rgba(45,212,191,0.55))' }}
      />
      <path
        d="M37 25L28 38L37 50"
        stroke="#4ADE80"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <path
        d="M47 22L53 30L61 29"
        stroke="#2DD4BF"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <circle cx="28" cy="38" r="3" fill="#2DD4BF" />
      <circle cx="37" cy="50" r="3" fill="#4ADE80" />
      <circle cx="53" cy="30" r="3" fill="#2DD4BF" />
      <circle cx="61" cy="29" r="3" fill="#4ADE80" />
    </svg>
  );
}
