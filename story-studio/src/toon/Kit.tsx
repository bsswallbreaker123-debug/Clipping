import React from "react";
import { hash, rnd, shade } from "./util";

// Scene kit: every scene is assembled from layers (sky, far, mid, wall, floor, items).
// Items return a body and an optional glow; glows are drawn above the night tint so lights shine.

export interface Ctx {
  t: number;
  night: boolean;
  snow: boolean;
  floorY: number;
  win?: string; // what is visible in / on windows
  seed: number;
  flicker: number; // 0..1 light level for flickering lamps
}

export interface Built {
  body: React.ReactNode;
  glow?: React.ReactNode; // added light (screen blend, above the night tint)
  lit?: React.ReactNode; // self-lit surfaces drawn above the tint (windows, backlit curtains)
}

export interface Item {
  t: string;
  x: number; // 0..1
  y?: number; // px offset (+ = lower) for floor items; absolute y for wall items when given
  s?: number; // scale
  c?: string; // main colour
  v?: string; // variant
  fg?: boolean; // foreground layer
  flip?: boolean;
}

const px = (x: number) => x * 1080;

// ---------------------------------------------------------------- outside: sky / far / mid / ground

export const Sky: React.FC<{ kind: string; t: number; moon?: number; seed: number }> = ({ kind, t, moon, seed }) => {
  const g: Record<string, [string, string, string]> = {
    night: ["#0b1024", "#1a2550", "#33406e"],
    snow: ["#141b33", "#2a3561", "#5a6690"],
    dusk: ["#2a1d4a", "#9a4f6a", "#f0a36a"],
    day: ["#7fb3e6", "#b4d6f2", "#e6f2fb"],
    storm: ["#07090f", "#151b28", "#2a3142"],
    red: ["#1a0508", "#4a0d14", "#8a2020"],
    space: ["#02030a", "#060a1c", "#0a1430"],
    dawn: ["#2c3a66", "#c27a8a", "#ffd2a0"],
  };
  const [a, b, c] = g[kind] ?? g.night;
  const id = `sky${kind}`;
  const stars = kind === "night" || kind === "snow" || kind === "storm" || kind === "space";
  return (
    <g>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={a} />
          <stop offset="0.6" stopColor={b} />
          <stop offset="1" stopColor={c} />
        </linearGradient>
      </defs>
      <rect x={-300} y={-300} width={1680} height={2520} fill={`url(#${id})`} />
      {stars &&
        Array.from({ length: 70 }).map((_, i) => {
          const x = rnd(seed + i) * 1500 - 210;
          const y = rnd(seed + i * 3.3) * 900 - 200;
          const tw = 0.4 + 0.6 * Math.abs(Math.sin(t * (0.8 + rnd(i) * 2) + i));
          return <circle key={i} cx={x} cy={y} r={1.2 + rnd(i * 7.7) * 2.4} fill="#fff" opacity={0.25 + 0.6 * tw * rnd(i * 1.9)} />;
        })}
      {kind === "space" && (
        <g>
          {Array.from({ length: 140 }).map((_, i) => (
            <circle key={`s${i}`} cx={rnd(seed + i * 1.7) * 1500 - 210} cy={rnd(seed + i * 2.9) * 2200 - 200} r={0.8 + rnd(i * 3.1) * 1.8} fill="#fff" opacity={0.3 + rnd(i) * 0.6} />
          ))}
          <circle cx={540} cy={2700} r={1300} fill="#2a6ab0" />
          <circle cx={540} cy={2700} r={1300} fill="none" stroke="#9fd2ff" strokeWidth={30} opacity={0.5} />
          <path d="M-200 1560 Q300 1450 700 1520 T1300 1480 L1300 2200 L-200 2200Z" fill="#3a8a4a" opacity={0.55} />
          <ellipse cx={300} cy={1540} rx={220} ry={30} fill="#fff" opacity={0.35} />
        </g>
      )}
      {moon !== undefined && (
        <g>
          <circle cx={px(moon)} cy={260} r={260} fill="url(#moonGlow)" />
          <circle cx={px(moon)} cy={260} r={78} fill="#f2f0e6" />
          <circle cx={px(moon) - 22} cy={244} r={14} fill="#dcd8c8" />
          <circle cx={px(moon) + 24} cy={280} r={10} fill="#dcd8c8" />
        </g>
      )}
    </g>
  );
};

export const Far: React.FC<{ kind: string; y: number; seed: number; snow: boolean; night: boolean }> = ({ kind, y, seed, snow, night }) => {
  if (kind === "mountains" || kind === "alps") {
    const peaks = [
      [-200, 0],
      [80, -520],
      [300, -260],
      [520, -640],
      [760, -330],
      [980, -560],
      [1280, -120],
    ];
    const back = peaks.map(([x, h]) => `L${x} ${y + h}`).join(" ");
    const front = [
      [-200, -80],
      [150, -300],
      [420, -120],
      [700, -380],
      [1000, -170],
      [1280, -260],
    ];
    const col = night ? "#2c3a60" : "#8aa0c0";
    return (
      <g>
        <path d={`M-200 ${y} ${back} L1280 ${y}Z`} fill={col} />
        {/* snow caps */}
        {peaks.slice(1, -1).map(([x, h], i) => (
          <path key={i} d={`M${x} ${y + h} L${x - 70} ${y + h + 120} L${x - 30} ${y + h + 100} L${x} ${y + h + 135} L${x + 40} ${y + h + 105} L${x + 80} ${y + h + 125}Z`} fill={night ? "#c9d3ea" : "#fff"} opacity={0.9} />
        ))}
        <path d={`M-200 ${y + 40} ${front.map(([x, h]) => `L${x} ${y + h}`).join(" ")} L1280 ${y + 40}Z`} fill={shade(col, -0.25)} />
        {snow && <rect x={-300} y={y + 20} width={1680} height={30} fill={night ? "#3b4a72" : "#dfe8f4"} />}
      </g>
    );
  }
  if (kind === "pines" || kind === "forest") {
    return (
      <g>
        {Array.from({ length: 26 }).map((_, i) => {
          const x = -150 + i * 55 + rnd(seed + i) * 30;
          const h = 220 + rnd(seed + i * 2) * 200;
          return <Pine key={i} x={x} y={y + 10} h={h} c={night ? "#152238" : "#3f6b4f"} snow={snow} night={night} />;
        })}
      </g>
    );
  }
  if (kind === "city" || kind === "ruins") {
    const ruin = kind === "ruins";
    return (
      <g>
        {Array.from({ length: 16 }).map((_, i) => {
          const w = 70 + rnd(seed + i) * 90;
          const x = -120 + i * 85;
          const h = 260 + rnd(seed + i * 4) * 520;
          const top = ruin ? `L${x + w * 0.7} ${y - h} L${x + w * 0.5} ${y - h + 60} L${x + w * 0.2} ${y - h + 20}` : "";
          return (
            <g key={i}>
              <path d={`M${x} ${y} L${x} ${y - h} ${top} L${x + w} ${y - h + (ruin ? 80 : 0)} L${x + w} ${y}Z`} fill={night ? "#18203a" : "#7d8aa3"} />
              {!ruin &&
                night &&
                Array.from({ length: 14 }).map((__, j) => (
                  <rect key={j} x={x + 12 + (j % 3) * (w / 3.4)} y={y - h + 30 + Math.floor(j / 3) * 46} width={12} height={18} fill="#ffd77a" opacity={rnd(seed + i * 13 + j) > 0.55 ? 0.8 : 0.05} />
                ))}
              {ruin && <path d={`M${x + 10} ${y - h * 0.4} q20 -30 40 0`} stroke="#3e5a3a" strokeWidth={14} fill="none" />}
            </g>
          );
        })}
      </g>
    );
  }
  if (kind === "sea") {
    return (
      <g>
        <rect x={-300} y={y - 40} width={1680} height={400} fill={night ? "#16305a" : "#3a9ad0"} />
        {Array.from({ length: 10 }).map((_, i) => (
          <path key={i} d={`M${-300 + (i % 2) * 60} ${y + i * 30} q60 -12 120 0 t120 0 t120 0 t120 0 t120 0 t120 0 t120 0 t120 0 t120 0 t120 0 t120 0 t120 0 t120 0 t120 0`} stroke="#fff" strokeWidth={3} opacity={0.25} fill="none" />
        ))}
        <ellipse cx={780} cy={y - 50} rx={160} ry={40} fill={night ? "#203a2a" : "#4a8a5a"} />
      </g>
    );
  }
  if (kind === "hills") {
    return (
      <g>
        <path d={`M-200 ${y} Q200 ${y - 260} 540 ${y - 120} T1280 ${y - 180} L1280 ${y + 60} L-200 ${y + 60}Z`} fill={night ? "#1c2a3e" : "#6a9a6a"} />
        <path d={`M-200 ${y + 30} Q300 ${y - 140} 700 ${y - 40} T1280 ${y - 60} L1280 ${y + 80} L-200 ${y + 80}Z`} fill={night ? "#16212f" : "#5a8a5a"} />
      </g>
    );
  }
  return null;
};

export const Pine: React.FC<{ x: number; y: number; h: number; c: string; snow: boolean; night: boolean }> = ({ x, y, h, c, snow, night }) => {
  const w = h * 0.42;
  const tiers = [0, 1, 2, 3];
  return (
    <g>
      <rect x={x - h * 0.03} y={y - h * 0.12} width={h * 0.06} height={h * 0.14} fill={shade(c, -0.3)} />
      {tiers.map((i) => {
        const ty = y - h * 0.1 - i * h * 0.22;
        const tw = w * (1 - i * 0.2);
        return (
          <g key={i}>
            <path d={`M${x - tw} ${ty} L${x} ${ty - h * 0.36} L${x + tw} ${ty}Z`} fill={i % 2 ? c : shade(c, 0.06)} />
            <path d={`M${x} ${ty - h * 0.36} L${x + tw} ${ty} L${x} ${ty}Z`} fill="#000" opacity={0.12} />
            {snow && <path d={`M${x - tw * 0.45} ${ty - h * 0.2} L${x} ${ty - h * 0.36} L${x + tw * 0.45} ${ty - h * 0.2} Q${x} ${ty - h * 0.15} ${x - tw * 0.45} ${ty - h * 0.2}Z`} fill={night ? "#c7d1ea" : "#fff"} opacity={0.85} />}
          </g>
        );
      })}
    </g>
  );
};

