import React from "react";
import { rnd, shade, mix } from "./util";
import type { Item } from "./Kit";

// Set dressing and ambient life: ground detail, distant haze and clouds, dust motes in rooms,
// automatic wall / floor decoration that fills the gaps between a scene's own items.

// ---------------------------------------------------------------- outside: ground

export const Ground: React.FC<{ kind: string; color?: string; y: number; night: boolean; seed: number; t: number; drive?: boolean; items: Item[]; lite?: boolean }> = ({ kind, color, y, night, seed, t, drive, lite }) => {
  if (kind === "none") return null;
  const base =
    color ??
    (kind === "snow" ? (night ? "#8c9ac2" : "#eef3fb") : kind === "grass" ? (night ? "#1e3a2a" : "#5a8a4a") : kind === "road" || kind === "asphalt" ? "#2a2d33" : kind === "sand" ? "#c9b48a" : kind === "plain" ? (night ? "#2a2e3a" : "#9aa0aa") : "#4a3a2a");
  const id = `gr${Math.round(seed)}${kind}`;
  const far = mix(base, night ? "#3a4670" : "#dfe8f4", 0.35);
  const near = shade(base, -0.28);
  const out: React.ReactNode[] = [];
  const persp = (k: number) => y + Math.pow(k, 1.7) * (1980 - y);
  if (lite) {
    // blurred background: the gradient is enough
  } else if (kind === "snow") {
    for (let i = 0; i < 14; i++) {
      const k = rnd(seed + i * 3.1);
      const yy = persp(0.05 + k * 0.9);
      const w = 120 + k * 420;
      out.push(<ellipse key={`d${i}`} cx={rnd(seed + i * 7.7) * 1500 - 210} cy={yy} rx={w} ry={w * 0.08} fill="#fff" opacity={night ? 0.1 : 0.45} />);
      out.push(<ellipse key={`s${i}`} cx={rnd(seed + i * 7.7) * 1500 - 210 + w * 0.2} cy={yy + w * 0.06} rx={w * 0.7} ry={w * 0.03} fill="#000" opacity={0.06} />);
    }
    for (let i = 0; i < 40; i++) {
      const tw = Math.max(0, Math.sin(t * (2 + rnd(i) * 3) + i * 1.7));
      out.push(<circle key={`sp${i}`} cx={rnd(seed + i * 1.3) * 1080} cy={persp(0.1 + rnd(seed + i * 2.3) * 0.85)} r={2 + rnd(i * 3) * 2} fill="#fff" opacity={tw * (night ? 0.55 : 0.8)} />);
    }
    for (let i = 0; i < 10; i++) {
      const gx = rnd(seed + i * 5.1) * 1080;
      const gy = persp(0.15 + rnd(seed + i * 9.3) * 0.7);
      out.push(<path key={`g${i}`} d={`M${gx} ${gy} l-6 -26 M${gx + 8} ${gy} l4 -32 M${gx + 16} ${gy} l10 -22`} stroke={night ? "#2a3550" : "#7a8a6a"} strokeWidth={4} strokeLinecap="round" opacity={0.6} />);
    }
  } else if (kind === "grass") {
    for (let i = 0; i < 9; i++) {
      const k = rnd(seed + i * 4.3);
      out.push(<ellipse key={`p${i}`} cx={rnd(seed + i * 6.1) * 1400 - 160} cy={persp(0.08 + k * 0.85)} rx={160 + k * 300} ry={18 + k * 40} fill={shade(base, rnd(i) > 0.5 ? 0.08 : -0.12)} opacity={0.7} />);
    }
    for (let i = 0; i < 70; i++) {
      const k = rnd(seed + i * 2.7);
      const gy = persp(0.04 + k * 0.94);
      const gx = rnd(seed + i * 3.9) * 1180 - 50;
      const h = 14 + k * 46;
      const sway = Math.sin(t * 1.6 + gx * 0.01) * h * 0.18;
      const col = shade(base, 0.12 + rnd(i) * 0.15);
      out.push(<path key={`t${i}`} d={`M${gx - h * 0.3} ${gy} Q${gx - h * 0.25} ${gy - h * 0.5} ${gx - h * 0.35 + sway} ${gy - h} M${gx} ${gy} Q${gx} ${gy - h * 0.6} ${gx + sway} ${gy - h * 1.2} M${gx + h * 0.3} ${gy} Q${gx + h * 0.3} ${gy - h * 0.5} ${gx + h * 0.4 + sway} ${gy - h * 0.9}`} stroke={col} strokeWidth={3 + k * 4} strokeLinecap="round" fill="none" />);
    }
    if (!night)
      for (let i = 0; i < 14; i++) {
        const gy = persp(0.2 + rnd(seed + i * 8.1) * 0.75);
        out.push(<circle key={`f${i}`} cx={rnd(seed + i * 4.4) * 1080} cy={gy - 8} r={5 + rnd(i) * 4} fill={["#fff3b0", "#ffb0c8", "#ffffff", "#b0d0ff"][i % 4]} />);
      }
    for (let i = 0; i < 6; i++) {
      const gy = persp(0.2 + rnd(seed + i * 12.1) * 0.7);
      const r = 14 + rnd(i * 5) * 26;
      out.push(<ellipse key={`r${i}`} cx={rnd(seed + i * 13.3) * 1080} cy={gy} rx={r * 1.4} ry={r * 0.8} fill={night ? "#2a3038" : "#8a8a80"} />);
    }
  } else if (kind === "road" || kind === "asphalt") {
    // kerb + pavement on the far side, lane markings, cracks, puddles that catch the lights
    out.push(<rect key="pv" x={-300} y={y - 40} width={1680} height={70} fill={night ? "#3a3d44" : "#8a8c90"} />);
    out.push(<rect key="kb" x={-300} y={y + 28} width={1680} height={14} fill={night ? "#4a4e56" : "#b0b2b6"} />);
    for (let i = 0; i < 18; i++) out.push(<line key={`pj${i}`} x1={-300 + i * 100} y1={y - 40} x2={-300 + i * 100} y2={y + 28} stroke="#000" strokeOpacity={0.18} strokeWidth={3} />);
    for (let i = 0; i < 8; i++) {
      const dx = (t * (drive ? 600 : 0)) % 220;
      out.push(<rect key={`ln${i}`} x={-200 + i * 220 - dx} y={y + 180} width={120} height={16} fill="#e8e0b0" opacity={0.8} />);
    }
    for (let i = 0; i < 6; i++) {
      const cx = rnd(seed + i * 3.3) * 1080;
      const cy = persp(0.25 + rnd(seed + i * 5.5) * 0.65);
      out.push(<path key={`ck${i}`} d={`M${cx} ${cy} l30 8 l22 -10 l40 14`} stroke="#000" strokeOpacity={0.35} strokeWidth={3} fill="none" />);
    }
    for (let i = 0; i < 3; i++) {
      const cx = rnd(seed + i * 9.1) * 1000 + 40;
      const cy = persp(0.35 + rnd(seed + i * 4.7) * 0.5);
      out.push(
        <g key={`pd${i}`}>
          <ellipse cx={cx} cy={cy} rx={110} ry={18} fill={night ? "#3a4a70" : "#9ab0c8"} opacity={0.35} />
          <ellipse cx={cx - 20} cy={cy - 3} rx={40} ry={4} fill="#fff" opacity={night ? 0.25 + 0.1 * Math.sin(t * 2 + i) : 0.4} />
        </g>,
      );
    }
  } else if (kind === "sand") {
    for (let i = 0; i < 14; i++) {
      const yy = persp(0.05 + i / 14);
      out.push(<path key={`rp${i}`} d={`M-300 ${yy} q120 -10 240 0 t240 0 t240 0 t240 0 t240 0 t240 0 t240 0`} stroke={shade(base, -0.1)} strokeWidth={3} fill="none" opacity={0.6} />);
    }
  } else {
    for (let i = 0; i < 30; i++) {
      const k = rnd(seed + i * 2.2);
      out.push(<ellipse key={`pb${i}`} cx={rnd(seed + i * 6.6) * 1080} cy={persp(0.05 + k * 0.9)} rx={4 + k * 12} ry={3 + k * 6} fill={shade(base, rnd(i) > 0.5 ? 0.15 : -0.2)} />);
    }
  }
  return (
    <g>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={far} />
          <stop offset="0.25" stopColor={base} />
          <stop offset="1" stopColor={near} />
        </linearGradient>
      </defs>
      <rect x={-300} y={y - 40} width={1680} height={1300} fill={`url(#${id})`} />
      {out}
      {/* soft haze where the ground meets the background */}
      <rect x={-300} y={y - 90} width={1680} height={110} fill={night ? "#2a3560" : "#dfe8f4"} opacity={0.16} />
    </g>
  );
};

