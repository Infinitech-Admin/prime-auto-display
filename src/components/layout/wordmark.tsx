// components/layout/wordmark.tsx
//
// Shared Prime Auto Display Car Trading logo. Used by the navbar, login and register.
// Place it inside an element with the `group` class for the hover effects.
// Size it with a text-size class: everything inside scales with em.

// Tire icon next to the lettering. Spins when the parent `group` is hovered
// (disabled for reduced motion).
export function WheelO() {
  return (
    <span
      aria-hidden="true"
      className="mr-[0.14em] flex h-[1.05em] w-[1.05em] shrink-0 items-center justify-center"
    >
      <svg
        viewBox="0 0 100 100"
        className="h-full w-full group-hover:animate-spin motion-reduce:animate-none [animation-duration:1.2s]"
      >
        {/* Tire */}
        <circle
          cx="50"
          cy="50"
          r="47"
          fill="#1C0606"
          stroke="#FFFFFF"
          strokeWidth="5"
        />
        {/* Tread marks */}
        <g stroke="#9B1111" strokeWidth="5" strokeLinecap="round">
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
            <line
              key={angle}
              x1="50"
              y1="6"
              x2="50"
              y2="16"
              transform={`rotate(${angle} 50 50)`}
            />
          ))}
        </g>
        {/* Rim */}
        <circle
          cx="50"
          cy="50"
          r="28"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="5"
        />
        {/* Spokes */}
        <g stroke="#FFFFFF" strokeWidth="5" strokeLinecap="round">
          {[0, 72, 144, 216, 288].map((angle) => (
            <line
              key={angle}
              x1="50"
              y1="50"
              x2="50"
              y2="26"
              transform={`rotate(${angle} 50 50)`}
            />
          ))}
        </g>
        {/* Hub */}
        <circle cx="50" cy="50" r="9" fill="#9B1111" />
      </svg>
    </span>
  );
}

// Tire icon + red "CAPITAL" and white "JEY" in squared type, with a thin red
// rule and "CAR TRADING" underneath. Upright, no italics, no glow.
export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span
      role="img"
      aria-label="Prime Auto Display Car Trading"
      className={`inline-flex items-center whitespace-nowrap leading-none ${className}`}
    >
      <WheelO />
      <span aria-hidden="true" className="flex flex-col items-start">
        <span className="flex items-baseline gap-[0.18em] font-[family-name:var(--font-rajdhani)] font-bold uppercase tracking-[0.04em]">
          <span className="text-[#9B1111] transition-colors duration-300 group-hover:text-[#B91C1C]">
            Capital
          </span>
          <span className="text-white">Jey</span>
        </span>
        <span className="mt-[0.3em] flex w-full items-center gap-[0.5em] text-[0.3em] font-semibold uppercase tracking-[0.35em] text-white/80">
          <span className="h-[2px] w-[1.6em] bg-[#9B1111]" />
          Car Trading
        </span>
      </span>
    </span>
  );
}

export default Wordmark;