// ---------------------------------------------------------------- buildings

export const Chalet: React.FC<{ x: number; y: number; s: number; c?: string; lit?: number; snow: boolean; night: boolean; t: number; door?: string }> = ({ x, y, s, c = "#7a4a2a", lit = 0.8, snow, night, t, door }) => {
  const wall = "#efe6d6";
  const wood = c;
  const win = (wx: number, wy: number, i: number) => {
    const on = rnd(i + x) < lit;
    return (
      <g key={`${wx}-${wy}`}>
        <rect x={wx - 34} y={wy - 40} width={68} height={80} fill={on && night ? "#ffcf6b" : "#2a3550"} stroke={shade(wood, -0.2)} strokeWidth={8} />
        <line x1={wx} y1={wy - 40} x2={wx} y2={wy + 40} stroke={shade(wood, -0.2)} strokeWidth={6} />
        <line x1={wx - 34} y1={wy} x2={wx + 34} y2={wy} stroke={shade(wood, -0.2)} strokeWidth={6} />
        <rect x={wx - 54} y={wy - 40} width={18} height={80} fill="#2f6b4a" />
        <rect x={wx + 36} y={wy - 40} width={18} height={80} fill="#2f6b4a" />
      </g>
    );
  };
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x={-260} y={-300} width={520} height={300} fill={wall} />
      <rect x={-260} y={-300} width={520} height={300} fill="#000" opacity={night ? 0.25 : 0} />
      <rect x={-270} y={-470} width={540} height={180} fill={wood} />
      {[-200, -120, -40, 40, 120, 200].map((bx) => (
        <line key={bx} x1={bx} y1={-470} x2={bx} y2={-290} stroke={shade(wood, -0.25)} strokeWidth={6} />
      ))}
      <rect x={-290} y={-300} width={580} height={22} fill={shade(wood, -0.2)} />
      {/* balcony */}
      <rect x={-250} y={-330} width={500} height={14} fill={shade(wood, -0.3)} />
      {Array.from({ length: 21 }).map((_, i) => (
        <rect key={i} x={-245 + i * 24} y={-372} width={10} height={44} fill={shade(wood, -0.3)} />
      ))}
      <path d="M-350 -440 L0 -640 L350 -440 L320 -425 L0 -605 L-320 -425Z" fill={shade(wood, -0.35)} />
      <path d="M-330 -430 L0 -620 L330 -430Z" fill={shade(wood, -0.15)} opacity={0.0} />
      {snow && <path d="M-360 -445 L0 -650 L360 -445 L330 -430 Q170 -515 0 -615 Q-170 -515 -330 -430Z" fill={night ? "#d4dcf0" : "#fff"} />}
      {win(-160, -400, 1)}
      {win(160, -400, 2)}
      {win(-160, -160, 3)}
      {win(160, -160, 4)}
      <rect x={-50} y={-210} width={100} height={210} fill={door === "open" ? "#ffcf6b" : "#5a3418"} />
      <rect x={-50} y={-210} width={100} height={210} fill="none" stroke={shade(wood, -0.35)} strokeWidth={10} />
      <circle cx={30} cy={-100} r={7} fill="#d9b25a" />
      {snow && <rect x={-280} y={-14} width={560} height={30} rx={12} fill={night ? "#cdd6ec" : "#fff"} />}
      <ellipse cx={0} cy={6} rx={360} ry={26} fill="#000" opacity={0.2} />
    </g>
  );
};

export const Church: React.FC<{ x: number; y: number; s: number; snow: boolean; night: boolean; t: number }> = ({ x, y, s, snow, night }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-80} y={-640} width={160} height={640} fill={night ? "#cfd3dc" : "#f1efe8"} />
    <rect x={-80} y={-640} width={160} height={640} fill="#000" opacity={night ? 0.3 : 0.05} />
    <path d="M-95 -640 L0 -860 L95 -640Z" fill="#3c4a5a" />
    <circle cx={0} cy={-560} r={40} fill="#f5e6b8" stroke="#3a3a3a" strokeWidth={6} />
    <path d="M0 -560 L0 -590 M0 -560 L22 -555" stroke="#3a3a3a" strokeWidth={6} />
    <path d="M-40 -440 Q0 -500 40 -440 L40 -380 L-40 -380Z" fill="#2a2f3a" />
    <path d="M-28 -440 Q0 -470 28 -440 L28 -400 L-28 -400Z" fill="#c9a23a" />
    <rect x={-210} y={-300} width={210} height={300} fill={night ? "#c4c8d2" : "#ecebe4"} />
    <rect x={-210} y={-300} width={210} height={300} fill="#000" opacity={night ? 0.35 : 0.05} />
    <path d="M-225 -300 L-105 -380 L15 -300Z" fill="#3c4a5a" />
    <path d="M-150 -200 Q-120 -240 -90 -200 L-90 -120 L-150 -120Z" fill={night ? "#ffcf6b" : "#6a7a9a"} />
    <line x1={0} y1={-900} x2={0} y2={-860} stroke="#c9a23a" strokeWidth={8} />
    <line x1={-16} y1={-886} x2={16} y2={-886} stroke="#c9a23a" strokeWidth={8} />
    {snow && <path d="M-100 -640 L0 -868 L100 -640 L80 -632 L0 -836 L-80 -632Z" fill="#dfe6f6" />}
  </g>
);

export const House: React.FC<{ x: number; y: number; s: number; c?: string; roof?: string; snow: boolean; night: boolean; lit?: number; lights?: boolean; t: number }> = ({ x, y, s, c = "#c9b79a", roof = "#5a3a32", snow, night, lit = 0.7, lights, t }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-300} y={-380} width={600} height={380} fill={c} />
    <rect x={-300} y={-380} width={600} height={380} fill="#000" opacity={night ? 0.3 : 0} />
    <path d="M-350 -370 L0 -600 L350 -370Z" fill={roof} />
    <rect x={150} y={-560} width={60} height={120} fill={shade(roof, -0.2)} />
    {snow && <path d="M-360 -372 L0 -610 L360 -372 L330 -360 L0 -575 L-330 -360Z" fill="#e2e9f7" />}
    {[
      [-180, -260],
      [180, -260],
      [-180, -110],
    ].map(([wx, wy], i) => (
      <g key={i}>
        <rect x={wx - 60} y={wy - 50} width={120} height={100} fill={night && rnd(i + x) < lit ? "#ffcf6b" : "#2a3550"} stroke="#f1ede4" strokeWidth={10} />
        <line x1={wx} y1={wy - 50} x2={wx} y2={wy + 50} stroke="#f1ede4" strokeWidth={6} />
      </g>
    ))}
    <rect x={110} y={-190} width={120} height={190} fill="#7a2f2a" />
    <circle cx={205} cy={-95} r={8} fill="#d9b25a" />
    {lights &&
      Array.from({ length: 22 }).map((_, i) => {
        const lx = -340 + i * 31;
        const ly = -372 + Math.sin(i * 0.9) * 8 + (lx < 0 ? -(lx + 340) * 0.62 : -(340 - lx) * 0.62) * 0;
        const cols = ["#ff4d4d", "#ffd84d", "#4dff88", "#4db8ff"];
        const on = Math.sin(t * 3 + i) > -0.3;
        return <circle key={i} cx={lx} cy={ly + 6} r={9} fill={cols[i % 4]} opacity={on ? 1 : 0.35} />;
      })}
    {snow && <rect x={-320} y={-16} width={640} height={30} rx={12} fill="#e2e9f7" />}
  </g>
);

// ---------------------------------------------------------------- room shell

