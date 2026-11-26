import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import "@fontsource/montserrat/800.css";
import "@fontsource/montserrat/900.css";
import "@fontsource/inter/600.css";
import type { Cast, Char, Creature, SceneDef, TimedShot, ToonProps, Word } from "./types";
import { Person, charX } from "./Person";
import { CREATURE_HEAD, CreatureGlow, CreatureView } from "./Creatures";
import { Far, RoomShell, Sky, buildItem, type Ctx, type Item } from "./Kit";
import { PropView } from "./Props";
import { Defs } from "./Defs";
import { back, clamp, ease, easeOut, hash, rnd, wob } from "./util";

const VO_OFFSET = 3;
const END_CARD = 45;

// ---------------------------------------------------------------- scene description helpers

interface Scene {
  kind: "room" | "outside" | "void";
  floorY: number;
  cs: number; // character scale (adult ~ cs*1000 px tall)
  light: string;
  weather?: string;
  sky?: string;
  moon?: number;
  far?: string;
  ground?: string;
  groundColor?: string;
  wall?: string;
  wallType?: string;
  floor?: string;
  floorType?: string;
  beams?: boolean;
  items: Item[];
  amb?: string;
}

function sceneOf(def: SceneDef | undefined): Scene {
  const d = (def ?? { kind: "void" }) as Record<string, unknown>;
  const kind = (d.kind as Scene["kind"]) ?? "void";
  return {
    kind,
    floorY: (d.floorY as number) ?? (kind === "room" ? 1400 : 1450),
    cs: (d.cs as number) ?? 0.62,
    light: (d.light as string) ?? (kind === "room" ? "warm" : "cold"),
    weather: d.weather as string | undefined,
    sky: (d.sky as string) ?? "night",
    moon: d.moon as number | undefined,
    far: d.far as string | undefined,
    ground: (d.ground as string) ?? "snow",
    groundColor: d.groundColor as string | undefined,
    wall: (d.wall as string) ?? "#6b4a2f",
    wallType: (d.wallType as string) ?? "plaster",
    floor: (d.floor as string) ?? "#5a3a22",
    floorType: (d.floorType as string) ?? "wood",
    beams: d.beams as boolean | undefined,
    items: (d.items as Item[]) ?? [],
  };
}

// ---------------------------------------------------------------- camera

interface CamState {
  s: number;
  dx: number;
  dy: number;
  rot: number;
}

function camera(shot: TimedShot, f: number): CamState {
  const k = interpolate(f, [0, Math.max(1, shot.dur)], [0, 1], clamp);
  const e = ease(k);
  const t = f / 30;
  const seed = hash(shot.scene + shot.from);
  const breathe = { dx: wob(t * 0.4, seed) * 6, dy: wob(t * 0.35, seed + 1) * 5 };
  let c: CamState = { s: 1.05 + e * 0.04, dx: breathe.dx, dy: breathe.dy, rot: 0 };
  switch (shot.cam) {
    case "still":
      c = { s: 1.03, dx: breathe.dx * 0.4, dy: breathe.dy * 0.4, rot: 0 };
      break;
    case "push":
      c.s = 1.0 + e * 0.14;
      break;
    case "creep":
      c.s = 1.0 + e * 0.07;
      break;
    case "pull":
      c.s = 1.16 - e * 0.14;
      break;
    case "zoom":
      c.s = 1.0 + Math.pow(k, 1.6) * 0.45;
      break;
    case "punch": {
      const p = interpolate(f, [0, 7], [0, 1], { ...clamp, easing: easeOut });
      c.s = 1.04 + p * 0.2 + e * 0.03;
      break;
    }
    case "shake":
      c.s = 1.1;
      c.dx += Math.sin(f * 2.7) * 14 * (1 - k * 0.5);
      c.dy += Math.cos(f * 3.3) * 10 * (1 - k * 0.5);
      c.rot = Math.sin(f * 1.9) * 0.8;
      break;
    case "up":
      c.s = 1.18;
      c.dy = 260 - e * 520;
      break;
    case "down":
      c.s = 1.18;
      c.dy = -260 + e * 520;
      break;
    case "left":
      c.s = 1.16;
      c.dx = 150 - e * 300;
      break;
    case "right":
      c.s = 1.16;
      c.dx = -150 + e * 300;
      break;
    case "drift":
    default:
      c.dx += Math.sin(k * Math.PI) * 20;
      break;
  }
  if ((shot.fx ?? []).includes("shake")) {
    c.dx += Math.sin(f * 2.9) * 12;
    c.dy += Math.cos(f * 3.7) * 9;
  }
  return c;
}

