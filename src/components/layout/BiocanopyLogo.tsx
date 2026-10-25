export function BiocanopyLogo({ className = 'h-10 w-10', full = false }: { className?: string; full?: boolean }) {
  return (
    <img
      src={full ? '/biocanopy-logo-full.png' : '/biocanopy-logo.png'}
      alt="BioCanopy"
      className={`${className} object-contain drop-shadow-[0_0_12px_rgba(16,185,129,0.35)]`}
    />
  );
}