export const RoomShell: React.FC<{ wall: string; wallType: string; floor: string; floorType: string; floorY: number; beams?: boolean; seed: number }> = ({ wall, wallType, floor, floorType, floorY, beams, seed }) => {
  const planks = [];
  if (wallType === "wood") {
    for (let i = 0; i < 16; i++) {
      const x = -300 + i * 112;
      planks.push(<rect key={`p${i}`} x={x} y={-300} width={112} height={floorY + 300} fill={i % 2 ? wall : shade(wall, -0.05)} />);
      planks.push(<line key={`l${i}`} x1={x} y1={-300} x2={x} y2={floorY} stroke={shade(wall, -0.3)} strokeWidth={5} />);
      for (let k = 0; k < 3; k++) planks.push(<path key={`g${i}${k}`} d={`M${x + 30 + k * 25} ${200 + rnd(seed + i * 9 + k) * 600} q10 60 0 120`} stroke={shade(wall, -0.12)} strokeWidth={4} fill="none" />);
    }
  } else if (wallType === "stripes") {
    for (let i = 0; i < 24; i++) planks.push(<rect key={i} x={-300 + i * 72} y={-300} width={36} height={floorY + 300} fill={shade(wall, -0.06)} />);
  } else if (wallType === "brick" || wallType === "stone") {
    for (let r = 0; r < 34; r++)
      for (let c = 0; c < 14; c++) {
        const w = wallType === "stone" ? 120 : 130;
        const x = -300 + c * w + (r % 2 ? w / 2 : 0);
        const y = -300 + r * (wallType === "stone" ? 70 : 52);
        if (y > floorY) continue;
        planks.push(<rect key={`${r}-${c}`} x={x + 4} y={y + 4} width={w - 8} height={(wallType === "stone" ? 70 : 52) - 8} rx={wallType === "stone" ? 14 : 3} fill={shade(wall, (rnd(seed + r * 31 + c) - 0.5) * 0.14)} />);
      }
  } else if (wallType === "tile") {
    for (let r = 0; r < 40; r++)
      for (let c = 0; c < 16; c++) {
        const y = -300 + r * 60;
        if (y > floorY) continue;
        planks.push(<rect key={`${r}-${c}`} x={-300 + c * 100 + 3} y={y + 3} width={94} height={54} fill={shade(wall, (rnd(r * 7 + c) - 0.5) * 0.06)} />);
      }
  } else if (wallType === "concrete") {
    for (let i = 0; i < 9; i++) planks.push(<line key={i} x1={-300} y1={i * 220} x2={1380} y2={i * 220} stroke={shade(wall, -0.12)} strokeWidth={4} />);
    for (let i = 0; i < 30; i++) planks.push(<circle key={`c${i}`} cx={rnd(seed + i) * 1080} cy={rnd(seed + i * 2) * floorY} r={4} fill={shade(wall, -0.18)} />);
  }
  const fl: React.ReactNode[] = [];
  const vx = 540;
  const vy = floorY - 1400;
  if (floorType === "wood") {
    for (let i = -14; i <= 14; i++) {
      const bx = 540 + i * 140;
      const tx = vx + (bx - vx) * ((floorY - vy) / (2400 - vy));
      fl.push(<line key={i} x1={tx} y1={floorY} x2={bx} y2={2400} stroke={shade(floor, -0.25)} strokeWidth={5} />);
    }
  } else if (floorType === "tile" || floorType === "check") {
    for (let i = 0; i < 12; i++) {
      const y = floorY + Math.pow(i / 11, 1.6) * (1920 - floorY + 300);
      fl.push(<line key={`h${i}`} x1={-300} y1={y} x2={1380} y2={y} stroke={shade(floor, -0.2)} strokeWidth={4} />);
    }
    for (let i = -10; i <= 10; i++) {
      const bx = 540 + i * 170;
      const tx = vx + (bx - vx) * ((floorY - vy) / (2400 - vy));
      fl.push(<line key={`v${i}`} x1={tx} y1={floorY} x2={bx} y2={2400} stroke={shade(floor, -0.2)} strokeWidth={4} />);
    }
  }
  return (
    <g>
      <rect x={-300} y={-300} width={1680} height={floorY + 300} fill={wall} />
      {planks}
      <rect x={-300} y={-300} width={1680} height={floorY + 300} fill="url(#wallShade)" />
      <rect x={-300} y={floorY} width={1680} height={2400 - floorY} fill={floor} />
      {fl}
      <rect x={-300} y={floorY} width={1680} height={2400 - floorY} fill="url(#floorShade)" />
      <rect x={-300} y={floorY - 34} width={1680} height={36} fill={shade(wall, -0.35)} />
      {beams && (
        <g>
          <rect x={-300} y={0} width={1680} height={70} fill={shade(wall, -0.4)} />
          <rect x={-300} y={60} width={1680} height={14} fill="#000" opacity={0.2} />
        </g>
      )}
    </g>
  );
};

// ---------------------------------------------------------------- window with a view

