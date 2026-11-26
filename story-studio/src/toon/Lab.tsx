import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Person } from "./Person";
import type { Cast, Char } from "./types";
import { Defs } from "./Defs";

const cast: Record<string, Cast> = {
  me: { name: "Leo", age: "kid", hair: "messy", hairColor: "#5a3a22", top: "#3d6fb0", topStyle: "hoodie", pants: "#2d3446" },
  oma: { name: "Oma", age: "old", hair: "bun", hairColor: "#e9e6e1", top: "#b3262e", topStyle: "sweater", top2: "#f1e7d0", glasses: true, wrinkles: true, skin: "#f3cfb3", pants: "#3a2f2a" },
  dad: { name: "Dad", hair: "short", hairColor: "#2a1a10", top: "#41634a", topStyle: "jacket", beard: "stubble", skin: "#c98e64" },
  girl: { name: "Mia", age: "teen", hair: "long", hairColor: "#c9862e", top: "#e9c46a", topStyle: "shirt", skin: "#f2c9a8" },
  guard: { name: "Guard", hair: "hood", top: "#b3262e", top2: "#8a1c22", topStyle: "jumpsuit", mask: "visor" },
};
const specs: Char[] = [
  { id: "me", x: 0.14, expr: "terrified", pose: "cover" },
  { id: "oma", x: 0.36, expr: "angry", pose: "hold" },
  { id: "dad", x: 0.6, expr: "determined", pose: "point" },
  { id: "girl", x: 0.82, expr: "smile", pose: "wave" },
];

export const Lab: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "#26314a" }}>
      <svg viewBox="0 0 1080 1920" width={1080} height={1920}>
        <Defs />
        <rect x={0} y={1300} width={1080} height={620} fill="#3a2f2a" />
        {specs.map((s) => (
          <g key={s.id} transform={`translate(${s.x * 1080} 1400) scale(0.36)`}>
            <Person cast={cast[s.id]} spec={s} t={f / 30} progress={0} open={0} item={s.id === "oma" ? "candle" : undefined} />
          </g>
        ))}
        <g transform="translate(300 1900) scale(1.0)">
          <Person cast={cast.me} spec={{ id: "me", x: 0, expr: "shocked" }} t={f / 30} progress={0} open={0} />
        </g>
        <g transform="translate(800 1900) scale(1.0)">
          <Person cast={cast.guard} spec={{ id: "guard", x: 0, pose: "arms" }} t={f / 30} progress={0} open={0} />
        </g>
      </svg>
    </AbsoluteFill>
  );
};