const Layer: React.FC<{ cam: CamState; depth: number; ox: number; oy: number; children: React.ReactNode }> = ({ cam, depth, ox, oy, children }) => {
  const s = 1 + (cam.s - 1) * (0.35 + 0.65 * depth);
  const m = 0.25 + 0.75 * depth;
  return <g transform={`translate(${cam.dx * m} ${cam.dy * m}) translate(${ox} ${oy}) rotate(${cam.rot}) scale(${s}) translate(${-ox} ${-oy})`}>{children}</g>;
};

// ---------------------------------------------------------------- actors

function mouthAt(shot: TimedShot, f: number): number {
  if (!shot.mouth) return 0;
  const i = f - VO_OFFSET;
  if (i < 0 || i >= shot.mouth.length) return 0;
  return Number(shot.mouth[i]) / 9;
}

const ActorLayer: React.FC<{ shot: TimedShot; scene: Scene; cast: Record<string, Cast>; f: number; rim?: string; glowOnly?: boolean }> = ({ shot, scene, cast, f, rim, glowOnly }) => {
  const t = f / 30;
  const k = interpolate(f, [0, shot.dur], [0, 1], clamp);
  const items: { y: number; node: React.ReactNode }[] = [];
  for (const [ci, c] of (shot.chars ?? []).entries()) {
    const cm = cast[c.id] ?? { name: c.id, top: "#555" };
    const x = charX(c, k) * 1080;
    const y = scene.floorY + (c.y ?? 0);
    const sc = scene.cs * (c.size ?? 1) * (1 + (c.y ?? 0) / 1600);
    const open = shot.who === c.id ? mouthAt(shot, f) : 0;
    const fade = c.fade === "in" ? interpolate(f, [0, 14], [0, 1], clamp) : c.fade === "out" ? interpolate(f, [shot.dur - 20, shot.dur - 4], [1, 0], clamp) : 1;
    const flip = c.flip ?? (c.to !== undefined && c.to < c.x);
    if (glowOnly) continue;
    items.push({
      y,
      node: (
        <g key={`${c.id}-${ci}`} transform={`translate(${x} ${y}) scale(${flip ? -sc : sc} ${sc})`} opacity={fade} style={c.dim ? { filter: "brightness(0.06)" } : undefined}>
          <Person cast={cm} spec={c} t={t} progress={k} open={open} item={c.item} rim={c.dim ? undefined : rim} />
        </g>
      ),
    });
  }
  const cr = shot.creature;
  if (cr) {
    const x = (cr.to !== undefined ? cr.x + (cr.to - cr.x) * ease(k) : cr.x) * 1080;
    const y = scene.floorY + (cr.y ?? 0);
    const sc = scene.cs * (cr.size ?? 1) * (1 + (cr.y ?? 0) / 1600);
    const flip = cr.flip ? -1 : 1;
    items.push({
      y,
      node: (
        <g key="creature" transform={`translate(${x} ${y}) scale(${flip * sc} ${sc})`} style={cr.dim ? { filter: "brightness(0.05)" } : undefined}>
          {glowOnly ? <CreatureGlow c={cr} t={t} /> : <CreatureView c={cr} t={t} />}
        </g>
      ),
    });
  }
  items.sort((a, b) => a.y - b.y);
  return <g>{items.map((i) => i.node)}</g>;
};

// ---------------------------------------------------------------- stage (scene + actors + light)