export const Window: React.FC<{ x: number; y: number; w?: number; h?: number; ctx: Ctx; frame?: string; curtains?: string; closed?: boolean; view?: string; it: Item }> = ({ x, y, w = 330, h = 420, ctx, frame = "#5a3a22", curtains, closed, view }) => {
  const id = `win${Math.round(x)}${Math.round(y)}`;
  const t = ctx.t;
  const outside = view ?? (ctx.snow ? "snow" : "night");
  const sil = ctx.win;
  return (
    <g>
      <defs>
        <clipPath id={id}>
          <rect x={x - w / 2} y={y - h / 2} width={w} height={h} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${id})`}>
        <rect x={x - w / 2} y={y - h / 2} width={w} height={h} fill={outside === "day" ? "#9cc6ee" : outside === "space" ? "#03040c" : "#1a2550"} />
        {outside === "space" && (
          <g>
            {Array.from({ length: 40 }).map((_, i) => (
              <circle key={i} cx={x - w / 2 + rnd(i * 2.3) * w} cy={y - h / 2 + rnd(i * 5.1) * h} r={1 + rnd(i) * 2} fill="#fff" opacity={0.5 + rnd(i * 7) * 0.5} />
            ))}
            <circle cx={x + w * 0.1} cy={y + h * 0.9} r={w * 0.7} fill="#2a6ab0" />
            <path d={`M${x - w / 2} ${y + h * 0.45} Q${x} ${y + h * 0.3} ${x + w / 2} ${y + h * 0.42} L${x + w / 2} ${y + h / 2} L${x - w / 2} ${y + h / 2}Z`} fill="#3a8a4a" opacity={0.6} />
          </g>
        )}
        {outside !== "wall" && outside !== "space" && (
          <g>
            <circle cx={x + w * 0.22} cy={y - h * 0.25} r={36} fill="#f1efe4" opacity={outside === "day" ? 0 : 0.9} />
            <circle cx={x + w * 0.22} cy={y - h * 0.25} r={120} fill="url(#moonGlow)" opacity={outside === "day" ? 0 : 1} />
            <path d={`M${x - w / 2} ${y + h * 0.25} L${x - w * 0.2} ${y + h * 0.05} L${x + w * 0.05} ${y + h * 0.2} L${x + w * 0.3} ${y} L${x + w / 2} ${y + h * 0.18} L${x + w / 2} ${y + h / 2} L${x - w / 2} ${y + h / 2}Z`} fill={outside === "day" ? "#6a8a6a" : "#121a33"} />
            {outside === "snow" &&
              Array.from({ length: 26 }).map((_, i) => {
                const sx = x - w / 2 + ((rnd(i) * w + t * 20 * (0.5 + rnd(i * 3))) % w);
                const sy = y - h / 2 + ((rnd(i * 2) * h + t * 70 * (0.6 + rnd(i * 5))) % h);
                return <circle key={i} cx={sx} cy={sy} r={2 + rnd(i * 7) * 3} fill="#fff" opacity={0.8} />;
              })}
            {sil === "horned" && !closed && (
              <g transform={`translate(${x - w * 0.05} ${y + h * 0.55}) scale(0.5)`} opacity={0.95}>
                <path d="M-90 0 C-110 -200 -90 -380 -60 -420 L-120 -560 L-40 -460 Q0 -490 40 -460 L120 -560 L60 -420 C90 -380 110 -200 90 0Z" fill="#050507" />
                <circle cx={-22} cy={-400} r={10} fill="#ffd23a" />
                <circle cx={22} cy={-400} r={10} fill="#ffd23a" />
              </g>
            )}
            {sil === "eyes" && (
              <g>
                <circle cx={x - 30} cy={y + 10} r={9} fill="#ffd23a" />
                <circle cx={x + 30} cy={y + 10} r={9} fill="#ffd23a" />
                <circle cx={x} cy={y + 10} r={80} fill="url(#eyeGlow)" opacity={0.4} />
              </g>
            )}
            {sil === "face" && (
              <g transform={`translate(${x} ${y + h * 0.15})`}>
                <ellipse cx={0} cy={0} rx={120} ry={150} fill="#0a0a0d" />
                <circle cx={-40} cy={-20} r={12} fill="#ffd23a" />
                <circle cx={40} cy={-20} r={12} fill="#ffd23a" />
              </g>
            )}
            {sil === "figure" && (
              <g transform={`translate(${x} ${y + h * 0.5})`}>
                <path d="M-70 0 C-80 -140 -60 -200 -40 -220 C-70 -250 -70 -320 0 -330 C70 -320 70 -250 40 -220 C60 -200 80 -140 70 0Z" fill="#06070a" />
              </g>
            )}
          </g>
        )}
        {/* glass reflection */}
        <path d={`M${x - w / 2 + 30} ${y - h / 2} L${x - w / 2 + 90} ${y - h / 2} L${x - w / 2} ${y - h / 2 + 140} L${x - w / 2} ${y - h / 2 + 60}Z`} fill="#fff" opacity={0.07} />
      </g>
      <rect x={x - w / 2} y={y - h / 2} width={w} height={h} fill="none" stroke={frame} strokeWidth={22} />
      <line x1={x} y1={y - h / 2} x2={x} y2={y + h / 2} stroke={frame} strokeWidth={14} />
      <line x1={x - w / 2} y1={y} x2={x + w / 2} y2={y} stroke={frame} strokeWidth={14} />
      <rect x={x - w / 2 - 30} y={y + h / 2} width={w + 60} height={24} fill={shade(frame, -0.2)} />
      {curtains && (
        <g>
          {closed ? (
            <g>
              <rect x={x - w / 2 - 20} y={y - h / 2 - 30} width={w + 40} height={h + 60} fill={curtains} />
              {Array.from({ length: 9 }).map((_, i) => (
                <line key={i} x1={x - w / 2 + i * (w / 8)} y1={y - h / 2 - 30} x2={x - w / 2 + i * (w / 8)} y2={y + h / 2 + 30} stroke={shade(curtains, -0.25)} strokeWidth={8} />
              ))}
              {(sil === "horned" || sil === "figure") && (
                <g transform={`translate(${x} ${y + h / 2 + 20}) scale(${sil === "horned" ? 0.62 : 0.9})`} opacity={0.85}>
                  {sil === "horned" ? (
                    <path d="M-150 30 C-170 -160 -120 -300 -70 -330 C-110 -380 -170 -420 -190 -520 C-130 -450 -80 -420 -40 -400 Q0 -430 40 -400 C80 -420 130 -450 190 -520 C170 -420 110 -380 70 -330 C120 -300 170 -160 150 30Z" fill={shade(curtains, -0.65)} />
                  ) : (
                    <path d="M-80 30 C-90 -140 -60 -200 -40 -220 C-70 -250 -70 -320 0 -330 C70 -320 70 -250 40 -220 C60 -200 90 -140 80 30Z" fill={shade(curtains, -0.65)} />
                  )}
                </g>
              )}
            </g>
          ) : (
            <g>
              <path d={`M${x - w / 2 - 40} ${y - h / 2 - 30} L${x - w / 2 + 50} ${y - h / 2 - 30} Q${x - w / 2 + 20} ${y} ${x - w / 2 + 40} ${y + h / 2 + 40} L${x - w / 2 - 40} ${y + h / 2 + 40}Z`} fill={curtains} />
              <path d={`M${x + w / 2 + 40} ${y - h / 2 - 30} L${x + w / 2 - 50} ${y - h / 2 - 30} Q${x + w / 2 - 20} ${y} ${x + w / 2 - 40} ${y + h / 2 + 40} L${x + w / 2 + 40} ${y + h / 2 + 40}Z`} fill={curtains} />
            </g>
          )}
          <rect x={x - w / 2 - 60} y={y - h / 2 - 44} width={w + 120} height={14} rx={7} fill="#2a1d14" />
        </g>
      )}
    </g>
  );
};

// ---------------------------------------------------------------- furniture & props

export function buildItem(it: Item, ctx: Ctx): Built {
  const t = ctx.t;
  const x = px(it.x);
  const fy = ctx.floorY + (it.y ?? 0);
  const s = it.s ?? 1;
  const c = it.c;
  const fl = ctx.flicker;
  const T = (node: React.ReactNode, y = fy) => <g transform={`translate(${x} ${y}) scale(${it.flip ? -s : s} ${s})`}>{node}</g>;
  switch (it.t) {
    case "window": {
      const y = it.y !== undefined && it.y < 0 ? ctx.floorY + it.y : ctx.floorY - 620;
      const lit = ctx.win === "light";
      const closed = !!it.v?.includes("closed");
      return {
        body: <rect x={x - 180 * s} y={y - 230 * s} width={360 * s} height={460 * s} fill="#000" opacity={0.2} />,
        lit: (
          <g style={{ filter: closed ? "brightness(0.75)" : "brightness(0.85)" }}>
            <Window x={x} y={y} w={340 * s} h={430 * s} ctx={ctx} frame={c ?? "#5a3a22"} curtains={it.v?.includes("curtain") ? (it.v.split(":")[1] ?? "#9a2424") : undefined} closed={closed} view={it.v?.includes("day") ? "day" : it.v?.includes("space") ? "space" : undefined} it={it} />
          </g>
        ),
        glow: lit || (it.v?.includes("closed") && ctx.win) ? <rect x={x - 200} y={y - 240} width={400} height={480} fill="url(#redPool)" opacity={0.6} /> : <ellipse cx={x} cy={y + 500} rx={260 * s} ry={120} fill="#b9c8ff" opacity={0.06} />,
      };
    }
    case "door": {
      const open = it.v === "open";
      const ajar = it.v === "ajar";
      const chain = it.v === "chain";
      const airlock = it.v === "airlock";
      const col = c ?? (airlock ? "#8a929e" : "#6a4026");
      if (airlock)
        return {
          body: T(
            <g>
              <rect x={-170} y={-600} width={340} height={600} rx={40} fill="#5a626e" />
              <rect x={-150} y={-580} width={300} height={580} rx={30} fill={col} />
              <line x1={0} y1={-580} x2={0} y2={0} stroke="#3a3f48" strokeWidth={8} />
              <circle cx={0} cy={-380} r={80} fill="#05070e" stroke="#c8d0da" strokeWidth={14} />
              <circle cx={-20} cy={-400} r={2} fill="#fff" />
              <circle cx={30} cy={-360} r={2} fill="#fff" />
              {Array.from({ length: 6 }).map((_, i) => (
                <rect key={i} x={-150} y={-120 + i * 18} width={300} height={9} fill={i % 2 ? "#e0b030" : "#1a1a1a"} />
              ))}
            </g>,
          ),
          glow: <circle cx={x} cy={fy - 380 * s} r={160 * s} fill="#ff3a3a" opacity={0.12 + 0.08 * Math.sin(t * 4)} />,
        };
      const shake = it.v === "knock" ? Math.sin(t * 40) * (Math.sin(t * 3) > 0.3 ? 3 : 0) : 0;
      return {
        body: T(
          <g transform={`translate(${shake} 0)`}>
            <rect x={-150} y={-560} width={300} height={560} fill={shade(col, -0.45)} />
            {open || ajar ? (
              <g>
                <rect x={-140} y={-550} width={280} height={550} fill={ctx.win === "light" ? "#ffcf6b" : "#07080c"} />
                {ctx.win === "figure" && <path d="M-60 0 C-70 -200 -50 -280 -30 -300 C-60 -330 -60 -400 0 -410 C60 -400 60 -330 30 -300 C50 -280 70 -200 60 0Z" fill="#000" />}
                {ctx.win === "eyes" && (
                  <g>
                    <circle cx={-26} cy={-380} r={9} fill="#ffd23a" />
                    <circle cx={26} cy={-380} r={9} fill="#ffd23a" />
                  </g>
                )}
                <path d={ajar ? "M-140 -550 L-60 -530 L-60 -20 L-140 0Z" : "M-140 -550 L-210 -580 L-210 30 L-140 0Z"} fill={col} />
              </g>
            ) : (
              <g>
                <rect x={-140} y={-550} width={280} height={550} fill={col} />
                <rect x={-110} y={-510} width={220} height={210} rx={6} fill={shade(col, -0.12)} />
                <rect x={-110} y={-270} width={220} height={240} rx={6} fill={shade(col, -0.12)} />
                <circle cx={100} cy={-280} r={14} fill="#d8b04a" />
                <circle cx={0} cy={-430} r={9} fill="#1a1a1a" />
                {chain && <path d="M70 -330 Q20 -300 -40 -330" stroke="#c8c8c8" strokeWidth={8} fill="none" strokeDasharray="12 6" />}
              </g>
            )}
          </g>,
        ),
        glow: (open || ajar) && ctx.win === "light" ? <ellipse cx={x} cy={fy} rx={300} ry={90} fill="url(#warmPool)" /> : undefined,
      };
    }
    case "stove":
    case "fireplace": {
      const fire = 0.85 + Math.sin(t * 9) * 0.08 + Math.sin(t * 23) * 0.05;
      const kachel = it.t === "stove";
      const col = c ?? (kachel ? "#2f6b5a" : "#7a6a5a");
      return {
        body: T(
          kachel ? (
            <g>
              <rect x={-150} y={-470} width={300} height={470} rx={20} fill={col} />
              {Array.from({ length: 6 }).map((_, r) =>
                [0, 1, 2].map((cc) => <rect key={`${r}${cc}`} x={-140 + cc * 94} y={-460 + r * 76} width={86} height={68} rx={8} fill={shade(col, cc % 2 ? 0.08 : -0.05)} />),
              )}
              <rect x={-70} y={-170} width={140} height={110} rx={10} fill="#1a0d08" />
              <path d={`M-50 -70 Q-30 ${-150 * fire} 0 -80 Q30 ${-160 * fire} 50 -70Z`} fill="#ff9a2a" />
              <path d={`M-25 -70 Q0 ${-120 * fire} 25 -70Z`} fill="#ffe17a" />
              <rect x={-170} y={-500} width={340} height={40} rx={8} fill={shade(col, -0.3)} />
            </g>
          ) : (
            <g>
              <rect x={-230} y={-430} width={460} height={430} fill={col} />
              <rect x={-260} y={-460} width={520} height={50} fill={shade(col, -0.25)} />
              <path d="M-140 0 L-140 -220 Q0 -300 140 -220 L140 0Z" fill="#140a06" />
              <path d={`M-90 -20 Q-60 ${-200 * fire} -20 -40 Q10 ${-230 * fire} 40 -40 Q70 ${-190 * fire} 90 -20Z`} fill="#ff8a1a" />
              <path d={`M-40 -20 Q0 ${-140 * fire} 40 -20Z`} fill="#ffe27a" />
              <rect x={-110} y={-26} width={220} height={22} rx={10} fill="#4a2a18" />
            </g>
          ),
        ),
        glow: (
          <g>
            <ellipse cx={x} cy={fy - 80 * s} rx={520 * fire * s} ry={420 * fire * s} fill="url(#warmPool)" />
            <ellipse cx={x} cy={fy - 80 * s} rx={200 * fire * s} ry={160 * s} fill="url(#warmPool)" />
          </g>
        ),
      };
    }
    case "tree": {
      const col = c ?? "#1f5a3a";
      const cols = ["#ff4d4d", "#ffd84d", "#ffffff", "#ff9a4d"];
      const bulbs = Array.from({ length: 26 }).map((_, i) => {
        const k = i / 26;
        const yy = -80 - k * 520;
        const ww = (1 - k) * 170;
        const xx = Math.sin(i * 2.4) * ww;
        const on = 0.55 + 0.45 * Math.sin(t * 2.5 + i * 1.7);
        return { xx, yy, on, col: cols[i % 4] };
      });
      return {
        body: T(
          <g>
            <rect x={-22} y={-80} width={44} height={80} fill="#5a3418" />
            {[0, 1, 2, 3].map((i) => (
              <path key={i} d={`M${-210 + i * 40} ${-60 - i * 140} L0 ${-300 - i * 140} L${210 - i * 40} ${-60 - i * 140}Z`} fill={i % 2 ? col : shade(col, 0.08)} />
            ))}
            <path d="M0 -720 l18 40 l44 4 l-34 28 l12 44 l-40 -24 l-40 24 l12 -44 l-34 -28 l44 -4Z" fill="#ffd84d" />
            {bulbs.map((b, i) => (
              <circle key={i} cx={b.xx} cy={b.yy} r={11} fill={b.col} opacity={0.4 + 0.6 * b.on} />
            ))}
            <rect x={-120} y={-40} width={80} height={60} fill="#b3262e" />
            <rect x={40} y={-30} width={70} height={50} fill="#2f6bb0" />
          </g>,
        ),
        glow: (
          <g transform={`translate(${x} ${fy}) scale(${s})`}>
            {bulbs.map((b, i) => (
              <circle key={i} cx={b.xx} cy={b.yy} r={40} fill={b.col} opacity={0.12 * b.on} />
            ))}
          </g>
        ),
      };
    }
    case "candles": {
      const n = it.v === "1" ? 1 : 4;
      return {
        body: T(
          <g>
            {n === 4 && <ellipse cx={0} cy={-10} rx={150} ry={34} fill="#2f5a2f" />}
            {Array.from({ length: n }).map((_, i) => {
              const cx = n === 1 ? 0 : -105 + i * 70;
              const f = 1 + Math.sin(t * 13 + i * 2) * 0.12;
              return (
                <g key={i}>
                  <rect x={cx - 14} y={-110} width={28} height={100} rx={4} fill="#b3262e" />
                  <path d={`M${cx} ${-150 * f} C${cx + 12} -134 ${cx + 10} -118 ${cx} -112 C${cx - 10} -118 ${cx - 12} -134 ${cx} ${-150 * f}Z`} fill="#ffcf5a" />
                </g>
              );
            })}
          </g>,
        ),
        glow: <ellipse cx={x} cy={fy - 130 * s} rx={300 * s} ry={260 * s} fill="url(#candleGlow)" opacity={0.9 + Math.sin(t * 13) * 0.08} />,
      };
    }
    case "lamp": {
      const on = (it.v !== "off") && fl > 0.5;
      return {
        body: T(
          <g>
            <rect x={-8} y={-560} width={16} height={560} fill="#2a2a2e" />
            <ellipse cx={0} cy={-4} rx={70} ry={14} fill="#2a2a2e" />
            <path d="M-90 -560 L90 -560 L60 -680 L-60 -680Z" fill={on ? "#ffe3a8" : "#8a7a5a"} />
          </g>,
        ),
        glow: on ? <ellipse cx={x} cy={fy - 560 * s} rx={420 * s} ry={380 * s} fill="url(#warmPool)" /> : undefined,
      };
    }
    case "streetlamp": {
      const on = it.v !== "off" && fl > 0.5;
      return {
        body: T(
          <g>
            <rect x={-10} y={-820} width={20} height={820} fill="#22252c" />
            <path d="M0 -820 Q0 -860 60 -860 L90 -860" stroke="#22252c" strokeWidth={16} fill="none" />
            <path d="M60 -870 L130 -870 L120 -840 L70 -840Z" fill="#22252c" />
            <rect x={74} y={-842} width={42} height={10} fill={on ? "#fff3c4" : "#555"} />
          </g>,
        ),
        glow: on ? (
          <g transform={`translate(${x} ${fy}) scale(${s})`}>
            <path d="M75 -836 L115 -836 L330 0 L-140 0Z" fill="#fff1c0" opacity={0.08} />
            <ellipse cx={95} cy={-840} rx={180} ry={140} fill="url(#warmPool)" />
            <ellipse cx={95} cy={0} rx={260} ry={50} fill="url(#warmPool)" />
          </g>
        ) : undefined,
      };
    }
    case "clock": {
      const y = ctx.floorY - 900;
      const cuckoo = it.v !== "wall";
      const a = (t * 6) % 360;
      return {
        body: (
          <g transform={`translate(${x} ${it.y !== undefined && it.y < 0 ? ctx.floorY + it.y : y}) scale(${s})`}>
            {cuckoo ? (
              <g>
                <path d="M-110 -60 L0 -170 L110 -60Z" fill="#4a2a14" />
                <rect x={-90} y={-70} width={180} height={190} fill="#6a3e1e" />
                <circle cx={0} cy={20} r={62} fill="#f3e7c8" stroke="#3a2210" strokeWidth={8} />
                <line x1={0} y1={20} x2={0} y2={-24} stroke="#222" strokeWidth={7} />
                <line x1={0} y1={20} x2={30} y2={36} stroke="#222" strokeWidth={6} />
                <line x1={-20} y1={120} x2={-20} y2={240 + Math.sin(t * 3) * 4} stroke="#c9a23a" strokeWidth={4} />
                <line x1={20} y1={120} x2={20} y2={200} stroke="#c9a23a" strokeWidth={4} />
                <ellipse cx={-20} cy={250} rx={12} ry={24} fill="#c9a23a" />
                <ellipse cx={20} cy={210} rx={12} ry={24} fill="#c9a23a" />
                <g transform={`translate(0 210) rotate(${Math.sin(t * 3) * 18})`}>
                  <line x1={0} y1={-90} x2={0} y2={60} stroke="#c9a23a" strokeWidth={5} />
                  <circle cx={0} cy={60} r={20} fill="#c9a23a" />
                </g>
              </g>
            ) : (
              <g>
                <circle cx={0} cy={0} r={80} fill="#f3efe4" stroke="#2a2a2a" strokeWidth={10} />
                <line x1={0} y1={0} x2={0} y2={-50} stroke="#222" strokeWidth={8} transform={`rotate(${a})`} />
                <line x1={0} y1={0} x2={34} y2={0} stroke="#222" strokeWidth={8} />
              </g>
            )}
          </g>
        ),
      };
    }
    case "picture":
      return {
        body: (
          <g transform={`translate(${x} ${ctx.floorY - 820 + (it.y ?? 0)}) scale(${s})`}>
            <rect x={-90} y={-70} width={180} height={140} fill="#3a2414" />
            <rect x={-74} y={-54} width={148} height={108} fill={c ?? "#8aa0b8"} />
            <path d="M-74 54 L-20 0 L20 30 L50 0 L74 30 L74 54Z" fill="#4a6a4a" />
          </g>
        ),
      };
    case "shelf":
      return {
        body: (
          <g transform={`translate(${x} ${ctx.floorY - 760 + (it.y ?? 0)}) scale(${s})`}>
            <rect x={-150} y={0} width={300} height={18} fill="#4a2a14" />
            {[-120, -80, -40, 30, 70].map((bx, i) => (
              <rect key={i} x={bx} y={-70 + (i % 2) * 14} width={30} height={70 - (i % 2) * 14} fill={["#b3262e", "#2f6bb0", "#e0b84a", "#3a7a4a", "#7a3a8a"][i]} />
            ))}
            <circle cx={115} cy={-20} r={20} fill="#c9a23a" />
          </g>
        ),
      };
    case "bed": {
      const col = c ?? "#4a6fa5";
      return {
        body: T(
          <g>
            <rect x={-260} y={-330} width={40} height={330} rx={10} fill="#5a3418" />
            <rect x={220} y={-250} width={40} height={250} rx={10} fill="#5a3418" />
            <rect x={-240} y={-190} width={480} height={120} rx={14} fill="#e9e4da" />
            <rect x={-230} y={-250} width={140} height={70} rx={30} fill="#f6f2ea" />
            <path d="M-120 -210 L240 -210 L240 -80 L-120 -80Z" fill={col} />
            <path d="M-120 -210 L240 -210 L240 -180 L-120 -180Z" fill={shade(col, 0.15)} />
            <rect x={-240} y={-80} width={480} height={36} fill="#5a3418" />
            {it.v === "under" && (
              <g>
                <rect x={-220} y={-44} width={440} height={44} fill="#050508" />
              </g>
            )}
          </g>,
        ),
      };
    }
    case "bunk": {
      const col = c ?? "#7a8a9a";
      return {
        body: T(
          <g>
            {[0, 1].map((k) => (
              <g key={k} transform={`translate(0 ${-k * 300})`}>
                <rect x={-220} y={-130} width={440} height={60} rx={8} fill="#e8e4dc" />
                <rect x={-220} y={-160} width={120} height={40} rx={16} fill="#f6f2ea" />
                <rect x={-80} y={-150} width={300} height={44} fill={col} />
              </g>
            ))}
            <rect x={-235} y={-640} width={22} height={640} fill="#55606e" />
            <rect x={213} y={-640} width={22} height={640} fill="#55606e" />
          </g>,
        ),
      };
    }
    case "sofa":
    case "armchair": {
      const col = c ?? "#8a3a3a";
      const w = it.t === "sofa" ? 300 : 140;
      return {
        body: T(
          <g>
            <rect x={-w - 40} y={-300} width={(w + 40) * 2} height={190} rx={50} fill={shade(col, -0.1)} />
            <rect x={-w} y={-170} width={w * 2} height={110} rx={24} fill={col} />
            <rect x={-w - 60} y={-220} width={90} height={190} rx={40} fill={shade(col, -0.05)} />
            <rect x={w - 30} y={-220} width={90} height={190} rx={40} fill={shade(col, -0.05)} />
            <rect x={-w - 40} y={-40} width={20} height={40} fill="#3a2414" />
            <rect x={w + 20} y={-40} width={20} height={40} fill="#3a2414" />
          </g>,
        ),
      };
    }
    case "table": {
      const col = c ?? "#6a4026";
      return {
        body: T(
          <g>
            <rect x={-220} y={-270} width={440} height={30} rx={6} fill={col} />
            {it.v === "cloth" && <path d="M-230 -270 L230 -270 L250 -150 L-250 -150Z" fill="#b3262e" />}
            {it.v === "cloth" && <path d="M-230 -270 L230 -270 L250 -150 L-250 -150Z" fill="url(#check)" opacity={0.5} />}
            <rect x={-200} y={-240} width={26} height={240} fill={shade(col, -0.2)} />
            <rect x={174} y={-240} width={26} height={240} fill={shade(col, -0.2)} />
          </g>,
        ),
      };
    }
    case "chair":
      return {
        body: T(
          <g>
            <rect x={-70} y={-380} width={20} height={380} fill={c ?? "#5a3418"} />
            <rect x={50} y={-180} width={20} height={180} fill={c ?? "#5a3418"} />
            <rect x={-70} y={-190} width={140} height={22} fill={shade(c ?? "#5a3418", 0.1)} />
            <rect x={-70} y={-380} width={20} height={200} fill={c ?? "#5a3418"} />
          </g>,
        ),
      };
    case "desk":
      return {
        body: T(
          <g>
            <rect x={-230} y={-280} width={460} height={26} fill={c ?? "#7a5a3a"} />
            <rect x={-220} y={-254} width={150} height={254} fill={shade(c ?? "#7a5a3a", -0.15)} />
            <rect x={200} y={-254} width={20} height={254} fill={shade(c ?? "#7a5a3a", -0.2)} />
            <rect x={-40} y={-470} width={220} height={150} rx={10} fill="#1a1d24" />
            <rect x={-30} y={-460} width={200} height={130} rx={6} fill="#6aa0ff" opacity={0.85} />
            <rect x={50} y={-320} width={40} height={40} fill="#1a1d24" />
          </g>,
        ),
        glow: <ellipse cx={x + 70 * s} cy={fy - 400 * s} rx={300 * s} ry={260 * s} fill="url(#screenGlow)" />,
      };
    case "boots":
      return {
        body: T(
          <g>
            {[-50, 50].map((bx) => (
              <g key={bx}>
                <path d={`M${bx - 34} -150 L${bx + 26} -150 L${bx + 26} -40 L${bx + 70} -30 Q${bx + 80} 0 ${bx + 60} 0 L${bx - 34} 0Z`} fill="#6a4026" />
                <rect x={bx - 38} y={-156} width={68} height={14} fill="#4a2a14" />
              </g>
            ))}
            {it.v === "birch" && (
              <g strokeLinecap="round">
                {[-20, -8, 4, 16, 28, 40, 52, 64].map((dx, i) => (
                  <g key={i}>
                    <line x1={50} y1={-150} x2={50 + dx * 1.6 - 30} y2={-380 + Math.abs(dx - 22) * 2} stroke="#2a2018" strokeWidth={11} />
                    <line x1={50} y1={-150} x2={50 + dx * 1.6 - 30} y2={-380 + Math.abs(dx - 22) * 2} stroke="#d8d0bf" strokeWidth={6} />
                  </g>
                ))}
                <rect x={30} y={-200} width={42} height={20} rx={3} fill="#0a0a0a" />
                <path d="M72 -190 q30 10 26 40 M72 -186 q14 26 -4 50" stroke="#0a0a0a" strokeWidth={6} fill="none" />
              </g>
            )}
            {it.v === "choc" && (
              <g>
                <rect x={-92} y={-210} width={64} height={52} rx={4} fill="#c0392b" />
                <rect x={-92} y={-192} width={64} height={10} fill="#ffd84d" />
                <circle cx={-34} cy={-200} r={22} fill="#e0b84a" />
                <circle cx={-34} cy={-200} r={14} fill="#c9952a" />
                <path d="M-70 -150 L-50 -230 L-30 -150Z" fill="#7a4a24" />
              </g>
            )}
          </g>,
        ),
      };
    case "bells":
      return {
        body: T(
          <g>
            <line x1={0} y1={-640} x2={0} y2={-520} stroke="#5a3418" strokeWidth={6} />
            <g transform={`translate(0 -520) rotate(${Math.sin(t * 6) * (it.v === "ring" ? 18 : 2)})`}>
              <path d="M-40 70 Q-40 0 0 0 Q40 0 40 70Z" fill="#c9a23a" stroke="#7a5a10" strokeWidth={5} />
              <circle cx={0} cy={76} r={10} fill="#7a5a10" />
            </g>
          </g>,
        ),
      };
    case "rug":
      return { body: <ellipse cx={x} cy={fy + 120 + (it.y ?? 0)} rx={380 * s} ry={110 * s} fill={c ?? "#8a2b2b"} /> };
    case "pine":
      return { body: <Pine x={x} y={fy} h={900 * s} c={c ?? (ctx.night ? "#18283c" : "#2f5a3f")} snow={ctx.snow} night={ctx.night} /> };
    case "deadtree":
      return {
        body: T(
          <g stroke={c ?? "#1a1512"} strokeLinecap="round" fill="none">
            <path d="M0 0 L0 -600" strokeWidth={46} />
            <path d="M0 -300 L-180 -520 M0 -420 L160 -640 M-90 -410 L-200 -420 M80 -530 L170 -520 M0 -600 L-60 -760 M0 -600 L60 -780" strokeWidth={18} />
          </g>,
        ),
      };
    case "chalet":
      return { body: <Chalet x={x} y={fy} s={s * 0.9} c={c} snow={ctx.snow} night={ctx.night} t={t} lit={it.v === "dark" ? 0 : 0.8} door={it.v} />, glow: ctx.night && it.v !== "dark" ? <ellipse cx={x} cy={fy - 250 * s} rx={420 * s} ry={300 * s} fill="url(#warmPool)" opacity={0.5} /> : undefined };
    case "house":
      return { body: <House x={x} y={fy} s={s * 0.9} c={c} snow={ctx.snow} night={ctx.night} lights={it.v === "lights"} t={t} /> };
    case "church":
      return { body: <Church x={x} y={fy} s={s} snow={ctx.snow} night={ctx.night} t={t} /> };
    case "car": {
      const col = c ?? "#3a5a8a";
      const lights = ctx.night;
      const roll = it.v === "drive" ? Math.sin(t * 20) * 1.5 : 0;
      return {
        body: T(
          <g transform={`translate(0 ${roll})`}>
            <path d="M-260 -60 L-250 -150 L-150 -160 L-90 -250 L120 -250 L190 -160 L260 -140 L265 -60Z" fill={col} />
            <path d="M-80 -235 L110 -235 L160 -165 L-140 -165Z" fill="#2a3550" />
            <line x1={20} y1={-235} x2={20} y2={-165} stroke={col} strokeWidth={10} />
            <rect x={-265} y={-80} width={530} height={30} rx={12} fill={shade(col, -0.25)} />
            {[-160, 160].map((wx) => (
              <g key={wx}>
                <circle cx={wx} cy={-50} r={52} fill="#141418" />
                <circle cx={wx} cy={-50} r={24} fill="#8a8a90" />
              </g>
            ))}
            <rect x={240} y={-140} width={24} height={20} fill="#fff3c4" />
          </g>,
        ),
        glow: lights ? (
          <g transform={`translate(${x} ${fy}) scale(${it.flip ? -s : s} ${s})`}>
            <path d="M262 -130 L1100 -330 L1100 120Z" fill="#fff6d0" opacity={0.14} />
            <ellipse cx={262} cy={-130} rx={60} ry={40} fill="#fff6d0" opacity={0.5} />
          </g>
        ) : undefined,
      };
    }
    case "fence":
      return {
        body: (
          <g>
            {Array.from({ length: 24 }).map((_, i) => (
              <rect key={i} x={-200 + i * 64} y={fy - 150 * s} width={26} height={150 * s} fill={c ?? "#5a3a22"} />
            ))}
            <rect x={-200} y={fy - 120 * s} width={1600} height={16} fill={c ?? "#5a3a22"} />
            <rect x={-200} y={fy - 60 * s} width={1600} height={16} fill={c ?? "#5a3a22"} />
          </g>
        ),
      };
    case "campfire": {
      const fire = 0.85 + Math.sin(t * 11) * 0.1 + Math.sin(t * 27) * 0.05;
      return {
        body: T(
          <g>
            <path d="M-110 -10 L110 -40 M-110 -40 L110 -10" stroke="#4a2a14" strokeWidth={26} strokeLinecap="round" />
            <path d={`M-70 -20 Q-50 ${-200 * fire} -10 -40 Q20 ${-260 * fire} 50 -40 Q80 ${-180 * fire} 80 -20Z`} fill="#ff8a1a" />
            <path d={`M-30 -20 Q0 ${-160 * fire} 30 -20Z`} fill="#ffe27a" />
          </g>,
        ),
        glow: <ellipse cx={x} cy={fy - 100 * s} rx={600 * fire * s} ry={450 * fire * s} fill="url(#warmPool)" />,
      };
    }
    case "footprints":
      return {
        body: (
          <g fill={ctx.night ? "#7d8bb0" : "#c9d4e6"}>
            {Array.from({ length: 8 }).map((_, i) => {
              const k = i / 8;
              const yy = fy + 60 + k * 420;
              const xx = x + (i % 2 ? 40 : -40) * (0.5 + k);
              return (
                <g key={i}>
                  {it.v === "hoof" ? (
                    <g>
                      <ellipse cx={xx - 12 * (0.5 + k)} cy={yy} rx={12 * (0.5 + k)} ry={22 * (0.5 + k)} />
                      <ellipse cx={xx + 12 * (0.5 + k)} cy={yy} rx={12 * (0.5 + k)} ry={22 * (0.5 + k)} />
                    </g>
                  ) : (
                    <ellipse cx={xx} cy={yy} rx={18 * (0.5 + k)} ry={34 * (0.5 + k)} />
                  )}
                </g>
              );
            })}
          </g>
        ),
      };
    case "crowd": {
      const n = Number(it.v ?? 12);
      return {
        body: (
          <g>
            {Array.from({ length: n }).map((_, i) => {
              const cx = -60 + (i / n) * 1200 + rnd(ctx.seed + i) * 40;
              const cy = fy + (i % 3) * 40;
              const h = 300 + rnd(i * 3) * 60;
              const bob = Math.sin(t * 2 + i) * 3;
              const col = c ?? "#0e1220";
              return (
                <g key={i} transform={`translate(${cx} ${cy + bob})`}>
                  <path d={`M-60 0 L-50 ${-h * 0.62} Q0 ${-h * 0.7} 50 ${-h * 0.62} L60 0Z`} fill={shade(col, (i % 3) * 0.05)} />
                  <circle cx={0} cy={-h * 0.78} r={h * 0.13} fill={shade(col, (i % 3) * 0.05)} />
                </g>
              );
            })}
          </g>
        ),
      };
    }
    case "torches": {
      // a row of burning torches (parade)
      return {
        body: <g />,
        glow: (
          <g>
            {Array.from({ length: 6 }).map((_, i) => {
              const cx = 80 + i * 190;
              const f = 1 + Math.sin(t * 12 + i) * 0.1;
              return (
                <g key={i}>
                  <path d={`M${cx} ${fy - 420} q14 -50 0 ${-90 * f} q-14 40 0 ${90 * f}Z`} fill="#ffb03a" />
                  <circle cx={cx} cy={fy - 460} r={150 * f} fill="url(#warmPool)" />
                </g>
              );
            })}
          </g>
        ),
      };
    }
    case "sign": {
      return {
        body: T(
          <g>
            <rect x={-8} y={-300} width={16} height={300} fill="#3a2a1a" />
            <rect x={-150} y={-360} width={300} height={90} rx={8} fill={c ?? "#e8dfc8"} stroke="#3a2a1a" strokeWidth={6} />
            <text x={0} y={-302} fontSize={40} fontFamily="Montserrat" fontWeight={900} textAnchor="middle" fill="#2a1d14">
              {(it.v ?? "").replace(/_/g, " ")}
            </text>
          </g>,
        ),
      };
    }
    case "board": {
      // planning / evidence board with photos and red string
      return {
        body: (
          <g transform={`translate(${x} ${ctx.floorY - 760}) scale(${s})`}>
            <rect x={-300} y={-220} width={600} height={400} fill="#b48a5a" stroke="#5a3a1a" strokeWidth={14} />
            {[
              [-220, -140],
              [-60, -160],
              [120, -130],
              [-180, 40],
              [40, 60],
              [200, 40],
            ].map(([bx, by], i) => (
              <g key={i} transform={`rotate(${(rnd(i) - 0.5) * 14} ${bx} ${by})`}>
                <rect x={bx - 60} y={by - 50} width={120} height={100} fill="#f4f1ea" />
                <rect x={bx - 50} y={by - 40} width={100} height={66} fill={["#6a7a9a", "#9a6a5a", "#5a7a5a"][i % 3]} />
                <circle cx={bx} cy={by - 52} r={8} fill="#c0392b" />
              </g>
            ))}
            <path d="M-220 -192 L-60 -212 L120 -182 L40 8 L-180 -12 L200 -12" stroke="#d62828" strokeWidth={4} fill="none" />
          </g>
        ),
      };
    }
    case "bars": {
      return {
        body: (
          <g>
            <rect x={-300} y={-300} width={1680} height={60} fill="#3a3f48" />
            {Array.from({ length: 17 }).map((_, i) => (
              <g key={i}>
                <rect x={-60 + i * 72} y={-300} width={22} height={2400} fill="#4a505a" />
                <rect x={-60 + i * 72} y={-300} width={7} height={2400} fill="#8a92a0" />
              </g>
            ))}
            <rect x={-300} y={ctx.floorY - 820} width={1680} height={34} fill="#3a3f48" />
          </g>
        ),
      };
    }
    case "lockers":
      return {
        body: (
          <g>
            {Array.from({ length: 9 }).map((_, i) => (
              <g key={i}>
                <rect x={-40 + i * 132} y={ctx.floorY - 760} width={124} height={760} fill={c ?? "#3a6a9a"} />
                <rect x={-30 + i * 132} y={ctx.floorY - 740} width={104} height={14} fill={shade(c ?? "#3a6a9a", -0.25)} />
                <rect x={-30 + i * 132} y={ctx.floorY - 710} width={104} height={14} fill={shade(c ?? "#3a6a9a", -0.25)} />
                <rect x={60 + i * 132} y={ctx.floorY - 420} width={10} height={60} fill="#cfd4da" />
              </g>
            ))}
          </g>
        ),
      };
    case "monitors":
      return {
        body: (
          <g transform={`translate(${x} ${ctx.floorY - 700}) scale(${s})`}>
            {Array.from({ length: 6 }).map((_, i) => (
              <g key={i}>
                <rect x={-330 + (i % 3) * 220} y={-200 + Math.floor(i / 3) * 170} width={210} height={160} rx={8} fill="#111418" />
                <rect x={-320 + (i % 3) * 220} y={-190 + Math.floor(i / 3) * 170} width={190} height={140} fill="#2e4a3a" opacity={0.7 + 0.3 * Math.sin(t * 7 + i)} />
              </g>
            ))}
          </g>
        ),
        glow: <ellipse cx={x} cy={ctx.floorY - 640} rx={480 * s} ry={360 * s} fill="url(#screenGlow)" opacity={0.7} />,
      };
    case "vault":
      return {
        body: (
          <g transform={`translate(${x} ${ctx.floorY - 420}) scale(${s})`}>
            <circle cx={0} cy={0} r={380} fill="#5a6068" />
            <circle cx={0} cy={0} r={340} fill="#8a929c" />
            <circle cx={0} cy={0} r={300} fill="#a8b0ba" />
            {Array.from({ length: 12 }).map((_, i) => (
              <circle key={i} cx={Math.cos((i / 12) * Math.PI * 2) * 320} cy={Math.sin((i / 12) * Math.PI * 2) * 320} r={16} fill="#5a6068" />
            ))}
            <g transform={`rotate(${t * (it.v === "spin" ? 40 : 0)})`}>
              <circle cx={0} cy={0} r={70} fill="#5a6068" />
              {[0, 60, 120].map((a) => (
                <rect key={a} x={-190} y={-12} width={380} height={24} rx={12} fill="#4a5058" transform={`rotate(${a})`} />
              ))}
            </g>
          </g>
        ),
      };
    case "cashpile":
      return {
        body: T(
          <g>
            {Array.from({ length: 14 }).map((_, i) => (
              <rect key={i} x={-200 + (i % 5) * 80} y={-40 - Math.floor(i / 5) * 40} width={76} height={36} rx={4} fill="#5aa469" stroke="#2f6b3c" strokeWidth={4} />
            ))}
          </g>,
        ),
      };
    case "fridge":
      return {
        body: T(
          <g>
            <rect x={-120} y={-640} width={240} height={640} rx={20} fill="#e8eaee" />
            <line x1={-120} y1={-430} x2={120} y2={-430} stroke="#b8bcc4" strokeWidth={6} />
            <rect x={80} y={-600} width={14} height={120} rx={6} fill="#9aa0aa" />
            <rect x={80} y={-380} width={14} height={160} rx={6} fill="#9aa0aa" />
          </g>,
        ),
      };
    case "counter":
      return {
        body: (
          <g>
            <rect x={-300} y={fy - 330} width={1680} height={330} fill={c ?? "#8a6a4a"} />
            <rect x={-300} y={fy - 350} width={1680} height={30} fill="#d8d2c4" />
            {Array.from({ length: 10 }).map((_, i) => (
              <g key={i}>
                <rect x={-280 + i * 170} y={fy - 300} width={150} height={270} rx={6} fill={shade(c ?? "#8a6a4a", 0.06)} />
                <rect x={-220 + i * 170} y={fy - 200} width={30} height={10} rx={4} fill="#d8d2c4" />
              </g>
            ))}
            {Array.from({ length: 10 }).map((_, i) => (
              <rect key={`u${i}`} x={-280 + i * 170} y={fy - 900} width={150} height={240} rx={6} fill={shade(c ?? "#8a6a4a", 0.06)} />
            ))}
          </g>
        ),
      };
    case "stairs":
      return {
        body: T(
          <g>
            {Array.from({ length: 9 }).map((_, i) => (
              <g key={i}>
                <rect x={-200 + i * 50} y={-60 - i * 60} width={420} height={60} fill={shade(c ?? "#6a4a2a", i % 2 ? 0 : -0.06)} />
                <rect x={-200 + i * 50} y={-60 - i * 60} width={420} height={12} fill={shade(c ?? "#6a4a2a", 0.15)} />
              </g>
            ))}
            <path d="M-200 -120 L250 -660" stroke="#3a2414" strokeWidth={16} />
            {Array.from({ length: 9 }).map((_, i) => (
              <line key={i} x1={-200 + i * 50} y1={-120 - i * 60} x2={-200 + i * 50} y2={-30 - i * 60} stroke="#3a2414" strokeWidth={8} />
            ))}
          </g>,
        ),
      };
    case "mirror": {
      const y = ctx.floorY - 700;
      return {
        body: (
          <g transform={`translate(${x} ${y}) scale(${s})`}>
            <rect x={-170} y={-230} width={340} height={460} rx={16} fill="#3a2a1a" />
            <rect x={-150} y={-210} width={300} height={420} rx={10} fill="#9fb3c4" />
            <path d="M-120 -210 L-40 -210 L-150 -60 L-150 -150Z" fill="#fff" opacity={0.25} />
            {ctx.win === "ghost" && (
              <g opacity={0.9}>
                <ellipse cx={0} cy={-20} rx={80} ry={100} fill="#dfe4e6" />
                <path d="M-110 -60 C-120 -160 120 -160 110 -60 L130 200 L-130 200Z" fill="#111" />
                <ellipse cx={0} cy={-20} rx={66} ry={90} fill="#dfe4e6" />
                <ellipse cx={-26} cy={-30} rx={16} ry={20} fill="#050505" />
                <ellipse cx={26} cy={-30} rx={16} ry={20} fill="#050505" />
              </g>
            )}
          </g>
        ),
      };
    }
    case "sink":
      return {
        body: T(
          <g>
            <rect x={-150} y={-320} width={300} height={40} rx={18} fill="#e8eaee" />
            <rect x={-40} y={-280} width={80} height={280} fill="#d8dce2" />
            <path d="M0 -320 L0 -380 L50 -380" stroke="#b8bcc4" strokeWidth={14} fill="none" />
          </g>,
        ),
      };
    case "tent":
      return {
        body: T(
          <g>
            <path d="M-260 0 L0 -330 L260 0Z" fill={c ?? "#d9752a"} />
            <path d="M0 -330 L260 0 L0 0Z" fill="#000" opacity={0.15} />
            <path d="M-50 0 L0 -200 L50 0Z" fill="#1a1208" />
          </g>,
        ),
      };
    case "van":
    case "bus": {
      const col = c ?? (it.t === "bus" ? "#e0b030" : "#e8e8e8");
      const w = it.t === "bus" ? 520 : 340;
      return {
        body: T(
          <g>
            <rect x={-w} y={-330} width={w * 2} height={270} rx={30} fill={col} />
            {Array.from({ length: it.t === "bus" ? 6 : 2 }).map((_, i) => (
              <rect key={i} x={-w + 40 + i * 150} y={-300} width={120} height={100} rx={8} fill="#2a3550" />
            ))}
            {[-w + 120, w - 120].map((wx) => (
              <circle key={wx} cx={wx} cy={-60} r={56} fill="#141418" />
            ))}
          </g>,
        ),
      };
    }
    case "police": {
      const on = Math.sin(t * 12) > 0;
      return {
        body: T(
          <g>
            <path d="M-260 -60 L-250 -150 L-150 -160 L-90 -250 L120 -250 L190 -160 L260 -140 L265 -60Z" fill="#f1f1f1" />
            <rect x={-250} y={-130} width={510} height={40} fill="#2a4aa0" />
            <rect x={-40} y={-275} width={40} height={24} fill="#ff2a2a" />
            <rect x={0} y={-275} width={40} height={24} fill="#2a6aff" />
            {[-160, 160].map((wx) => (
              <circle key={wx} cx={wx} cy={-50} r={52} fill="#141418" />
            ))}
          </g>,
        ),
        glow: (
          <g>
            <circle cx={x - 20 * s} cy={fy - 260 * s} r={340} fill={on ? "#ff2a2a" : "#2a6aff"} opacity={0.18} />
          </g>
        ),
      };
    }
    case "searchlight": {
      const a = Math.sin(t * 0.8 + it.x * 5) * 30;
      return {
        body: T(
          <g>
            <rect x={-30} y={-900} width={60} height={900} fill="#2a2e36" />
            <rect x={-90} y={-960} width={180} height={70} fill="#2a2e36" />
          </g>,
        ),
        glow: (
          <g transform={`translate(${x} ${fy - 930 * s}) rotate(${a + 180})`}>
            <path d="M-20 0 L-260 -1400 L260 -1400 L20 0Z" fill="#fff6d0" opacity={0.1} />
          </g>
        ),
      };
    }
    case "wall":
      return {
        body: (
          <g>
            <rect x={-300} y={fy - (it.s ?? 1) * 520} width={1680} height={(it.s ?? 1) * 520} fill={c ?? "#8a8e96"} />
            {Array.from({ length: 14 }).map((_, i) => (
              <line key={i} x1={-300 + i * 130} y1={fy - (it.s ?? 1) * 520} x2={-300 + i * 130} y2={fy} stroke={shade(c ?? "#8a8e96", -0.2)} strokeWidth={5} />
            ))}
            <path d={`M-300 ${fy - (it.s ?? 1) * 520 - 20} ${Array.from({ length: 40 })
              .map((_, i) => `L${-300 + i * 44} ${fy - (it.s ?? 1) * 520 - 20 - (i % 2) * 26}`)
              .join(" ")}`} stroke="#555" strokeWidth={5} fill="none" />
          </g>
        ),
      };
    case "statue": {
      // giant wooden owl for the playground game; v = look (facing you) | turn (turning) | default (back turned)
      const turn = it.v === "turn" ? Math.sin(t * 1.4) : it.v === "look" ? 1 : -1;
      const facing = turn > 0;
      const sq = Math.abs(turn) * 0.35 + 0.65;
      const wood = "#a9875a";
      const dark = "#6e5232";
      const feathers = (cx: number, cy: number, rows: number, cols: number, col: string) =>
        Array.from({ length: rows * cols }).map((_, k) => {
          const r = Math.floor(k / cols);
          const cc = k % cols;
          const fx2 = cx + (cc - (cols - 1) / 2) * 70 + (r % 2) * 35;
          const fy2 = cy + r * 60;
          return <path key={k} d={`M${fx2 - 35} ${fy2} Q${fx2} ${fy2 + 55} ${fx2 + 35} ${fy2}`} stroke={col} strokeWidth={8} fill="none" />;
        });
      return {
        body: T(
          <g>
            <rect x={-260} y={-120} width={520} height={120} rx={10} fill="#7a7f88" />
            <rect x={-240} y={-140} width={480} height={30} fill="#9aa0a8" />
            {/* talons */}
            {[-110, 110].map((tx) => (
              <g key={tx}>
                {[-30, 0, 30].map((dx) => (
                  <path key={dx} d={`M${tx + dx} -160 l-6 50 l12 0Z`} fill="#3a2e22" />
                ))}
              </g>
            ))}
            {/* body */}
            <path d="M-300 -150 C-340 -500 -260 -820 0 -840 C260 -820 340 -500 300 -150Z" fill={wood} />
            <path d="M-300 -150 C-340 -500 -260 -820 0 -840 C260 -820 340 -500 300 -150Z" fill="url(#wallShade)" opacity={0.6} />
            {/* wings */}
            <path d="M-300 -700 C-420 -560 -400 -300 -300 -170 C-280 -350 -260 -560 -300 -700Z" fill={dark} />
            <path d="M300 -700 C420 -560 400 -300 300 -170 C280 -350 260 -560 300 -700Z" fill={dark} />
            {facing ? (
              <g>
                <path d="M-200 -170 C-220 -420 -180 -620 0 -640 C180 -620 220 -420 200 -170Z" fill="#e8d6b2" />
                {feathers(0, -580, 7, 4, "#c9b088")}
              </g>
            ) : (
              <g>{feathers(0, -760, 10, 6, dark)}</g>
            )}
            {/* head */}
            <g transform={`translate(0 -1000) scale(${sq} 1)`}>
              <path d="M-280 -60 C-300 -260 -160 -340 0 -340 C160 -340 300 -260 280 -60 C260 120 140 180 0 180 C-140 180 -260 120 -280 -60Z" fill={wood} />
              <path d="M-230 -230 L-280 -420 L-120 -300Z M230 -230 L280 -420 L120 -300Z" fill={dark} />
              {facing ? (
                <g>
                  <path d="M0 -40 C-60 -240 -260 -220 -240 -40 C-230 100 -80 130 0 60 C80 130 230 100 240 -40 C260 -220 60 -240 0 -40Z" fill="#efe0c0" />
                  {[-115, 115].map((ex) => (
                    <g key={ex}>
                      <circle cx={ex} cy={-50} r={92} fill="#2a1e12" />
                      <circle cx={ex} cy={-50} r={80} fill="#f2c230" />
                      <circle cx={ex} cy={-50} r={46} fill={it.v === "look" ? "#c0141c" : "#111"} />
                      <circle cx={ex + 18} cy={-70} r={14} fill="#fff" />
                    </g>
                  ))}
                  <path d="M-34 20 L0 110 L34 20 Q0 0 -34 20Z" fill="#e09a30" stroke="#8a5a10" strokeWidth={6} />
                </g>
              ) : (
                <g>{feathers(0, -260, 6, 5, dark)}</g>
              )}
            </g>
          </g>,
        ),
        glow: it.v === "look" ? (
          <g>
            <circle cx={x - 115 * s * sq} cy={fy - 1050 * s} r={170 * s} fill="url(#redPool)" />
            <circle cx={x + 115 * s * sq} cy={fy - 1050 * s} r={170 * s} fill="url(#redPool)" />
          </g>
        ) : undefined,
      };
    }
    case "rocket": {
      const shake = it.v === "launch" ? Math.sin(t * 50) * 3 : 0;
      const lift = it.v === "launch" ? Math.pow(Math.max(0, t - 1), 2) * 60 : 0;
      return {
        body: T(
          <g transform={`translate(${shake} ${-lift})`}>
            <rect x={-260} y={-1400} width={60} height={1400} fill="#5a5e66" />
            {Array.from({ length: 14 }).map((_, k) => (
              <line key={k} x1={-260} y1={-k * 100} x2={-200} y2={-k * 100 - 100} stroke="#3a3e46" strokeWidth={8} />
            ))}
            <path d="M-110 0 L-110 -1100 Q0 -1500 110 -1100 L110 0Z" fill="#eef0f2" />
            <path d="M40 0 L40 -1180 Q80 -1150 110 -1100 L110 0Z" fill="#000" opacity={0.1} />
            <path d="M-110 -1100 Q0 -1500 110 -1100Z" fill="#d62828" />
            <circle cx={0} cy={-900} r={46} fill="#2a3a5a" stroke="#9aa0a8" strokeWidth={10} />
            <path d="M-110 -260 L-230 0 L-110 0Z M110 -260 L230 0 L110 0Z" fill="#d62828" />
            <text x={0} y={-500} textAnchor="middle" fontSize={70} fontFamily="Montserrat" fontWeight={900} fill="#1a2a4a" transform="rotate(-90 0 -500)">HALCYON</text>
          </g>,
        ),
        glow: it.v === "launch" ? <ellipse cx={x} cy={fy + 40 - lift * s} rx={500} ry={220} fill="url(#warmPool)" /> : undefined,
      };
    }
    case "line":
      return { body: <rect x={-300} y={fy + (it.y ?? 0)} width={1680} height={16} fill={c ?? "#e8e0c8"} opacity={0.9} /> };
    case "tv": {
      const on = it.v !== "off";
      return {
        body: T(
          <g>
            <rect x={-150} y={-420} width={300} height={210} rx={14} fill="#1a1a1e" />
            <rect x={-136} y={-406} width={272} height={182} fill={on ? "#7a8ab0" : "#1d2026"} />
            {on && Array.from({ length: 30 }).map((_, i) => <rect key={i} x={-136 + rnd(i + Math.floor(t * 20)) * 260} y={-406 + rnd(i * 3 + Math.floor(t * 20)) * 170} width={12} height={4} fill="#fff" opacity={0.5} />)}
            <rect x={-100} y={-210} width={200} height={210} fill="#5a3a22" />
          </g>,
        ),
        glow: on ? <ellipse cx={x} cy={fy - 320 * s} rx={360 * s} ry={300 * s} fill="url(#screenGlow)" /> : undefined,
      };
    }
    case "lights": {
      // string of coloured lights along the wall (they can blink a message)
      const cols = ["#ff4d4d", "#ffd84d", "#4dff88", "#4db8ff", "#ff7ad9"];
      const bulbs = Array.from({ length: 16 }).map((_, i) => {
        const lx = 40 + i * 64;
        const ly = (it.y !== undefined && it.y < 0 ? ctx.floorY + it.y : ctx.floorY - 980) + Math.sin(i * 0.8) * 18;
        const on = it.v === "blink" ? Math.sin(t * 6 + i * 2.1) > 0.2 : it.v === "off" ? false : true;
        return { lx, ly, on, col: cols[i % 5] };
      });
      return {
        body: (
          <g>
            <path d={`M0 ${bulbs[0].ly} ${bulbs.map((b) => `L${b.lx} ${b.ly - 14}`).join(" ")}`} stroke="#1a2a1a" strokeWidth={4} fill="none" />
            {bulbs.map((b, i) => (
              <ellipse key={i} cx={b.lx} cy={b.ly} rx={11} ry={16} fill={b.on ? b.col : shade(b.col, -0.6)} />
            ))}
          </g>
        ),
        glow: (
          <g>
            {bulbs.map((b, i) => (b.on ? <circle key={i} cx={b.lx} cy={b.ly} r={56} fill={b.col} opacity={0.22} /> : null))}
          </g>
        ),
      };
    }
    default:
      return { body: null };
  }
}

export function seedOf(s: string) {
  return hash(s) * 1000;
}
