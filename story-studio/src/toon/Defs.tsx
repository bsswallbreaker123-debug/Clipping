import React from "react";

/** Shared gradients used by lights, glows and items. */
export const Defs: React.FC = () => (
  <defs>
    <radialGradient id="candleGlow">
      <stop offset="0" stopColor="#ffd890" stopOpacity={0.75} />
      <stop offset="0.35" stopColor="#ffb85a" stopOpacity={0.25} />
      <stop offset="1" stopColor="#ff9a3a" stopOpacity={0} />
    </radialGradient>
    <radialGradient id="screenGlow">
      <stop offset="0" stopColor="#9cc8ff" stopOpacity={0.45} />
      <stop offset="1" stopColor="#9cc8ff" stopOpacity={0} />
    </radialGradient>
    <linearGradient id="beam" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stopColor="#fff6cf" stopOpacity={0.55} />
      <stop offset="1" stopColor="#fff6cf" stopOpacity={0} />
    </linearGradient>
    <radialGradient id="vignette" cx="0.5" cy="0.5" r="0.75">
      <stop offset="0.55" stopColor="#000" stopOpacity={0} />
      <stop offset="1" stopColor="#000" stopOpacity={0.65} />
    </radialGradient>
    <radialGradient id="moonGlow">
      <stop offset="0" stopColor="#dfe9ff" stopOpacity={0.5} />
      <stop offset="1" stopColor="#dfe9ff" stopOpacity={0} />
    </radialGradient>
    <radialGradient id="warmPool">
      <stop offset="0" stopColor="#ffc777" stopOpacity={0.35} />
      <stop offset="1" stopColor="#ffc777" stopOpacity={0} />
    </radialGradient>
    <radialGradient id="redPool">
      <stop offset="0" stopColor="#ff2a2a" stopOpacity={0.5} />
      <stop offset="1" stopColor="#ff2a2a" stopOpacity={0} />
    </radialGradient>
    <radialGradient id="eyeGlow">
      <stop offset="0" stopColor="#ffe14a" stopOpacity={0.9} />
      <stop offset="1" stopColor="#ffb000" stopOpacity={0} />
    </radialGradient>
    <linearGradient id="wallShade" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#000" stopOpacity={0.35} />
      <stop offset="0.5" stopColor="#000" stopOpacity={0.05} />
      <stop offset="1" stopColor="#000" stopOpacity={0.25} />
    </linearGradient>
    <linearGradient id="floorShade" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#000" stopOpacity={0.35} />
      <stop offset="1" stopColor="#000" stopOpacity={0} />
    </linearGradient>
    <pattern id="check" width="40" height="40" patternUnits="userSpaceOnUse">
      <rect width="20" height="20" fill="#fff" />
      <rect x="20" y="20" width="20" height="20" fill="#fff" />
    </pattern>
    <linearGradient id="paper" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stopColor="#fff" stopOpacity={0.25} />
      <stop offset="1" stopColor="#8a6a3a" stopOpacity={0.18} />
    </linearGradient>
    <linearGradient id="sepia" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#c9a46a" stopOpacity={0.3} />
      <stop offset="1" stopColor="#3a2a1a" stopOpacity={0.5} />
    </linearGradient>
  </defs>
);