const Stage: React.FC<{ shot: TimedShot; scene: Scene; cast: Record<string, Cast>; f: number; story: ToonProps["story"] }> = ({ shot, scene, cast, f, story }) => {
  const t = f / 30;
  const fx = shot.fx ?? [];
  const seed = hash(shot.scene) * 1000;
  const flickerOn = fx.includes("flicker") ? (rnd(Math.floor(f / 3) + seed) > 0.35 ? 1 : 0) : fx.includes("blackout") ? 0 : 1;
  const night = scene.kind === "room" ? true : scene.sky !== "day";
  const snow = scene.ground === "snow" || scene.weather === "snow";
  const ctx: Ctx = { t, night, snow, floorY: scene.floorY, win: shot.win, seed, flicker: flickerOn };
  const cam = camera(shot, f);
  // zoom towards whoever is speaking
  const sp = (shot.chars ?? []).find((c) => c.id === shot.who) ?? (shot.chars ?? [])[0];
  const ox = sp ? charX(sp, interpolate(f, [0, shot.dur], [0, 1], clamp)) * 1080 : shot.creature ? shot.creature.x * 1080 : 540;
  const oy = sp ? scene.floorY - scene.cs * 830 * (sp.size ?? 1) : shot.creature ? scene.floorY - 700 : 960;

  const built = scene.items.map((it) => ({ it, b: buildItem(it, ctx) }));
  const bgItems = built.filter((x) => !x.it.fg);
  const fgItems = built.filter((x) => x.it.fg);

  const light = fx.includes("dark") || fx.includes("blackout") ? "dark" : fx.includes("red") ? "red" : scene.light;
  const tint: Record<string, [string, number]> = {
    warm: ["#3b2a52", 0.32],
    cold: ["#0b1a44", 0.42],
    moon: ["#14244f", 0.36],
    dark: ["#060814", flickerOn ? 0.66 : 0.85],
    red: ["#4a0408", 0.55],
    day: ["#000000", 0],
    dusk: ["#3a1a40", 0.25],
  };
  const [tc, ta] = tint[light] ?? tint.cold;
  const rim = light === "warm" ? "#ffb766" : light === "day" ? undefined : light === "red" ? "#ff4a4a" : "#a8bcff";

  const groundCol = scene.groundColor ?? (scene.ground === "snow" ? (night ? "#8c9ac2" : "#eef3fb") : scene.ground === "grass" ? (night ? "#1e3a2a" : "#5a8a4a") : scene.ground === "road" || scene.ground === "asphalt" ? "#2a2d33" : scene.ground === "sand" ? "#c9b48a" : "#4a3a2a");

  return (
    <g>
      {/* far layers */}
      {scene.kind === "outside" && (
        <>
          <Layer cam={cam} depth={0.05} ox={ox} oy={oy}>
            <Sky kind={fx.includes("lightning") && Math.floor(f / 2) % 9 === 0 ? "day" : scene.sky ?? "night"} t={t} moon={scene.moon} seed={seed} />
          </Layer>
          {scene.far && (
            <Layer cam={cam} depth={0.2} ox={ox} oy={oy}>
              <Far kind={scene.far} y={scene.floorY - 260} seed={seed} snow={snow} night={night} />
            </Layer>
          )}
          <Layer cam={cam} depth={0.7} ox={ox} oy={oy}>
            {scene.ground !== "none" && <rect x={-300} y={scene.floorY - 40} width={1680} height={1300} fill={groundCol} />}
            {scene.ground === "snow" && <rect x={-300} y={scene.floorY - 40} width={1680} height={60} fill="#fff" opacity={night ? 0.12 : 0.5} />}
            {(scene.ground === "road" || scene.ground === "asphalt") && (
              <g>
                {Array.from({ length: 8 }).map((_, i) => (
                  <rect key={i} x={-200 + i * 220 - ((t * (shot.fx?.includes("drive") ? 600 : 0)) % 220)} y={scene.floorY + 180} width={120} height={16} fill="#e8e0b0" opacity={0.8} />
                ))}
              </g>
            )}
          </Layer>
        </>
      )}
      {scene.kind === "room" && (
        <Layer cam={cam} depth={0.6} ox={ox} oy={oy}>
          <RoomShell wall={scene.wall!} wallType={scene.wallType!} floor={scene.floor!} floorType={scene.floorType!} floorY={scene.floorY} beams={scene.beams} seed={seed} />
        </Layer>
      )}
      {scene.kind === "void" && <rect x={-300} y={-300} width={1680} height={2520} fill="#08090d" />}
      <Layer cam={cam} depth={0.85} ox={ox} oy={oy}>
        {bgItems.map((x, i) => (
          <g key={i}>{x.b.body}</g>
        ))}
      </Layer>
      {/* snow behind actors */}
      {(scene.weather === "snow" || fx.includes("snow")) && <Snow f={f} seed={1} n={70} size={0.7} speed={0.6} />}
      <Layer cam={cam} depth={1} ox={ox} oy={oy}>
        <ActorLayer shot={shot} scene={scene} cast={cast} f={f} rim={rim} />
      </Layer>
      <Layer cam={cam} depth={1.3} ox={ox} oy={oy}>
        {fgItems.map((x, i) => (
          <g key={i}>{x.b.body}</g>
        ))}
      </Layer>
      {/* light & colour grade */}
      <rect x={0} y={0} width={1080} height={1920} fill={tc} opacity={ta} style={{ mixBlendMode: "multiply" }} />
      {light !== "day" && <rect x={0} y={0} width={1080} height={1920} fill={tc} opacity={ta * 0.35} />}
      <Layer cam={cam} depth={0.85} ox={ox} oy={oy}>
        {built.map((x, i) => (x.b.lit ? <g key={i}>{x.b.lit}</g> : null))}
      </Layer>
      <g style={{ mixBlendMode: "screen" }}>
        <Layer cam={cam} depth={0.85} ox={ox} oy={oy}>
          {built.map((x, i) => (x.b.glow && flickerOn ? <g key={i}>{x.b.glow}</g> : x.b.glow && /stove|fireplace|candles|campfire|tree/.test(x.it.t) ? <g key={i}>{x.b.glow}</g> : null))}
        </Layer>
        <Layer cam={cam} depth={1} ox={ox} oy={oy}>
          <ActorLayer shot={shot} scene={scene} cast={cast} f={f} glowOnly />
        </Layer>
      </g>
      {(scene.weather === "snow" || fx.includes("snow")) && <Snow f={f} seed={2} n={45} size={1.4} speed={1} />}
      {(scene.weather === "rain" || fx.includes("rain")) && <Rain f={f} />}
      {(scene.weather === "fog" || fx.includes("fog")) && <Fog f={f} />}
      {(scene.weather === "dust" || fx.includes("dust")) && <Dust f={f} />}
      {fx.includes("embers") && <Embers f={f} />}
      {(scene.weather === "money" || fx.includes("money")) && <Money f={f} />}
      {fx.includes("lightning") && Math.floor(f / 2) % 9 === 0 && <rect width={1080} height={1920} fill="#dfe8ff" opacity={0.6} />}
      {fx.includes("torch") && <TorchMask f={f} />}
      {fx.includes("cctv") && <Cctv f={f} label={story.title} />}
    </g>
  );
};