// ---------------------------------------------------------------- outside: distant haze layer + clouds

export const FarHaze: React.FC<{ kind: string; y: number; seed: number; night: boolean; sky: string; t: number }> = ({ kind, y, seed, night, sky, t }) => {
  const col = sky === "day" ? "#b8c8dc" : sky === "dusk" || sky === "dawn" ? "#7a5a7a" : sky === "red" ? "#3a0a10" : sky === "space" ? "#000" : "#202a4a";
  const pts: string[] = [];
  const n = 12;
  for (let i = 0; i <= n; i++) {
    const x = -300 + (i * 1680) / n;
    const h = kind === "alps" || kind === "mountains" ? 380 + rnd(seed + i * 3.7) * 380 : kind === "city" ? 0 : 120 + rnd(seed + i * 2.1) * 160;
    pts.push(`L${x} ${y - h}`);
  }
  const city = kind === "city" || kind === "ruins";
  return (
    <g>
      <Clouds sky={sky} seed={seed} t={t} />
      {sky !== "space" && !city && <path d={`M-300 ${y + 60} ${pts.join(" ")} L1380 ${y + 60}Z`} fill={col} opacity={0.55} />}
      {city && (
        <g opacity={0.5}>
          {Array.from({ length: 30 }).map((_, i) => {
            const w = 40 + rnd(seed + i * 1.9) * 60;
            const x = -300 + i * 58;
            const h = 160 + rnd(seed + i * 5.3) * 380;
            return (
              <g key={i}>
                <rect x={x} y={y - h} width={w} height={h + 60} fill={col} />
                {night && rnd(seed + i) > 0.6 && <circle cx={x + w / 2} cy={y - h - 8} r={4} fill="#ff4a4a" opacity={0.5 + 0.5 * Math.sin(t * 3 + i)} />}
              </g>
            );
          })}
        </g>
      )}
      {sky !== "space" && <rect x={-300} y={y - 160} width={1680} height={260} fill={col} opacity={0.25} />}
    </g>
  );
};

