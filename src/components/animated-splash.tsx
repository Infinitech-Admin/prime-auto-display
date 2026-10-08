// Path: components/animated-splash.tsx  (keep your existing file name)

"use client";

import { useEffect, useState } from "react";

/**
 * AnimatedSplash: tachometer version
 * ----------------------------------
 * The Prime Auto Display logo starts dark. Under it, a tachometer sweeps from
 * 0 to redline: the gold arc fills, the needle climbs and the % counter runs.
 * As the needle passes, the logo ignites in order: shield -> PRIME, and the
 * AUTO DISPLAY bar is revealed. At redline the logo flares, then everything
 * fades into the homepage.
 *
 * - Shows only when running as an installed PWA (standalone).
 * - Once per session.
 * - Test in a normal browser tab: /?splash
 * - Respects prefers-reduced-motion.
 *
 * Place as the FIRST child inside <body> in app/layout.tsx.
 *
 * Palette: dark #1C0606 | maroon #9B1111 | gold #F9A602 | cream #FDF5DC
 */

type Props = {
  /** How long the splash stays before it starts fading out (ms). */
  duration?: number;
  /** Fade-out length (ms). */
  fadeMs?: number;
};

type Phase = "pending" | "show" | "exit" | "done";

const SESSION_KEY = "pad-splash-seen";

/* ---------- Gauge geometry (viewBox 200 x 150, 240 degree sweep) ---------- */
const CX = 100;
const CY = 92;
const rad = (deg: number) => (deg * Math.PI) / 180;

// 33 ticks: every 7.5 deg, a major tick (and number) every 4th, redline from 6
const TICKS = Array.from({ length: 33 }, (_, i) => ({
  i,
  angle: -120 + 7.5 * i,
  major: i % 4 === 0,
  red: i >= 24,
}));