// ---------------------------------------------------------------- particles

const Snow: React.FC<{ f: number; seed: number; n: number; size: number; speed: number }> = ({ f, seed, n, size, speed }) => (
  <g>
    {Array.from({ length: n }).map((_, i) => {
      const r = (2 + rnd(seed * 100 + i) * 5) * size;
      const sp = (40 + rnd(seed * 50 + i * 3) * 50) * speed;
      const x = (rnd(seed + i * 7) * 1180 + Math.sin(f / 30 + i) * 30 + (f * sp * 0.15) / 30) % 1180 - 50;
      const y = ((rnd(seed + i * 11) * 2000 + (f * sp) / 30 * 2.2) % 2000) - 40;
      return <circle key={i} cx={x} cy={y} r={r} fill="#fff" opacity={0.55 + rnd(i) * 0.4} />;
    })}
  </g>
);

const Rain: React.FC<{ f: number }> = ({ f }) => (
  <g stroke="#b8c8ff" strokeWidth={3} opacity={0.45}>
    {Array.from({ length: 90 }).map((_, i) => {
      const x = (rnd(i * 3) * 1300 + f * 6) % 1300 - 110;
      const y = (rnd(i * 7) * 2100 + f * 70) % 2100 - 90;
      return <line key={i} x1={x} y1={y} x2={x - 14} y2={y + 70} />;
    })}
  </g>
);

const Fog: React.FC<{ f: number }> = ({ f }) => (
  <g>
    {Array.from({ length: 6 }).map((_, i) => (
      <ellipse key={i} cx={((i * 260 + f * (0.6 + i * 0.2)) % 1700) - 300} cy={1250 + (i % 3) * 160} rx={520} ry={130} fill="#c9d4ea" opacity={0.08} />
    ))}
  </g>
);

const Dust: React.FC<{ f: number }> = ({ f }) => (
  <g>
    {Array.from({ length: 40 }).map((_, i) => {
      const x = (rnd(i) * 1080 + Math.sin(f / 50 + i) * 40) % 1080;
      const y = (rnd(i * 3) * 1920 - f * 0.4 * (0.5 + rnd(i * 5))) % 1920;
      return <circle key={i} cx={x} cy={y < 0 ? y + 1920 : y} r={1.5 + rnd(i * 9) * 2.5} fill="#ffe8c0" opacity={0.25 + 0.25 * Math.sin(f / 20 + i)} />;
    })}
  </g>
);

const Money: React.FC<{ f: number }> = ({ f }) => (
  <g>
    {Array.from({ length: 34 }).map((_, i) => {
      const x = (rnd(i) * 1180 + Math.sin(f / 18 + i) * 60) % 1180 - 50;
      const y = ((rnd(i * 3) * 2100 + f * (5 + rnd(i * 5) * 4)) % 2100) - 90;
      const r = Math.sin(f / 10 + i) * 40;
      return (
        <g key={i} transform={`translate(${x} ${y}) rotate(${r}) scale(${0.7 + rnd(i * 7) * 0.6} ${Math.cos(f / 8 + i)})`}>
          <rect x={-44} y={-22} width={88} height={44} rx={4} fill="#7fb07a" stroke="#3a6a3a" strokeWidth={3} />
          <circle cx={0} cy={0} r={11} fill="none" stroke="#3a6a3a" strokeWidth={3} />
        </g>
      );
    })}
  </g>
);