export const Clouds: React.FC<{ sky: string; seed: number; t: number }> = ({ sky, seed, t }) => {
  if (sky === "space") return null;
  const col = sky === "day" ? "#ffffff" : sky === "dusk" || sky === "dawn" ? "#f0a8a0" : sky === "storm" ? "#1a2030" : sky === "red" ? "#5a1018" : "#3a4672";
  const edge = sky === "day" ? "#ffffff" : sky === "storm" ? "#2a3248" : "#8a9ac8";
  const op = sky === "day" ? 0.85 : sky === "storm" ? 0.9 : 0.5;
  return (
    <g>
      {Array.from({ length: 6 }).map((_, i) => {
        const w = 260 + rnd(seed + i * 3.3) * 320;
        const cy = 120 + rnd(seed + i * 7.1) * 520;
        const cx = ((rnd(seed + i * 2.2) * 1900 + t * (6 + i * 2)) % 1900) - 400;
        return (
          <g key={i} transform={`translate(${cx} ${cy})`} opacity={op}>
            <ellipse cx={0} cy={0} rx={w * 0.5} ry={w * 0.12} fill={col} />
            <ellipse cx={-w * 0.18} cy={-w * 0.07} rx={w * 0.22} ry={w * 0.13} fill={col} />
            <ellipse cx={w * 0.12} cy={-w * 0.1} rx={w * 0.26} ry={w * 0.16} fill={col} />
            <ellipse cx={w * 0.1} cy={-w * 0.18} rx={w * 0.2} ry={w * 0.06} fill={edge} opacity={0.35} />
          </g>
        );
      })}
    </g>
  );
};

// ---------------------------------------------------------------- outside: life (shooting stars, fireflies, birds)

export const OutsideLife: React.FC<{ f: number; seed: number; sky: string; ground: string; night: boolean }> = ({ f, seed, sky, ground, night }) => {
  const out: React.ReactNode[] = [];
  if (night && (sky === "night" || sky === "snow")) {
    const cyc = (f + Math.round(seed * 37)) % 260;
    if (cyc < 18) {
      const k = cyc / 18;
      const sx = 200 + rnd(Math.floor((f + seed * 37) / 260)) * 600;
      out.push(<line key="ss" x1={sx + k * 260} y1={120 + k * 90} x2={sx + k * 260 - 90} y2={120 + k * 90 - 30} stroke="#fff" strokeWidth={4} strokeLinecap="round" opacity={1 - k} />);
    }
  }
  if (night && ground === "grass") {
    for (let i = 0; i < 14; i++) {
      const x = rnd(seed + i * 4.1) * 1080 + Math.sin(f / 40 + i) * 40;
      const y = 1250 + rnd(seed + i * 2.9) * 500 + Math.cos(f / 33 + i * 2) * 30;
      const on = 0.5 + 0.5 * Math.sin(f / 9 + i * 1.7);
      out.push(<circle key={`ff${i}`} cx={x} cy={y} r={4} fill="#d8ff7a" opacity={on * 0.8} />);
      out.push(<circle key={`fg${i}`} cx={x} cy={y} r={14} fill="#d8ff7a" opacity={on * 0.15} />);
    }
  }
  if (sky === "day" || sky === "dusk") {
    for (let i = 0; i < 4; i++) {
      const x = ((f * (2 + i * 0.4) + rnd(seed + i) * 1200) % 1500) - 200;
      const y = 300 + rnd(seed + i * 3) * 300 + Math.sin(f / 20 + i) * 10;
      const w = Math.sin(f / 4 + i * 2) * 10;
      out.push(<path key={`b${i}`} d={`M${x - 18} ${y + w} Q${x - 8} ${y - 6} ${x} ${y} Q${x + 8} ${y - 6} ${x + 18} ${y + w}`} stroke="#2a2a35" strokeWidth={4} fill="none" strokeLinecap="round" />);
    }
  }
  return <g>{out}</g>;
};

// ---------------------------------------------------------------- rooms: dust motes, void background