export default function AnimatedSplash({
  duration = 3700,
  fadeMs = 600,
}: Props) {
  const [phase, setPhase] = useState<Phase>("pending");

  useEffect(() => {
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.matchMedia("(display-mode: window-controls-overlay)").matches ||
      window.matchMedia("(display-mode: fullscreen)").matches ||
      (window.navigator as Navigator & { standalone?: boolean }).standalone ===
        true;

    const forced = new URLSearchParams(window.location.search).has("splash");

    let seen = false;
    try {
      seen = sessionStorage.getItem(SESSION_KEY) === "1";
    } catch {
      /* storage unavailable: just show */
    }

    if ((!standalone && !forced) || (seen && !forced)) {
      setPhase("done");
      return;
    }

    try {
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      /* ignore */
    }

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const total = reduced ? 1000 : duration;

    setPhase("show");
    const exitTimer = window.setTimeout(() => setPhase("exit"), total);
    const doneTimer = window.setTimeout(() => setPhase("done"), total + fadeMs);

    return () => {
      window.clearTimeout(exitTimer);
      window.clearTimeout(doneTimer);
    };
  }, [duration, fadeMs]);

  if (phase === "done") return null;

  return (
    <div
      className="pad-splash"
      data-active={phase === "show" || phase === "exit"}
      data-exit={phase === "exit"}
      role="status"
      aria-live="polite"
      aria-label="Loading Prime Auto Display"
      style={{ ["--pad-fade" as string]: `${fadeMs}ms` }}
    >
      <div className="pad-stage">
        {/* Shield + PRIME: dark until the needle reaches each part */}
        <h1 className="pad-word" aria-label="Prime Auto Display">
          <span className="pad-shield" aria-hidden="true">
            <svg viewBox="0 0 48 56">
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
          </span>

          <span className="pad-l" aria-hidden="true">
            Prime
          </span>
        </h1>

        {/* AUTO DISPLAY: revealed in step with the needle */}
        <div className="pad-tag">
          <span>Auto Display</span>
        </div>

        {/* Tachometer = the loading bar */}
        <div className="pad-gauge" aria-hidden="true">
          <svg viewBox="0 0 200 150" overflow="visible">
            <defs>
              <linearGradient id="padNeedle" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0" stopColor="#F9A602" />
                <stop offset="1" stopColor="#FDF5DC" />
              </linearGradient>
              <radialGradient id="padGlow">
                <stop offset="0" stopColor="#9B1111" stopOpacity="0.55" />
                <stop offset="1" stopColor="#9B1111" stopOpacity="0" />
              </radialGradient>
            </defs>

            <circle
              className="pad-gglow"
              cx={CX}
              cy={CY}
              r="78"
              fill="url(#padGlow)"
            />

            {/* track */}
            <path
              d="M30.72 132 A80 80 0 1 1 169.28 132"
              fill="none"
              stroke="rgba(253,245,220,0.1)"
              strokeWidth="6"
              strokeLinecap="round"
            />
            {/* redline zone */}
            <path
              d="M174.48 49 A86 86 0 0 1 174.48 135"
              fill="none"
              stroke="#B91C1C"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            {/* progress arc */}
            <path
              className="pad-arc"
              d="M30.72 132 A80 80 0 1 1 169.28 132"
              pathLength={100}
              fill="none"
              stroke="#F9A602"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray="100"
            />

            {/* ticks */}
            <g strokeLinecap="round">
              {TICKS.map((t) => (
                <line
                  key={t.i}
                  x1={CX}
                  y1={CY - 74}
                  x2={CX}
                  y2={CY - (t.major ? 62 : 68)}
                  transform={`rotate(${t.angle} ${CX} ${CY})`}
                  stroke={t.red ? "#B91C1C" : "#FDF5DC"}
                  strokeOpacity={t.major ? 0.9 : 0.4}
                  strokeWidth={t.major ? 2 : 1}
                />
              ))}
            </g>

            {/* numbers 0-8 */}
            <g textAnchor="middle" fontSize="9">
              {TICKS.filter((t) => t.major).map((t) => (
                <text
                  key={t.i}
                  x={(CX + 50 * Math.sin(rad(t.angle))).toFixed(2)}
                  y={(CY - 50 * Math.cos(rad(t.angle)) + 3.2).toFixed(2)}
                  fill={t.red ? "#B91C1C" : "#FDF5DC"}
                  fillOpacity={t.red ? 1 : 0.75}
                >
                  {t.i / 4}
                </text>
              ))}
              <text
                x={CX}
                y="66"
                fontSize="5"
                fill="#FDF5DC"
                fillOpacity="0.45"
                letterSpacing="1"
              >
                x1000 r/min
              </text>
            </g>

            {/* needle */}
            <g className="pad-needle">
              <polygon
                points="98.6,102 98,92 100,24 102,92 101.4,102"
                fill="url(#padNeedle)"
              />
            </g>
            <circle
              cx={CX}
              cy={CY}
              r="7"
              fill="#1C0606"
              stroke="#FDF5DC"
              strokeWidth="2"
            />
            <circle cx={CX} cy={CY} r="2.6" fill="#F9A602" />
          </svg>

          {/* % readout */}
          <div className="pad-readout" />
        </div>
      </div>

      <style>{`
        @property --pad-n {
          syntax: "<integer>";
          inherits: true;
          initial-value: 0;
        }

        .pad-splash {
          --maroon: #9B1111;
          --gold: #F9A602;
          --cream: #FDF5DC;
          --dark: #1C0606;
          --head: var(--font-rajdhani), "Arial Black", Arial, system-ui, sans-serif;
          --t0: 300ms;      /* sweep start */
          --drive: 2600ms;  /* sweep duration (gauge = loading bar) */
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: none;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          background:
            radial-gradient(55% 40% at 50% 55%, rgba(155,17,17,0.28), transparent 70%),
            var(--dark);
          opacity: 1;
          transition: opacity var(--pad-fade, 600ms) ease, transform var(--pad-fade, 600ms) ease;
          padding: env(safe-area-inset-top) env(safe-area-inset-right)
                   env(safe-area-inset-bottom) env(safe-area-inset-left);
        }
        @media (display-mode: standalone),
               (display-mode: window-controls-overlay),
               (display-mode: fullscreen) {
          .pad-splash { display: flex; }
        }
        .pad-splash[data-active="true"] { display: flex; }
        .pad-splash[data-exit="true"] {
          opacity: 0;
          transform: scale(1.04);
          pointer-events: none;
        }

        .pad-stage {
          display: flex;
          flex-direction: column;
          align-items: stretch;
          width: fit-content;
          font-size: clamp(34px, 11vw, 80px); /* logo size drives everything */
        }

        /* ---------- Logo ---------- */
        .pad-word {
          margin: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.2em;
          font-family: var(--head);
          font-weight: 700;
          font-style: italic;
          font-size: 1em;
          line-height: 1;
          letter-spacing: 0.02em;
          text-transform: uppercase;
          white-space: nowrap;
          animation: pad-flare 700ms ease-out 2900ms;
        }
        .pad-l {
          display: inline-block;
          opacity: 0.12; /* unlit */
          color: var(--cream);
          text-shadow: 0 0 0.35em rgba(249,166,2,0.45);
          animation: pad-ignite 520ms ease-out 1300ms forwards;
        }
        .pad-shield {
          display: inline-block;
          width: 0.85em;
          height: 1em;
          opacity: 0.12;
          filter: drop-shadow(0 0 0.1em rgba(249,166,2,0.7));
          animation:
            pad-ignite 520ms ease-out 450ms forwards,
            pad-lift 900ms cubic-bezier(0.2, 0.8, 0.3, 1) 450ms both;
        }
        .pad-shield svg { display: block; width: 100%; height: 100%; }

        /* ---------- AUTO DISPLAY ---------- */
        .pad-tag {
          margin-top: 0.14em;
          display: flex;
          justify-content: center;
          background: var(--maroon);
          color: var(--gold);
          font-family: var(--head);
          font-weight: 700;
          font-style: italic;
          font-size: 0.26em;
          letter-spacing: 0.5em;
          text-transform: uppercase;
          padding: 0.4em 0.9em 0.4em 1.4em;
          box-shadow: 0 0 1.4em rgba(155,17,17,0.55);
          clip-path: inset(0 100% 0 0);
          animation: pad-reveal var(--drive) linear var(--t0) forwards;
        }

        /* ---------- Gauge ---------- */
        .pad-gauge {
          position: relative;
          width: 3.4em;
          margin: 0.45em auto 0;
          animation: pad-flare 700ms ease-out 2900ms;
        }
        .pad-gauge svg { display: block; width: 100%; height: auto; overflow: visible; }
        .pad-gauge text { font-family: var(--head); font-weight: 700; }

        .pad-arc {
          stroke-dashoffset: 100;
          filter: drop-shadow(0 0 3px rgba(249,166,2,0.8));
          animation: pad-arc var(--drive) linear var(--t0) both;
        }
        .pad-needle {
          transform-box: view-box;
          transform-origin: 100px 92px;
          transform: rotate(-120deg);
          filter: drop-shadow(0 0 3px rgba(249,166,2,0.8));
          animation: pad-needle var(--drive) linear var(--t0) both;
        }
        .pad-gglow {
          opacity: 0.1;
          animation: pad-gglow var(--drive) linear var(--t0) both;
        }

        .pad-readout {
          position: absolute;
          left: 50%;
          top: 74%;
          transform: translateX(-50%);
          font-family: var(--head);
          font-weight: 700;
          font-size: 0.3em;
          line-height: 1;
          color: var(--cream);
          text-shadow: 0 0 0.4em rgba(249,166,2,0.5);
          font-variant-numeric: tabular-nums;
          counter-reset: pad-n var(--pad-n);
          animation: pad-count var(--drive) linear var(--t0) both;
        }
        .pad-readout::before { content: counter(pad-n) "%"; }

        /* ---------- Keyframes ---------- */
        /* needle, arc, counter and tag reveal share one speed curve */
        @keyframes pad-needle {
          0%   { transform: rotate(-120deg); animation-timing-function: linear; }
          85%  { transform: rotate(84deg);   animation-timing-function: cubic-bezier(0.2, 0.7, 0.3, 1); }
          100% { transform: rotate(120deg); }
        }
        @keyframes pad-arc {
          0%   { stroke-dashoffset: 100; animation-timing-function: linear; }
          85%  { stroke-dashoffset: 15;  animation-timing-function: cubic-bezier(0.2, 0.7, 0.3, 1); }
          100% { stroke-dashoffset: 0; }
        }
        @keyframes pad-count {
          0%   { --pad-n: 0;   animation-timing-function: linear; }
          85%  { --pad-n: 85;  animation-timing-function: cubic-bezier(0.2, 0.7, 0.3, 1); }
          100% { --pad-n: 100; }
        }
        @keyframes pad-gglow {
          0%   { opacity: 0.1; }
          100% { opacity: 0.9; }
        }
        @keyframes pad-reveal {
          0%   { clip-path: inset(0 100% 0 0); animation-timing-function: linear; }
          85%  { clip-path: inset(0 15% 0 0);  animation-timing-function: cubic-bezier(0.2, 0.7, 0.3, 1); }
          100% { clip-path: inset(0 0 0 0); }
        }
        @keyframes pad-ignite {
          0%   { opacity: 0.12; }
          20%  { opacity: 1; }
          32%  { opacity: 0.35; }
          50%  { opacity: 1; }
          62%  { opacity: 0.7; }
          100% { opacity: 1; }
        }
        @keyframes pad-lift {
          0%   { transform: translateY(0.12em) scale(0.92); }
          100% { transform: translateY(0) scale(1); }
        }
        @keyframes pad-flare {
          0%   { filter: brightness(1) drop-shadow(0 0 0 rgba(249,166,2,0)); }
          35%  { filter: brightness(1.3) drop-shadow(0 0 0.22em rgba(249,166,2,0.8)); }
          100% { filter: brightness(1) drop-shadow(0 0 0 rgba(249,166,2,0)); }
        }

        @media (prefers-reduced-motion: reduce) {
          .pad-splash *, .pad-splash *::before {
            animation-duration: 1ms !important;
            animation-delay: 0ms !important;
            animation-iteration-count: 1 !important;
            transition: none !important;
          }
          .pad-splash[data-exit="true"] { transform: none; }
        }
      `}</style>
    </div>
  );
}
