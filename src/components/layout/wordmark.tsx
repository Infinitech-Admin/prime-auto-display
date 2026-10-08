// components/layout/wordmark.tsx
//
// Shared Prime Auto Display logo. Used by the navbar, login and register.
// Place it inside an element with the `group` class for the hover effects.
// Size it with a text-size class: everything inside scales with em.
//
// Palette: maroon #9B1111 | gold #F9A602 | dark #1C0606 | cream #FDF5DC

type WordmarkProps = {
  className?: string;
};

// Shield echoing the logo: gold outline, maroon body, cream band across the middle.
export function ShieldMark() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 48 56"
      className="h-[1.45em] w-[1.25em] shrink-0 transition-transform duration-300 group-hover:-translate-y-0.5"
    >
      <path
        d="M24 2 L45 9 V30 C45 42 36 50 24 54 C12 50 3 42 3 30 V9 Z"
        fill="#F9A602"
      />
      <path
        d="M24 7 L40 12.5 V30 C40 39.5 33 45.5 24 49 C15 45.5 8 39.5 8 30 V12.5 Z"
        fill="#9B1111"
      />
      <path d="M8 24 H40 V32 H8 Z" fill="#FDF5DC" />
      <path
        d="M13 28 H35"
        stroke="#9B1111"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

// Kept so any file still importing { WheelO } keeps building.
export const WheelO = ShieldMark;

export function Wordmark({ className = "" }: WordmarkProps) {
  return (
    <span
      role="img"
      aria-label="Prime Auto Display"
      className={`inline-flex items-center gap-[0.4em] whitespace-nowrap ${className}`}
    >
      <ShieldMark />

      <span aria-hidden="true" className="flex flex-col leading-none">
        <span className="font-black uppercase italic tracking-tight text-[#FDF5DC] transition-colors duration-300 group-hover:text-[#F9A602]">
          Prime
        </span>
        <span className="mt-[0.18em] text-[0.3em] font-bold uppercase italic tracking-[0.22em] text-[#F9A602] transition-colors duration-300 group-hover:text-[#FDF5DC]">
          Auto Display
        </span>
      </span>
    </span>
  );
}

export default Wordmark;