const Embers: React.FC<{ f: number }> = ({ f }) => (
  <g>
    {Array.from({ length: 30 }).map((_, i) => {
      const x = (rnd(i) * 1080 + Math.sin(f / 15 + i) * 30) % 1080;
      const y = 1920 - ((rnd(i * 3) * 1920 + f * 4 * (0.5 + rnd(i * 5))) % 1920);
      return <circle key={i} cx={x} cy={y} r={2 + rnd(i * 9) * 3} fill="#ffb03a" opacity={0.7} />;
    })}
  </g>
);

const TorchMask: React.FC<{ f: number }> = ({ f }) => {
  const x = 540 + Math.sin(f / 22) * 160;
  const y = 1100 + Math.cos(f / 30) * 120;
  return (
    <g>
      <defs>
        <radialGradient id="torchHole" cx={x / 1080} cy={y / 1920} r="0.32">
          <stop offset="0" stopColor="#000" stopOpacity={0} />
          <stop offset="0.55" stopColor="#000" stopOpacity={0.35} />
          <stop offset="1" stopColor="#000" stopOpacity={0.96} />
        </radialGradient>
      </defs>
      <rect width={1080} height={1920} fill="url(#torchHole)" />
    </g>
  );
};

const Cctv: React.FC<{ f: number; label: string }> = ({ f }) => (
  <g>
    <rect width={1080} height={1920} fill="#3a6a4a" opacity={0.25} style={{ mixBlendMode: "color" }} />
    {Array.from({ length: 96 }).map((_, i) => (
      <rect key={i} x={0} y={i * 20} width={1080} height={3} fill="#000" opacity={0.18} />
    ))}
    <circle cx={90} cy={150} r={16} fill="#ff2a2a" opacity={Math.floor(f / 15) % 2 ? 1 : 0.2} />
    <text x={120} y={164} fontSize={40} fill="#fff" fontFamily="'Courier New', monospace" fontWeight={700}>
      REC  CAM 03
    </text>
  </g>
);

// ---------------------------------------------------------------- close-ups

function headInfo(cm: Cast): { inner: number; headK: number } {
  const age = cm.age ?? "adult";
  const bodyK = age === "kid" ? 0.66 : age === "teen" ? 0.88 : 1;
  const headK = age === "kid" ? 1.16 : age === "teen" ? 1.05 : 1;
  return { inner: (cm.height ?? 1) * bodyK, headK };
}

const CloseUp: React.FC<{ shot: TimedShot; scene: Scene; cast: Record<string, Cast>; f: number; story: ToonProps["story"] }> = ({ shot, scene, cast, f, story }) => {
  const t = f / 30;
  const ids = shot.close ?? [];
  const k = interpolate(f, [0, shot.dur], [0, 1], clamp);
  const push = 1 + ease(k) * (shot.cam === "zoom" ? 0.25 : shot.cam === "pull" ? -0.08 : 0.07);
  const shake = shot.cam === "shake" || (shot.fx ?? []).includes("shake") ? Math.sin(f * 2.7) * 10 : 0;
  // background: the same scene, softly out of focus
  const bgShot: TimedShot = { ...shot, chars: [], creature: undefined, cam: "still" };
  const n = ids.length;
  return (
    <g>
      <g transform="translate(540 960) scale(1.35) translate(-540 -960)" style={{ filter: "blur(7px)" }}>
        <Stage shot={bgShot} scene={scene} cast={cast} f={f} story={story} />
      </g>
      <rect width={1080} height={1920} fill="#000" opacity={0.25} />
      <g transform={`translate(${540 + shake} 960) scale(${push}) translate(-540 -960)`}>
        {ids.map((id, i) => {
          const cx = n === 1 ? 540 : n === 2 ? (i === 0 ? 300 : 780) : 200 + i * 340;
          const headW = n === 1 ? 600 : n === 2 ? 430 : 300;
          const headY = n === 1 ? 900 : 960;
          if (id === "creature" || id === "monster") {
            const cr: Creature = shot.creature ?? { type: "horned", x: 0.5 };
            const sc = (headW / 320) * (cr.type === "horned" ? 0.82 : 1);
            const hy = CREATURE_HEAD[cr.type] ?? -1100;
            return (
              <g key={id} transform={`translate(${cx} ${headY - hy * sc + 60}) scale(${sc})`}>
                <CreatureView c={{ ...cr, x: 0 }} t={t} />
                <CreatureGlow c={{ ...cr, x: 0 }} t={t} />
              </g>
            );
          }
          const cm = cast[id] ?? { name: id, top: "#555" };
          const spec: Char = (shot.chars ?? []).find((c) => c.id === id) ?? { id, x: 0.5 };
          const { inner, headK } = headInfo(cm);
          const sc = headW / (300 * headK * inner);
          const feetY = headY + 830 * inner * sc;
          const open = shot.who === id ? mouthAt(shot, f) : 0;
          const flip = n === 2 ? (i === 0 ? false : true) : spec.flip ?? false;
          return (
            <g key={id} transform={`translate(${cx} ${feetY}) scale(${flip ? -sc : sc} ${sc})`}>
              <Person cast={cm} spec={{ ...spec, pose: spec.pose === "walk" || spec.pose === "run" ? "idle" : spec.pose, to: undefined, look: spec.look ?? (n === 2 ? "right" : spec.look) }} t={t} progress={0} open={open} item={spec.item} rim={scene.light === "warm" ? "#ffb766" : "#a8bcff"} />
            </g>
          );
        })}
      </g>
      <rect width={1080} height={1920} fill="url(#vignette)" />
    </g>
  );
};