export const Motes: React.FC<{ f: number; seed: number; light: string }> = ({ f, seed, light }) => {
  const col = light === "warm" ? "#ffe2b0" : light === "red" ? "#ff9a9a" : "#cfe0ff";
  const op = light === "dark" ? 0.18 : 0.32;
  return (
    <g>
      {Array.from({ length: 34 }).map((_, i) => {
        const x = (rnd(seed + i * 1.7) * 1180 + Math.sin(f / 70 + i) * 50 + f * 0.15) % 1180 - 50;
        const y = (((rnd(seed + i * 3.1) * 1900 - f * (0.2 + rnd(i) * 0.3)) % 1900) + 1900) % 1900;
        return <circle key={i} cx={x} cy={y} r={1.6 + rnd(i * 5) * 2.4} fill={col} opacity={op * (0.4 + 0.6 * Math.abs(Math.sin(f / 30 + i)))} />;
      })}
    </g>
  );
};

export const VoidBg: React.FC<{ f: number; seed: number }> = ({ f, seed }) => (
  <g>
    <defs>
      <radialGradient id="voidSpot" cx="0.5" cy="0.35" r="0.7">
        <stop offset="0" stopColor="#1c2030" />
        <stop offset="0.6" stopColor="#0b0c12" />
        <stop offset="1" stopColor="#050507" />
      </radialGradient>
    </defs>
    <rect x={-300} y={-300} width={1680} height={2520} fill="url(#voidSpot)" />
    {Array.from({ length: 5 }).map((_, i) => (
      <ellipse key={i} cx={((rnd(seed + i) * 1600 + f * (0.4 + i * 0.15)) % 1700) - 300} cy={500 + i * 280} rx={420} ry={90} fill="#3a4060" opacity={0.06} />
    ))}
  </g>
);

// ---------------------------------------------------------------- rooms: automatic decoration

// how much of the wall an item covers (half width in 0..1 units) and whether it is tall
const FOOT: Record<string, [number, "tall" | "low" | "wall" | "none"]> = {
  window: [0.19, "tall"], door: [0.17, "tall"], fireplace: [0.2, "tall"], stove: [0.18, "tall"], tree: [0.18, "tall"],
  bunk: [0.23, "tall"], lockers: [0.6, "tall"], monitors: [0.26, "tall"], mirror: [0.13, "tall"], books: [0.16, "tall"],
  board: [0.26, "tall"], bars: [0.6, "tall"], vault: [0.32, "tall"], printer: [0.2, "tall"], statue: [0.2, "tall"],
  fridge: [0.11, "tall"], stairs: [0.32, "tall"], tv: [0.15, "low"], cave: [0.45, "tall"], alphabet: [0.6, "tall"],
  wall: [0.6, "tall"], lamp: [0.09, "tall"], clock: [0.1, "wall"], picture: [0.11, "wall"], shelf: [0.15, "wall"],
  lights: [0.6, "none"], sofa: [0.3, "low"], armchair: [0.15, "low"], bed: [0.27, "low"], table: [0.22, "low"],
  desk: [0.23, "low"], chair: [0.08, "low"], counter: [0.3, "low"], sink: [0.11, "low"], candles: [0.06, "low"],
  cashpile: [0.15, "low"], crowd: [0.6, "none"], vent: [0.1, "wall"], button: [0.09, "low"], tiles: [0.6, "tall"],
  chairs: [0.6, "tall"], ice: [0.15, "tall"], bootsrow: [0.45, "tall"], boots: [0.15, "low"], rug: [0, "none"],
  sign: [0.12, "wall"], searchlight: [0.1, "tall"], tent: [0.3, "tall"], button2: [0.09, "low"],
};

type Style = "home" | "cabin" | "industrial" | "facility" | "tiled" | "old" | "grand" | "none";

function styleOf(wallType: string, name: string): Style {
  if (/maze|mirrorworld|void|space|pod|cell|doorstep|porch|bridge|chairs|pit/.test(name)) return "none";
  if (/bank|lobby|mint|museum|church|vip|hotel|airport/.test(name)) return "grand";
  if (/hospital|infirmary|medbay|lab|station|subway|hub|reactor|electrical|corridor|command|control/.test(name)) return "facility";
  if (/mine|tunnel|cave|pipes|cellar|crypt|dungeon/.test(name)) return "old";
  if (wallType === "wood") return "cabin";
  if (wallType === "brick") return "industrial";
  if (wallType === "concrete" || wallType === "plain") return "facility";
  if (wallType === "tile") return "tiled";
  if (wallType === "stone") return "old";
  return "home";
}