// ---------------------------------------------------------------- overlays

const Captions: React.FC<{ words: Word[]; f: number; accent: string }> = ({ words, f, accent }) => {
  // group into short pages (max 3 words / ~18 chars, break after punctuation)
  const pages: Word[][] = [];
  let cur: Word[] = [];
  for (const w of words) {
    cur.push(w);
    const len = cur.reduce((a, b) => a + b.text.length + 1, 0);
    if (cur.length >= 3 || len > 17 || /[.,!?;:…]$/.test(w.text)) {
      pages.push(cur);
      cur = [];
    }
  }
  if (cur.length) pages.push(cur);
  const vf = f - VO_OFFSET;
  const idx = pages.findIndex((p, i) => vf >= p[0].start - 1 && (i === pages.length - 1 || vf < pages[i + 1][0].start - 1));
  if (idx < 0) return null;
  const page = pages[idx];
  const last = page[page.length - 1];
  if (vf > last.end + 16 && idx === pages.length - 1) return null;
  const pf = vf - (page[0].start - 1);
  const pop = interpolate(pf, [0, 5], [0.82, 1], { ...clamp, easing: back });
  return (
    <div style={{ position: "absolute", left: 50, right: 50, top: 1400, display: "flex", justifyContent: "center", transform: `scale(${pop})` }}>
      <div style={{ textAlign: "center", fontFamily: "Montserrat", fontWeight: 900, fontSize: 82, lineHeight: 1.08, color: "#fff", textTransform: "uppercase", WebkitTextStroke: "14px #000", paintOrder: "stroke", letterSpacing: 1, textShadow: "0 8px 18px rgba(0,0,0,0.55)" }}>
        {page.map((w, i) => (
          <span key={i} style={{ color: w.hl === 2 ? "#ff3b3b" : w.hl === 1 ? accent : "#fff" }}>
            {w.text.replace(/[*\[\]]/g, "")}
            {i < page.length - 1 ? " " : ""}
          </span>
        ))}
      </div>
    </div>
  );
};

const Tag: React.FC<{ text: string; f: number }> = ({ text, f }) => {
  const k = interpolate(f, [2, 12], [0, 1], { ...clamp, easing: easeOut });
  return (
    <div style={{ position: "absolute", top: 230, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: k, transform: `translateY(${(1 - k) * -30}px)` }}>
      <div style={{ fontFamily: "Montserrat", fontWeight: 900, fontSize: 50, letterSpacing: 8, color: "#fff", padding: "14px 34px", background: "rgba(0,0,0,0.55)", borderRadius: 14, textTransform: "uppercase" }}>{text}</div>
    </div>
  );
};

const Rule: React.FC<{ text: string; f: number }> = ({ text, f }) => {
  const k = interpolate(f, [0, 8], [2.2, 1], { ...clamp, easing: easeOut });
  return (
    <div style={{ position: "absolute", top: 380, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
      <div style={{ transform: `rotate(-5deg) scale(${k})`, fontFamily: "Montserrat", fontWeight: 900, fontSize: 64, color: "#fff", background: "#d62828", padding: "10px 32px", borderRadius: 10, boxShadow: "0 10px 30px rgba(0,0,0,0.5)", textTransform: "uppercase" }}>{text}</div>
    </div>
  );
};

const Mark: React.FC<{ kind: "cross" | "check"; f: number }> = ({ kind, f }) => {
  const a = interpolate(f, [2, 10], [0, 1], { ...clamp, easing: easeOut });
  const b = interpolate(f, [8, 16], [0, 1], { ...clamp, easing: easeOut });
  const col = kind === "cross" ? "#ff2a2a" : "#2fd35a";
  return (
    <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
      <g stroke={col} strokeWidth={70} strokeLinecap="round" style={{ filter: "drop-shadow(0 10px 20px rgba(0,0,0,.5))" }}>
        {kind === "cross" ? (
          <>
            <line x1={300} y1={700} x2={300 + 480 * a} y2={700 + 480 * a} />
            <line x1={780} y1={700} x2={780 - 480 * b} y2={700 + 480 * b} />
          </>
        ) : (
          <path d="M300 950 L470 1120 L800 740" fill="none" strokeDasharray={900} strokeDashoffset={900 * (1 - a)} />
        )}
      </g>
    </svg>
  );
};

const Card: React.FC<{ card: NonNullable<TimedShot["card"]>; f: number; children: React.ReactNode }> = ({ card, f, children }) => {
  const k = interpolate(f, [0, 10], [0, 1], { ...clamp, easing: easeOut });
  const lvl = card.level ?? 5;
  const fill = interpolate(f, [8, 30], [0, lvl / 5], clamp);
  const segs = 20;
  return (
    <AbsoluteFill style={{ background: "#0b0c10" }}>
      <div style={{ position: "absolute", top: 210, left: 0, right: 0, textAlign: "center", fontFamily: "Montserrat", fontWeight: 900, fontSize: 112, color: "#eceae4", letterSpacing: 4, opacity: k }}>{card.title.toUpperCase()}</div>
      {card.sub && <div style={{ position: "absolute", top: 350, left: 0, right: 0, textAlign: "center", fontFamily: "Montserrat", fontWeight: 800, fontSize: 32, color: "#ff4a3a", letterSpacing: 3, textTransform: "uppercase" }}>[ {card.sub} ]</div>}
      <div style={{ position: "absolute", top: 420, left: 0, right: 0, textAlign: "center", fontFamily: "Montserrat", fontWeight: 800, fontSize: 26, color: "#bbb", letterSpacing: 6 }}>{card.label ?? "THREAT LEVEL"}</div>
      <div style={{ position: "absolute", top: 465, left: 200, width: 680, height: 44, display: "flex", gap: 4, padding: 5, border: "4px solid #444", borderRadius: 6 }}>
        {Array.from({ length: segs }).map((_, i) => {
          const on = i / segs < fill;
          const col = i < segs * 0.4 ? "#3ad15a" : i < segs * 0.7 ? "#ffd23a" : "#ff3a3a";
          return <div key={i} style={{ flex: 1, background: on ? col : "#222", borderRadius: 2 }} />;
        })}
      </div>
      <div style={{ position: "absolute", top: 520, left: 0, right: 0, textAlign: "center", fontFamily: "Montserrat", fontWeight: 900, fontSize: 30, color: lvl >= 4 ? "#ff3a3a" : "#ffd23a", letterSpacing: 6 }}>{["", "LOW", "MODERATE", "HIGH", "SEVERE", "EXTREME"][lvl]}</div>
      <div style={{ position: "absolute", top: 600, left: 120, width: 840, height: 840, border: "10px solid #d8d2c4", overflow: "hidden", transform: `scale(${0.9 + 0.1 * k})` }}>
        <svg viewBox="40 260 1000 1000" width={840} height={840}>
          {children}
        </svg>
      </div>
    </AbsoluteFill>
  );
};

const PartPill: React.FC<{ part: number; total: number; f: number }> = ({ part, total, f }) => {
  const k = interpolate(f, [0, 8, 75, 90], [0, 1, 1, 0], clamp);
  return (
    <div style={{ position: "absolute", top: 120, left: 60, opacity: k, fontFamily: "Montserrat", fontWeight: 900, fontSize: 40, color: "#fff", background: "#d62828", padding: "8px 24px", borderRadius: 12, letterSpacing: 2 }}>
      PART {part}
      <span style={{ opacity: 0.7, fontSize: 30 }}> / {total}</span>
    </div>
  );
};

const EndCard: React.FC<{ part: number; total: number; f: number }> = ({ part, total, f }) => {
  const k = interpolate(f, [0, 10], [0, 1], { ...clamp, easing: back });
  const last = part >= total;
  return (
    <AbsoluteFill style={{ background: `rgba(0,0,0,${0.55 * Math.min(1, f / 8)})`, alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 18 }}>
      <div style={{ transform: `scale(${k})`, fontFamily: "Montserrat", fontWeight: 900, fontSize: last ? 120 : 150, color: "#fff", WebkitTextStroke: "14px #000", paintOrder: "stroke" }}>{last ? "THE END" : `PART ${part + 1}`}</div>
      <div style={{ opacity: interpolate(f, [8, 16], [0, 1], clamp), fontFamily: "Montserrat", fontWeight: 900, fontSize: 56, color: "#ffb020", WebkitTextStroke: "9px #000", paintOrder: "stroke" }}>{last ? "FOLLOW FOR THE NEXT STORY" : "FOLLOW SO YOU DON'T MISS IT"}</div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- shot

const ShotView: React.FC<{ shot: TimedShot; props: ToonProps; isLast: boolean }> = ({ shot, props, isLast }) => {
  const f = useCurrentFrame();
  const scene = sceneOf(props.story.scenes[shot.scene]);
  const cast = props.story.cast;
  const accent = props.story.accent ?? "#ffb020";
  const inner = shot.prop ? (
    <g>
      <Stage shot={{ ...shot, chars: [], creature: undefined }} scene={scene} cast={cast} f={f} story={props.story} />
      <rect width={1080} height={1920} fill="#000" opacity={0.45} />
      <PropView p={shot.prop} f={f} dur={shot.dur} t={f / 30} />
    </g>
  ) : shot.close && shot.close.length ? (
    <CloseUp shot={shot} scene={scene} cast={cast} f={f} story={props.story} />
  ) : (
    <Stage shot={shot} scene={scene} cast={cast} f={f} story={props.story} />
  );
  const tIn = shot.t;
  const whip = tIn === "whip" ? interpolate(f, [0, 8], [500, 0], { ...clamp, easing: easeOut }) : 0;
  const endStart = shot.dur - END_CARD;
  return (
    <AbsoluteFill>
      {shot.card ? (
        <Card card={shot.card} f={f}>
          <Defs />
          {inner}
        </Card>
      ) : (
        <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute", inset: 0, transform: `translateX(${whip}px)`, filter: whip > 20 ? `blur(${whip / 40}px)` : undefined }}>
          <Defs />
          {inner}
          <rect width={1080} height={1920} fill="url(#vignette)" />
        </svg>
      )}
      {shot.tag && <Tag text={shot.tag} f={f} />}
      {shot.rule && <Rule text={shot.rule} f={f} />}
      {shot.cross && <Mark kind="cross" f={f} />}
      {shot.check && <Mark kind="check" f={f} />}
      {shot.words && <Captions words={shot.words} f={f} accent={accent} />}
      {tIn === "flash" && <AbsoluteFill style={{ background: "#fff", opacity: interpolate(f, [0, 9], [0.9, 0], clamp) }} />}
      {tIn === "glitch" && <AbsoluteFill style={{ background: "#fff", opacity: interpolate(f, [0, 3, 4, 6], [0.8, 0, 0.5, 0], clamp) }} />}
      {tIn === "black" && <AbsoluteFill style={{ background: "#000", opacity: interpolate(f, [0, 12], [1, 0], clamp) }} />}
      {isLast && f >= endStart && <EndCard part={props.part} total={props.totalParts} f={f - endStart} />}
    </AbsoluteFill>
  );
};

export const ToonEpisode: React.FC<ToonProps> = (props) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {props.shots.map((s, i) => (
        <Sequence key={i} from={s.from} durationInFrames={s.dur}>
          <ShotView shot={s} props={props} isLast={i === props.shots.length - 1} />
          {s.audio && (
            <Sequence from={VO_OFFSET}>
              <Audio src={staticFile(s.audio)} volume={1} />
            </Sequence>
          )}
          {s.sfxFile && <Audio src={staticFile(s.sfxFile)} volume={0.55} />}
          {s.amb && <Audio src={staticFile(s.amb)} volume={0.22} loop />}
        </Sequence>
      ))}
      <PartPill part={props.part} total={props.totalParts} f={frame} />
    </AbsoluteFill>
  );
};

export const toonDemo: ToonProps = {
  story: { id: "demo", title: "Demo", cast: {}, scenes: {} },
  part: 1,
  totalParts: 10,
  durationInFrames: 60,
  shots: [{ from: 0, dur: 60, scene: "x" }],
};