export const RoomDecor: React.FC<{ wall: string; wallType: string; floorY: number; items: Item[]; seed: number; t: number; light: string; name: string }> = ({ wall, wallType, floorY, items, seed, t, light, name }) => {
  const style = styleOf(wallType, name);
  if (style === "none") return null;
  const occ = (x: number, band: "upper" | "floor") =>
    items.some((it) => {
      const [hw, kind] = FOOT[it.t] ?? [0.12, "tall"];
      if (kind === "none") return false;
      const w = hw * (it.s ?? 1);
      if (band === "upper" && kind === "low") return false;
      if (band === "floor" && kind === "wall") return false;
      return Math.abs(it.x - x) < w + (band === "upper" ? 0.1 : 0.08);
    });
  const upper: number[] = [];
  const floor: number[] = [];
  const cands = Array.from({ length: 21 }, (_, i) => 0.06 + i * 0.044);
  const order = cands.map((x, i) => ({ x, r: rnd(seed + i * 4.7) })).sort((a, b) => a.r - b.r);
  for (const { x } of order) {
    if (upper.length < 3 && !occ(x, "upper") && upper.every((u) => Math.abs(u - x) > 0.24)) upper.push(x);
    if (floor.length < 2 && !occ(x, "floor") && floor.every((u) => Math.abs(u - x) > 0.3) && x > 0.08 && x < 0.92) floor.push(x);
  }
  const wy = floorY - 780;
  const ink = shade(wall, -0.45);
  const out: React.ReactNode[] = [];

  // things along the top of the wall
  if (style === "industrial" || style === "facility") {
    out.push(
      <g key="pipes">
        <rect x={-300} y={floorY - 1260} width={1680} height={34} fill={shade(wall, -0.3)} />
        <rect x={-300} y={floorY - 1254} width={1680} height={8} fill="#fff" opacity={0.08} />
        <rect x={-300} y={floorY - 1200} width={1680} height={18} fill={shade(wall, -0.38)} />
        {Array.from({ length: 9 }).map((_, i) => (
          <rect key={i} x={-260 + i * 200} y={floorY - 1268} width={22} height={50} rx={4} fill={shade(wall, -0.45)} />
        ))}
      </g>,
    );
    if (style === "facility")
      out.push(
        <g key="haz">
          {Array.from({ length: 34 }).map((_, i) => (
            <path key={i} d={`M${-300 + i * 50} ${floorY - 34} l25 0 l-25 -26 l-25 0Z`} fill="#d8a82a" opacity={0.18} />
          ))}
        </g>,
      );
  } else if (style === "home" || style === "cabin") {
    // crown moulding
    out.push(<rect key="crown" x={-300} y={floorY - 1330} width={1680} height={26} fill={shade(wall, -0.25)} />);
    out.push(<rect key="crown2" x={-300} y={floorY - 1304} width={1680} height={8} fill="#fff" opacity={0.08} />);
  }

  // wall pieces
  upper.forEach((ux, i) => {
    const x = ux * 1080;
    const pick = rnd(seed + i * 13.1);
    let node: React.ReactNode = null;
    if (style === "home" || style === "cabin") {
      if (pick < 0.4) {
        // framed pictures (one or a small group)
        const n = pick < 0.2 ? 1 : 2;
        node = (
          <g>
            {Array.from({ length: n }).map((_, k) => {
              const fw = 110 + rnd(seed + i + k) * 60;
              const fh = 130 + rnd(seed + i * 2 + k) * 50;
              const fx = x + (n === 1 ? 0 : k === 0 ? -80 : 80);
              const fyy = wy + (k ? 40 : -10);
              const art = ["#8aa0b8", "#c9a87a", "#7a9a7a", "#b87a6a", "#d8c8a0"][Math.floor(rnd(seed + i * 3 + k) * 5)];
              return (
                <g key={k}>
                  <rect x={fx - fw / 2 + 8} y={fyy - fh / 2 + 10} width={fw} height={fh} fill="#000" opacity={0.18} />
                  <rect x={fx - fw / 2} y={fyy - fh / 2} width={fw} height={fh} fill={k ? "#c9a23a" : "#3a2414"} />
                  <rect x={fx - fw / 2 + 12} y={fyy - fh / 2 + 12} width={fw - 24} height={fh - 24} fill={art} />
                  {rnd(seed + k * 9 + i) > 0.5 ? (
                    <g>
                      <circle cx={fx} cy={fyy - 8} r={fw * 0.16} fill={shade(art, -0.35)} />
                      <path d={`M${fx - fw * 0.3} ${fyy + fh / 2 - 12} Q${fx} ${fyy + 6} ${fx + fw * 0.3} ${fyy + fh / 2 - 12}Z`} fill={shade(art, -0.35)} />
                    </g>
                  ) : (
                    <path d={`M${fx - fw / 2 + 12} ${fyy + fh / 2 - 12} L${fx - 10} ${fyy - 4} L${fx + 14} ${fyy + 16} L${fx + 30} ${fyy} L${fx + fw / 2 - 12} ${fyy + 20} L${fx + fw / 2 - 12} ${fyy + fh / 2 - 12}Z`} fill={shade(art, -0.3)} />
                  )}
                </g>
              );
            })}
          </g>
        );
      } else if (pick < 0.7) {
        // shelf with books, a plant and a jar
        node = (
          <g>
            <rect x={x - 150} y={wy + 60} width={300} height={16} fill="#4a2c16" />
            <path d={`M${x - 130} ${wy + 76} l20 30 M${x + 130} ${wy + 76} l-20 30`} stroke="#3a2210" strokeWidth={8} />
            {[0, 1, 2, 3].map((b) => (
              <rect key={b} x={x - 140 + b * 26} y={wy + 60 - (62 + (b % 2) * 14)} width={22} height={62 + (b % 2) * 14} fill={["#7a2a2a", "#2a4a7a", "#c9a23a", "#3a6a4a"][b]} />
            ))}
            <rect x={x + 10} y={wy + 20} width={44} height={40} rx={8} fill="#b8643a" />
            <path d={`M${x + 32} ${wy + 20} q-30 -40 -10 -70 M${x + 32} ${wy + 20} q10 -50 34 -64 M${x + 32} ${wy + 20} q30 -20 46 -18`} stroke="#3a7a3a" strokeWidth={10} fill="none" strokeLinecap="round" />
            <rect x={x + 80} y={wy + 14} width={40} height={46} rx={6} fill="#cfe0e8" opacity={0.7} />
          </g>
        );
      } else if (pick < 0.85) {
        // wall sconce with a little light
        node = (
          <g>
            <rect x={x - 10} y={wy - 10} width={20} height={60} rx={6} fill="#3a3a3a" />
            <path d={`M${x - 46} ${wy - 10} L${x + 46} ${wy - 10} L${x + 30} ${wy - 80} L${x - 30} ${wy - 80}Z`} fill={light === "dark" ? "#6a5a4a" : "#ffe2a8"} />
            {light !== "dark" && <ellipse cx={x} cy={wy - 40} rx={160} ry={140} fill="url(#warmPool)" opacity={0.6} />}
          </g>
        );
      } else {
        // calendar / poster
        node = (
          <g transform={`rotate(${(rnd(seed + i) - 0.5) * 4} ${x} ${wy})`}>
            <rect x={x - 70} y={wy - 90} width={140} height={190} fill="#efe6d6" />
            <rect x={x - 70} y={wy - 90} width={140} height={40} fill="#b3262e" />
            {Array.from({ length: 12 }).map((_, k) => (
              <rect key={k} x={x - 58 + (k % 4) * 30} y={wy - 36 + Math.floor(k / 4) * 40} width={20} height={20} fill="#c8bca8" />
            ))}
          </g>
        );
      }
      if (style === "cabin" && pick > 0.92) {
        node = (
          <g>
            <ellipse cx={x} cy={wy} rx={60} ry={70} fill="#5a3a20" />
            <path d={`M${x - 20} ${wy - 40} C${x - 80} ${wy - 120} ${x - 120} ${wy - 90} ${x - 150} ${wy - 160} M${x - 70} ${wy - 100} l-30 -10 M${x + 20} ${wy - 40} C${x + 80} ${wy - 120} ${x + 120} ${wy - 90} ${x + 150} ${wy - 160} M${x + 70} ${wy - 100} l30 -10`} stroke="#e8dcc0" strokeWidth={12} fill="none" strokeLinecap="round" />
          </g>
        );
      }
    } else if (style === "industrial" || style === "facility") {
      if (pick < 0.35) {
        // vent grille
        node = (
          <g>
            <rect x={x - 90} y={wy - 60} width={180} height={120} rx={8} fill={shade(wall, -0.3)} />
            {Array.from({ length: 6 }).map((_, k) => (
              <rect key={k} x={x - 76} y={wy - 48 + k * 18} width={152} height={8} fill={shade(wall, -0.55)} />
            ))}
          </g>
        );
      } else if (pick < 0.6) {
        // sign plate
        const label = ["B-2", "C-4", "EXIT", "NO ENTRY", "AREA 3", "D-7"][Math.floor(rnd(seed + i * 5) * 6)];
        node = (
          <g>
            <rect x={x - 100} y={wy - 40} width={200} height={80} rx={8} fill={label === "EXIT" ? "#2a8a4a" : label === "NO ENTRY" ? "#b3262e" : "#e8e4d8"} />
            <text x={x} y={wy + 16} textAnchor="middle" fontSize={44} fontFamily="Montserrat" fontWeight={900} fill={label === "EXIT" || label === "NO ENTRY" ? "#fff" : "#2a2a2a"}>
              {label}
            </text>
          </g>
        );
      } else if (pick < 0.8) {
        // security camera with a blinking light
        node = (
          <g>
            <rect x={x - 8} y={wy - 160} width={16} height={60} fill="#2a2a30" />
            <g transform={`rotate(${18 + Math.sin(t * 0.6) * 14} ${x} ${wy - 100})`}>
              <rect x={x - 20} y={wy - 120} width={110} height={44} rx={8} fill="#d8dce0" />
              <rect x={x + 86} y={wy - 112} width={16} height={28} fill="#2a2a30" />
              <circle cx={x} cy={wy - 98} r={7} fill="#ff2a2a" opacity={Math.floor(t * 2) % 2 ? 1 : 0.15} />
            </g>
          </g>
        );
      } else {
        // fuse box / junction box with cables
        node = (
          <g>
            <rect x={x - 60} y={wy - 80} width={120} height={160} rx={6} fill={shade(wall, -0.2)} />
            <rect x={x - 50} y={wy - 70} width={100} height={140} fill="none" stroke={shade(wall, -0.45)} strokeWidth={4} />
            <path d={`M${x - 30} ${wy + 80} L${x - 30} ${floorY}`} stroke="#1a1a1e" strokeWidth={10} />
            <path d={`M${x + 20} ${wy + 80} L${x + 20} ${floorY}`} stroke="#2a2a30" strokeWidth={8} />
            <rect x={x - 20} y={wy - 30} width={40} height={20} fill="#d8a82a" />
          </g>
        );
      }
    } else if (style === "grand") {
      node =
        pick < 0.5 ? (
          <g>
            <rect x={x - 46} y={floorY - 1300} width={92} height={1260} fill={shade(wall, 0.08)} />
            <rect x={x - 46} y={floorY - 1300} width={18} height={1260} fill="#fff" opacity={0.08} />
            <rect x={x + 28} y={floorY - 1300} width={18} height={1260} fill="#000" opacity={0.12} />
            <rect x={x - 66} y={floorY - 1320} width={132} height={40} fill={shade(wall, -0.1)} />
            <rect x={x - 66} y={floorY - 80} width={132} height={40} fill={shade(wall, -0.1)} />
          </g>
        ) : (
          <g>
            <rect x={x - 120 + 10} y={wy - 170 + 12} width={240} height={300} fill="#000" opacity={0.2} />
            <rect x={x - 120} y={wy - 170} width={240} height={300} fill="#c9a23a" />
            <rect x={x - 104} y={wy - 154} width={208} height={268} fill="#3a2a22" />
            <ellipse cx={x} cy={wy - 60} rx={44} ry={56} fill="#c9a07a" />
            <path d={`M${x - 90} ${wy + 114} Q${x} ${wy - 20} ${x + 90} ${wy + 114}Z`} fill="#1a1a22" />
          </g>
        );
    } else if (style === "tiled") {
      node =
        pick < 0.5 ? (
          <g>
            <rect x={x - 90} y={wy - 120} width={180} height={150} fill="#c8a878" stroke="#6a4a2a" strokeWidth={8} />
            {[0, 1, 2].map((k) => (
              <rect key={k} x={x - 70 + k * 50} y={wy - 100 + (k % 2) * 30} width={40} height={50} fill={["#fff", "#ffe98a", "#bfe0ff"][k]} transform={`rotate(${(k - 1) * 5} ${x} ${wy})`} />
            ))}
          </g>
        ) : (
          <g>
            <circle cx={x} cy={wy - 60} r={62} fill="#f3efe4" stroke="#2a2a2a" strokeWidth={9} />
            <line x1={x} y1={wy - 60} x2={x} y2={wy - 104} stroke="#222" strokeWidth={7} />
            <line x1={x} y1={wy - 60} x2={x + 26} y2={wy - 60} stroke="#222" strokeWidth={7} transform={`rotate(${t * 6} ${x} ${wy - 60})`} />
          </g>
        );
    } else {
      // old stone: torch bracket or chains / cracks
      node =
        pick < 0.5 ? (
          <g>
            <rect x={x - 12} y={wy - 20} width={24} height={70} fill="#2a2420" />
            <path d={`M${x - 26} ${wy - 20} L${x + 26} ${wy - 20} L${x + 14} ${wy - 50} L${x - 14} ${wy - 50}Z`} fill="#3a3028" />
            <path d={`M${x} ${wy - 130 - Math.sin(t * 9) * 8} Q${x + 26} ${wy - 80} ${x} ${wy - 52} Q${x - 26} ${wy - 80} ${x} ${wy - 130 - Math.sin(t * 9) * 8}Z`} fill="#ffb03a" />
            <ellipse cx={x} cy={wy - 80} rx={190} ry={170} fill="url(#candleGlow)" opacity={0.7} />
          </g>
        ) : (
          <path d={`M${x - 40} ${wy - 120} l30 60 l-20 40 l40 60 l-10 50`} stroke={ink} strokeWidth={5} fill="none" opacity={0.6} />
        );
    }
    out.push(<g key={`u${i}`}>{node}</g>);
  });

  // floor pieces against the wall
  floor.forEach((fx0, i) => {
    const x = fx0 * 1080;
    const pick = rnd(seed + i * 21.7);
    const y = floorY - 6;
    let node: React.ReactNode = null;
    if (style === "home" || style === "cabin") {
      node =
        pick < 0.5 ? (
          <g>
            <ellipse cx={x} cy={y + 4} rx={70} ry={12} fill="#000" opacity={0.25} />
            <path d={`M${x - 46} ${y - 90} L${x + 46} ${y - 90} L${x + 34} ${y} L${x - 34} ${y}Z`} fill="#b8643a" />
            <rect x={x - 50} y={y - 100} width={100} height={18} rx={4} fill="#a0542e" />
            {[-1, -0.5, 0, 0.5, 1].map((k, j) => (
              <path key={j} d={`M${x} ${y - 96} Q${x + k * 60} ${y - 200 - j * 10} ${x + k * 110} ${y - 250 + Math.abs(k) * 70 + Math.sin(t * 1.2 + j) * 4}`} stroke={j % 2 ? "#3a7a3a" : "#2f6a32"} strokeWidth={16} fill="none" strokeLinecap="round" />
            ))}
          </g>
        ) : style === "cabin" ? (
          <g>
            <ellipse cx={x} cy={y + 4} rx={90} ry={12} fill="#000" opacity={0.25} />
            <path d={`M${x - 80} ${y} L${x - 70} ${y - 90} L${x + 70} ${y - 90} L${x + 80} ${y}Z`} fill="#8a6a3a" />
            {[0, 1, 2].map((k) => (
              <ellipse key={k} cx={x - 40 + k * 40} cy={y - 100 - (k % 2) * 16} rx={22} ry={22} fill="#7a4a2a" stroke="#c9a070" strokeWidth={6} />
            ))}
          </g>
        ) : (
          <g>
            <rect x={x - 130} y={y - 120} width={260} height={110} rx={8} fill="#e8e4dc" />
            {Array.from({ length: 9 }).map((_, k) => (
              <rect key={k} x={x - 120 + k * 28} y={y - 112} width={16} height={96} rx={6} fill="#cfcac0" />
            ))}
            <rect x={x - 130} y={y - 10} width={20} height={10} fill="#8a8a8a" />
            <rect x={x + 110} y={y - 10} width={20} height={10} fill="#8a8a8a" />
          </g>
        );
    } else if (style === "industrial" || style === "facility") {
      node =
        pick < 0.5 ? (
          <g>
            <ellipse cx={x} cy={y + 4} rx={110} ry={14} fill="#000" opacity={0.3} />
            <rect x={x - 100} y={y - 120} width={130} height={120} fill="#7a5a32" stroke="#4a3418" strokeWidth={8} />
            <path d={`M${x - 100} ${y - 120} L${x + 30} ${y} M${x + 30} ${y - 120} L${x - 100} ${y}`} stroke="#4a3418" strokeWidth={7} />
            <rect x={x + 20} y={y - 80} width={90} height={80} fill="#8a6a3a" stroke="#4a3418" strokeWidth={7} />
          </g>
        ) : (
          <g>
            <ellipse cx={x} cy={y + 4} rx={70} ry={12} fill="#000" opacity={0.3} />
            <rect x={x - 55} y={y - 170} width={110} height={170} rx={14} fill="#3a5a7a" />
            <rect x={x - 55} y={y - 140} width={110} height={12} fill="#2a3a4a" />
            <rect x={x - 55} y={y - 50} width={110} height={12} fill="#2a3a4a" />
          </g>
        );
    } else if (style === "grand") {
      node = (
        <g>
          {[-90, 90].map((dx) => (
            <g key={dx}>
              <ellipse cx={x + dx} cy={y + 2} rx={30} ry={8} fill="#000" opacity={0.3} />
              <rect x={x + dx - 6} y={y - 170} width={12} height={170} fill="#c9a23a" />
              <circle cx={x + dx} cy={y - 176} r={14} fill="#e0c060" />
              <rect x={x + dx - 24} y={y - 8} width={48} height={10} rx={4} fill="#a08030" />
            </g>
          ))}
          <path d={`M${x - 84} ${y - 160} Q${x} ${y - 100} ${x + 84} ${y - 160}`} stroke="#8a1a2a" strokeWidth={14} fill="none" />
        </g>
      );
    } else if (style === "tiled") {
      node = (
        <g>
          <ellipse cx={x} cy={y + 4} rx={50} ry={10} fill="#000" opacity={0.25} />
          <path d={`M${x - 40} ${y - 110} L${x + 40} ${y - 110} L${x + 32} ${y} L${x - 32} ${y}Z`} fill="#8a929c" />
          <rect x={x - 44} y={y - 118} width={88} height={12} rx={4} fill="#6a727c" />
        </g>
      );
    }
    if (node) out.push(<g key={`f${i}`}>{node}</g>);
  });

  // a power outlet or a light switch somewhere free
  const ox = upper.length ? upper[0] * 1080 + 140 : 900;
  if (style !== "old")
    out.push(
      <g key="outlet">
        <rect x={ox - 18} y={floorY - 150} width={36} height={52} rx={6} fill={shade(wall, 0.25)} />
        <circle cx={ox - 6} cy={floorY - 124} r={4} fill={ink} />
        <circle cx={ox + 6} cy={floorY - 124} r={4} fill={ink} />
      </g>,
    );
  return <g>{out}</g>;
};
