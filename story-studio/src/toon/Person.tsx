import React from "react";
import type { Cast, Char, Expr, Hair, Pose } from "./types";
import { clamp, hash, lerp, mix, shade, wob } from "./util";
import { interpolate } from "remotion";

// Flat 2D person, drawn front-on with a big expressive head (story-video look).
// Local space: origin between the feet, adult height ~1000 units, y up is negative.
// Arms and legs are two-bone IK chains, so poses are just hand / foot targets.

const R = 150; // head radius
const HEAD_Y = -830;
const UA = 165; // upper arm
const FA = 160; // forearm
const TH = 188; // thigh
const SH = 178; // shin

export const SKIN = ["#f2c9a8", "#e8b48f", "#c98e64", "#9a6440", "#6b4128", "#f6d7bf"];

type V = [number, number];

function ik(s: V, t: V, a: number, b: number, outward: number): { e: V; h: V } {
  let dx = t[0] - s[0];
  let dy = t[1] - s[1];
  let d = Math.hypot(dx, dy);
  const max = a + b - 0.5;
  if (d > max) {
    dx *= max / d;
    dy *= max / d;
    d = max;
  }
  d = Math.max(d, Math.abs(a - b) + 1);
  const base = Math.atan2(dy, dx);
  const k = Math.acos(Math.max(-1, Math.min(1, (a * a + d * d - b * b) / (2 * a * d))));
  const c1: V = [s[0] + a * Math.cos(base + k), s[1] + a * Math.sin(base + k)];
  const c2: V = [s[0] + a * Math.cos(base - k), s[1] + a * Math.sin(base - k)];
  // pick the elbow / knee that points away from the body centre (outward) or, with outward=0, downward
  const score = (p: V) => (outward !== 0 ? p[0] * outward : p[1]);
  const e = score(c1) >= score(c2) ? c1 : c2;
  return { e, h: [s[0] + dx, s[1] + dy] };
}

// ---------------------------------------------------------------- pose targets

interface Rig {
  lh: V; // left hand (screen left)
  rh: V;
  lf: V; // feet
  rf: V;
  drop: number; // how far the upper body sinks (crouch / sit)
  lean: number; // degrees
  tilt: number; // head tilt degrees
  headDy: number;
  bob: number;
  gaze: V;
  legsOut: number;
}

function rig(pose: Pose, t: number, moving: boolean, running: boolean, talk: number, seed: number): Rig {
  const br = Math.sin(t * 2.1 + seed * 6) * 4; // breathing
  const r: Rig = {
    lh: [-165, -362 + br],
    rh: [165, -362 + br],
    lf: [-62, -20],
    rf: [62, -20],
    drop: 0,
    lean: 0,
    tilt: wob(t, seed, 0.6) * 2.2,
    headDy: br * 0.6,
    bob: 0,
    gaze: [wob(t * 0.5, seed + 2) * 4, 0],
    legsOut: 1,
  };
  if (moving) {
    const sp = running ? 13 : 8.5;
    const s = Math.sin(t * sp);
    const lift = running ? 70 : 38;
    r.lf = [-58, -20 - lift * Math.max(0, s)];
    r.rf = [58, -20 - lift * Math.max(0, -s)];
    r.bob = -Math.abs(Math.cos(t * sp)) * (running ? 22 : 10);
    r.lh = running ? [-170 - 30 * s, -560 + 60 * s] : [-150 - 18 * s, -385 + 20 * s];
    r.rh = running ? [170 - 30 * s, -560 - 60 * s] : [150 - 18 * s, -385 - 20 * s];
    r.lean = running ? 5 : 0;
  }
  const g = (a: number) => Math.sin(t * a);
  switch (pose) {
    case "talk":
      r.rh = [178 + 22 * g(3.1), -520 + 34 * g(4.3)];
      r.lh = [-160 + 8 * g(2.3), -420];
      break;
    case "point":
      r.rh = [425, -735];
      r.gaze = [8, -2];
      break;
    case "hush":
      r.rh = [16, -752];
      break;
    case "cover":
      r.lh = [-34, -756];
      r.rh = [34, -752];
      break;
    case "phone":
      r.rh = [150, -830];
      r.gaze = [-5, 2];
      break;
    case "crouch":
    case "hide":
      r.drop = 185;
      r.lf = [-92, -20];
      r.rf = [92, -20];
      r.legsOut = 1.7;
      if (pose === "hide") {
        r.lh = [-70, -930];
        r.rh = [70, -935];
        r.tilt = 6;
      } else {
        r.lh = [-150, -430];
        r.rh = [150, -430];
      }
      break;
    case "reach":
      r.rh = [400, -660 + 10 * g(2)];
      r.lh = [300, -600 + 10 * g(2.4)];
      r.lean = 4;
      break;
    case "torch":
      r.rh = [235, -560];
      break;
    case "lookup":
      r.tilt = -4;
      r.headDy = -10;
      r.gaze = [0, -12];
      break;
    case "wave":
      r.rh = [255 + 32 * g(9), -945];
      break;
    case "hug":
      r.lh = [70, -565];
      r.rh = [-70, -585];
      break;
    case "hold":
    case "write":
      r.lh = [-60, -530];
      r.rh = [60, -535];
      r.gaze = [0, 7];
      break;
    case "carry":
      r.lh = [-95, -575];
      r.rh = [95, -575];
      break;
    case "knock":
      r.rh = [250 + 24 * Math.abs(Math.sin(t * 8)), -720];
      r.gaze = [8, 0];
      break;
    case "arms":
      r.lh = [95, -560];
      r.rh = [-95, -552];
      break;
    case "fists":
      r.lh = [-110, -650];
      r.rh = [120, -640];
      r.lf = [-95, -20];
      r.rf = [90, -20];
      break;
    case "shrug":
      r.lh = [-235, -600];
      r.rh = [235, -600];
      r.tilt = 7;
      break;
    case "hands-up":
      r.lh = [-205, -960];
      r.rh = [205, -960];
      break;
    case "think":
      r.rh = [36, -705];
      r.lh = [70, -555];
      r.gaze = [6, -8];
      r.tilt = -5;
      break;
    case "sit":
      r.drop = 165;
      r.lf = [-70, -20];
      r.rf = [70, -20];
      r.lh = [-75, -440];
      r.rh = [75, -440];
      r.legsOut = 0.6;
      break;
    default:
      break;
  }
  if (talk > 0.05 && pose !== "talk" && pose !== "hush" && pose !== "cover" && pose !== "phone") {
    r.tilt += Math.sin(t * 5.3) * 2.5 * talk;
  }
  return r;
}

// ---------------------------------------------------------------- hair

function hairShapes(style: Hair, c: string, cap: string): { back: React.ReactNode; front: React.ReactNode } {
  const d = shade(c, -0.25);
  switch (style) {
    case "bald":
      return { back: null, front: null };
    case "buzz":
      return {
        back: null,
        front: <path d="M-148 -15 C-150 -120 -80 -158 0 -158 C80 -158 150 -120 148 -15 C120 -70 70 -92 0 -94 C-70 -92 -120 -70 -148 -15Z" fill={c} opacity={0.85} />,
      };
    case "short":
    case "messy":
    case "spiky": {
      const top =
        style === "spiky"
          ? "M-156 10 L-170 -90 L-130 -100 L-140 -170 L-80 -140 L-60 -205 L-10 -150 L30 -210 L60 -150 L120 -190 L115 -120 L172 -110 L156 10 C140 -50 110 -80 70 -88 C40 -70 -10 -95 -40 -80 C-90 -95 -140 -60 -156 10Z"
          : style === "messy"
            ? "M-158 20 C-178 -60 -150 -150 -80 -178 C-50 -200 10 -205 50 -190 C110 -185 175 -130 162 -10 C150 -55 130 -70 112 -76 C120 -50 100 -40 92 -60 C70 -40 40 -80 10 -70 C0 -50 -30 -40 -40 -72 C-70 -60 -90 -80 -110 -60 C-120 -40 -140 -20 -158 20Z"
            : "M-154 14 C-164 -110 -90 -178 0 -176 C95 -178 165 -110 154 14 C142 -42 118 -72 86 -84 C52 -64 -6 -98 -42 -82 C-84 -94 -134 -62 -154 14Z";
      return { back: null, front: <g><path d={top} fill={c} /><path d="M-60 -160 C-20 -176 40 -176 80 -158" stroke={shade(c, 0.25)} strokeWidth={10} fill="none" strokeLinecap="round" opacity={0.6} /></g> };
    }
    case "side":
      return {
        back: null,
        front: <g><path d="M-156 30 C-170 -110 -80 -180 10 -176 C100 -176 165 -110 155 0 C140 -60 100 -90 40 -100 C-20 -100 -60 -60 -110 -40 C-130 -20 -146 0 -156 30Z" fill={c} /><path d="M-20 -165 C40 -150 90 -120 120 -70" stroke={shade(c, 0.25)} strokeWidth={9} fill="none" strokeLinecap="round" opacity={0.6} /></g>,
      };
    case "bob":
      return {
        back: <path d="M-182 120 C-200 -60 -150 -190 0 -192 C150 -190 200 -60 182 120 C150 135 120 128 100 115 L-100 115 C-120 128 -150 135 -182 120Z" fill={d} />,
        front: <path d="M-160 60 C-172 -100 -90 -182 0 -180 C90 -182 172 -100 160 60 C150 -10 135 -55 120 -66 L-120 -66 C-135 -55 -150 -10 -160 60Z" fill={c} />,
      };
    case "long":
    case "ponytail":
    case "pigtails":
    case "braids": {
      const back =
        style === "long" ? (
          <path d="M-176 340 C-200 120 -190 -120 -100 -180 C-40 -210 40 -210 100 -180 C190 -120 200 120 176 340 C120 360 60 350 40 330 L-40 330 C-60 350 -120 360 -176 340Z" fill={d} />
        ) : style === "ponytail" ? (
          <path d="M120 -120 C220 -120 250 40 200 200 C190 120 170 60 130 20Z" fill={d} />
        ) : style === "pigtails" ? (
          <g fill={d}>
            <path d="M-140 -60 C-240 -40 -250 120 -200 220 C-190 140 -170 70 -130 20Z" />
            <path d="M140 -60 C240 -40 250 120 200 220 C190 140 170 70 130 20Z" />
          </g>
        ) : (
          <g fill={d}>
            {[0, 1, 2, 3, 4].map((i) => (
              <React.Fragment key={i}>
                <ellipse cx={-150} cy={20 + i * 52} rx={30} ry={30} />
                <ellipse cx={150} cy={20 + i * 52} rx={30} ry={30} />
              </React.Fragment>
            ))}
          </g>
        );
      return {
        back,
        front: <path d="M-158 40 C-172 -110 -90 -184 0 -182 C90 -184 172 -110 158 40 C148 -30 128 -70 96 -82 C60 -70 20 -100 -10 -100 C-50 -100 -100 -80 -130 -50 C-145 -30 -152 0 -158 40Z" fill={c} />,
      };
    }
    case "bun":
      return {
        back: <circle cx={0} cy={-185} r={62} fill={d} />,
        front: <g><path d="M-152 0 C-160 -120 -90 -176 0 -174 C90 -176 160 -120 152 0 C136 -60 96 -100 0 -104 C-96 -100 -136 -60 -152 0Z" fill={c} /><path d="M-90 -150 C-40 -168 40 -168 90 -150" stroke={shade(c, 0.3)} strokeWidth={8} fill="none" opacity={0.7} /></g>,
      };
    case "curly":
    case "afro": {
      const big = style === "afro";
      const pts: V[] = [];
      const n = big ? 16 : 13;
      for (let i = 0; i < n; i++) {
        const a = Math.PI * (1.02 + (0.96 * i) / (n - 1));
        pts.push([Math.cos(a) * (big ? 190 : 158), Math.sin(a) * (big ? 200 : 165) - (big ? 20 : 8)]);
      }
      return {
        back: big ? <ellipse cx={0} cy={-60} rx={225} ry={215} fill={d} /> : null,
        front: (
          <g fill={c}>
            {pts.map((p, i) => (
              <circle key={i} cx={p[0]} cy={p[1]} r={big ? 62 : 48} />
            ))}
          </g>
        ),
      };
    }
    case "hood":
      return {
        back: <path d="M-200 150 C-230 -100 -150 -230 0 -232 C150 -230 230 -100 200 150Z" fill={shade(cap, -0.2)} />,
        front: <path d="M-200 150 C-230 -100 -150 -230 0 -232 C150 -230 230 -100 200 150 L170 150 C182 -40 120 -170 0 -172 C-120 -170 -182 -40 -170 150Z" fill={cap} />,
      };
    case "cap":
      return {
        back: null,
        front: (
          <g>
            <path d="M-150 -40 C-160 -150 -80 -186 0 -186 C80 -186 160 -150 150 -40Z" fill={cap} />
            <path d="M-170 -40 C-120 -70 120 -70 230 -30 C200 -10 120 -20 -170 -20Z" fill={shade(cap, -0.25)} />
            <circle cx={0} cy={-184} r={10} fill={shade(cap, -0.25)} />
          </g>
        ),
      };
    case "beanie":
      return {
        back: null,
        front: (
          <g>
            <path d="M-158 -30 C-168 -160 -80 -205 0 -205 C80 -205 168 -160 158 -30Z" fill={cap} />
            <rect x={-166} y={-62} width={332} height={52} rx={22} fill={shade(cap, -0.2)} />
            {[-120, -80, -40, 0, 40, 80, 120].map((x) => (
              <line key={x} x1={x} y1={-56} x2={x} y2={-16} stroke={shade(cap, -0.35)} strokeWidth={6} />
            ))}
            <circle cx={0} cy={-212} r={30} fill={shade(cap, 0.2)} />
          </g>
        ),
      };
    default:
      return { back: null, front: null };
  }
}

// ---------------------------------------------------------------- face

const Eyes: React.FC<{ expr: Expr; gaze: V; blink: number; variant?: string; seed: number; t: number }> = ({ expr, gaze, blink, variant, seed, t }) => {
  const wide = expr === "shocked" || expr === "terrified" || expr === "creepy";
  const rx = wide ? 31 : 26;
  const ry = wide ? 37 : 30;
  const pr = expr === "terrified" || expr === "creepy" ? 8 : expr === "shocked" ? 11 : 14;
  const shiver = expr === "terrified" ? Math.sin(t * 40 + seed) * 1.6 : 0;
  const closed = blink > 0.5 || expr === "sleep" || expr === "relief" || expr === "pain";
  if (variant === "ghost" || variant === "wrong") {
    return (
      <g>
        {[-52, 52].map((x) => (
          <ellipse key={x} cx={x} cy={-5} rx={rx + 3} ry={ry + 6} fill="#050505" />
        ))}
        {variant === "wrong" && [-52, 52].map((x) => <circle key={x} cx={x + 6} cy={-14} r={4} fill="#fff" opacity={0.7} />)}
      </g>
    );
  }
  if (variant === "infected") {
    return (
      <g>
        {[-52, 52].map((x) => (
          <ellipse key={x} cx={x} cy={-5} rx={rx} ry={ry} fill="#e9eedc" stroke="#55603f" strokeWidth={5} />
        ))}
      </g>
    );
  }
  if (closed) {
    const happy = expr === "relief";
    return (
      <g stroke="#2a1a14" strokeWidth={8} fill="none" strokeLinecap="round">
        {[-52, 52].map((x) =>
          expr === "pain" ? (
            <path key={x} d={x < 0 ? `M${x - 24} -18 L${x + 18} -4 L${x - 24} 10` : `M${x + 24} -18 L${x - 18} -4 L${x + 24} 10`} />
          ) : (
            <path key={x} d={happy ? `M${x - 24} 2 Q${x} -22 ${x + 24} 2` : `M${x - 24} -2 Q${x} 14 ${x + 24} -2`} />
          ),
        )}
      </g>
    );
  }
  const lid = expr === "suspicious" ? 0.45 : expr === "sad" || expr === "crying" || expr === "worried" ? 0.18 : expr === "angry" || expr === "determined" || expr === "smug" ? 0.28 : 0;
  return (
    <g>
      {[-52, 52].map((x, i) => {
        const id = `eye${Math.round(seed * 1e5)}${i}`;
        const l = expr === "suspicious" && i === 0 ? 0.15 : lid;
        return (
          <g key={x}>
            <clipPath id={id}>
              <ellipse cx={x} cy={-5} rx={rx} ry={ry} />
            </clipPath>
            <ellipse cx={x} cy={-5} rx={rx} ry={ry} fill="#fff" />
            <g clipPath={`url(#${id})`}>
              <circle cx={x + gaze[0] + shiver} cy={-3 + gaze[1]} r={pr + 4} fill="#3b2a20" />
              <circle cx={x + gaze[0] + shiver} cy={-3 + gaze[1]} r={pr} fill="#120c09" />
              <circle cx={x + gaze[0] + shiver + 6} cy={-10 + gaze[1]} r={5.5} fill="#fff" />
              <circle cx={x + gaze[0] + shiver - 5} cy={4 + gaze[1]} r={2.5} fill="#fff" opacity={0.8} />
              {l > 0 && <rect x={x - rx - 2} y={-5 - ry - 2} width={rx * 2 + 4} height={ry * 2 * l + 2} fill="var(--skin)" />}
              {l > 0 && <line x1={x - rx} y1={-5 - ry + ry * 2 * l} x2={x + rx} y2={-5 - ry + ry * 2 * l} stroke="#2a1a14" strokeWidth={5} />}
            </g>
            <ellipse cx={x} cy={-5} rx={rx} ry={ry} fill="none" stroke="#2a1a14" strokeWidth={3} opacity={0.35} />
          </g>
        );
      })}
    </g>
  );
};

function brows(expr: Expr): [number, number] /* inner y offset, outer y offset */ {
  switch (expr) {
    case "angry":
    case "determined":
      return [14, -12];
    case "sad":
    case "crying":
    case "worried":
    case "scared":
      return [-16, 6];
    case "terrified":
      return [-26, -6];
    case "shocked":
    case "creepy":
      return [-24, -20];
    case "suspicious":
      return [4, -8];
    case "smug":
      return [2, -10];
    default:
      return [0, -4];
  }
}

const Mouth: React.FC<{ expr: Expr; open: number; t: number; variant?: string }> = ({ expr, open, t, variant }) => {
  const ink = "#3a1d16";
  if (variant === "ghost") return <ellipse cx={0} cy={82} rx={18} ry={10 + open * 26} fill="#050505" />;
  if (open > 0.06) {
    const h = 8 + open * 34;
    const w = 40 - open * 8;
    return (
      <g>
        <ellipse cx={0} cy={78} rx={w} ry={h / 2 + 2} fill="#5b1a1a" stroke={ink} strokeWidth={4} />
        <ellipse cx={0} cy={78 + h * 0.28} rx={w * 0.55} ry={h * 0.2} fill="#d9686b" />
        {open > 0.4 && <rect x={-w * 0.6} y={78 - h / 2} width={w * 1.2} height={6} rx={3} fill="#fff" />}
      </g>
    );
  }
  switch (expr) {
    case "smile":
    case "relief":
      return <path d="M-38 66 Q0 104 38 66" stroke={ink} strokeWidth={8} fill="none" strokeLinecap="round" />;
    case "smug":
      return <path d="M-30 78 Q10 92 40 64" stroke={ink} strokeWidth={8} fill="none" strokeLinecap="round" />;
    case "grin":
      return (
        <g>
          <path d="M-52 62 Q0 128 52 62 Z" fill="#5b1a1a" stroke={ink} strokeWidth={5} strokeLinejoin="round" />
          <path d="M-46 64 L46 64 L40 76 L-40 76Z" fill="#fff" />
        </g>
      );
    case "creepy": {
      const teeth = [];
      for (let i = -5; i <= 5; i++) teeth.push(<line key={i} x1={i * 14} y1={60} x2={i * 14} y2={92 - Math.abs(i) * 2} stroke={ink} strokeWidth={3} />);
      return (
        <g>
          <path d="M-105 40 Q0 130 105 40 Q0 90 -105 40Z" fill="#fff" stroke={ink} strokeWidth={5} />
          {teeth}
        </g>
      );
    }
    case "sad":
    case "crying":
    case "worried":
      return <path d="M-32 92 Q0 64 32 92" stroke={ink} strokeWidth={8} fill="none" strokeLinecap="round" />;
    case "scared":
      return <path d={`M-30 84 Q-15 ${72 + Math.sin(t * 30) * 3} 0 84 Q15 ${96 + Math.sin(t * 30) * 3} 30 84`} stroke={ink} strokeWidth={7} fill="none" strokeLinecap="round" />;
    case "terrified":
      return <ellipse cx={0} cy={86} rx={24} ry={32} fill="#5b1a1a" stroke={ink} strokeWidth={5} />;
    case "shocked":
      return <ellipse cx={0} cy={86} rx={20} ry={24} fill="#5b1a1a" stroke={ink} strokeWidth={5} />;
    case "angry":
      return <path d="M-34 88 Q0 74 34 88" stroke={ink} strokeWidth={9} fill="none" strokeLinecap="round" />;
    case "determined":
    case "suspicious":
    case "blank":
      return <line x1={-28} y1={82} x2={28} y2={82} stroke={ink} strokeWidth={8} strokeLinecap="round" />;
    case "pain":
      return <path d="M-36 90 Q-18 70 0 84 Q18 70 36 90 Q0 104 -36 90Z" fill="#5b1a1a" stroke={ink} strokeWidth={5} />;
    case "sleep":
      return <ellipse cx={0} cy={84} rx={10} ry={7} fill={ink} />;
    default:
      return <path d="M-26 80 Q0 90 26 80" stroke={ink} strokeWidth={8} fill="none" strokeLinecap="round" />;
  }
};

const MaskFace: React.FC<{ mask: NonNullable<Cast["mask"]>; t: number }> = ({ mask, t }) => {
  switch (mask) {
    case "gold":
      return (
        <g>
          <path d="M-150 -70 C-150 -170 -60 -190 0 -190 C60 -190 150 -170 150 -70 C150 40 90 120 0 130 C-90 120 -150 40 -150 -70Z" fill="#d8a93a" stroke="#8a6418" strokeWidth={6} />
          <path d="M-120 -120 C-60 -160 60 -160 120 -120" stroke="#ffe08a" strokeWidth={10} fill="none" opacity={0.7} />
          <path d="M-100 -30 C-80 -60 -40 -60 -24 -30 C-40 -14 -80 -14 -100 -30Z M100 -30 C80 -60 40 -60 24 -30 C40 -14 80 -14 100 -30Z" fill="#111" />
          <path d="M-130 -60 q-30 -60 -10 -120 M130 -60 q30 -60 10 -120" stroke="#8a6418" strokeWidth={8} fill="none" />
          <path d="M-40 70 Q0 90 40 70" stroke="#8a6418" strokeWidth={8} fill="none" />
          <circle cx={-110} cy={-150} r={10} fill="#b3262e" />
          <circle cx={110} cy={-150} r={10} fill="#b3262e" />
        </g>
      );
    case "fox":
      return (
        <g>
          <path d="M-150 -40 L-160 -210 L-70 -130 L70 -130 L160 -210 L150 -40 C140 80 60 150 0 160 C-60 150 -140 80 -150 -40Z" fill="#f4f1ea" stroke="#2b2b2b" strokeWidth={5} />
          <path d="M-140 -150 L-80 -125 L-120 -60Z M140 -150 L80 -125 L120 -60Z" fill="#c0392b" />
          <path d="M-90 -20 L-30 -5 L-90 10Z M90 -20 L30 -5 L90 10Z" fill="#111" />
          <path d="M-60 40 Q0 70 60 40" stroke="#c0392b" strokeWidth={8} fill="none" />
          <circle cx={0} cy={110} r={16} fill="#111" />
        </g>
      );
    case "doll":
      return (
        <g>
          <ellipse cx={0} cy={0} rx={140} ry={160} fill="#f7f1ea" stroke="#cfc6bb" strokeWidth={5} />
          <ellipse cx={-52} cy={-10} rx={26} ry={20} fill="#0b0b0b" />
          <ellipse cx={52} cy={-10} rx={26} ry={20} fill="#0b0b0b" />
          <circle cx={-88} cy={50} r={24} fill="#e79a9a" opacity={0.7} />
          <circle cx={88} cy={50} r={24} fill="#e79a9a" opacity={0.7} />
          <path d="M-14 88 Q0 80 14 88 Q0 100 -14 88Z" fill="#b2262e" />
          <path d="M40 -150 L30 -90 L52 -60 L40 -20" stroke="#6b6158" strokeWidth={3} fill="none" />
        </g>
      );
    case "visor":
      return (
        <g>
          <ellipse cx={0} cy={0} rx={150} ry={162} fill="#111317" />
          <ellipse cx={-40} cy={-60} rx={70} ry={30} fill="#fff" opacity={0.08} />
          <rect x={-70} y={-12} width={140} height={14} rx={7} fill="#ff3b3b" opacity={0.7 + 0.3 * Math.sin(t * 3)} />
        </g>
      );
    case "sack":
      return (
        <g>
          <path d="M-160 120 C-175 -60 -150 -190 0 -200 C150 -190 175 -60 160 120 C80 160 -80 160 -160 120Z" fill="#b08f5f" stroke="#7a5f3a" strokeWidth={5} />
          <path d="M-80 -20 l30 -14 M-80 -34 l30 14 M50 -20 l30 -14 M50 -34 l30 14" stroke="#2b1d10" strokeWidth={6} />
          <path d="M-60 70 L60 70" stroke="#2b1d10" strokeWidth={6} strokeDasharray="10 8" />
        </g>
      );
    case "gas":
      return (
        <g>
          <ellipse cx={0} cy={0} rx={146} ry={156} fill="#2f3532" />
          <circle cx={-55} cy={-10} r={36} fill="#9ec9c4" stroke="#111" strokeWidth={8} opacity={0.85} />
          <circle cx={55} cy={-10} r={36} fill="#9ec9c4" stroke="#111" strokeWidth={8} opacity={0.85} />
          <rect x={-30} y={60} width={60} height={70} rx={14} fill="#1b1e1c" />
        </g>
      );
    case "skull":
      return (
        <g>
          <ellipse cx={0} cy={-10} rx={140} ry={150} fill="#ece8df" />
          <ellipse cx={-52} cy={-5} rx={36} ry={40} fill="#111" />
          <ellipse cx={52} cy={-5} rx={36} ry={40} fill="#111" />
          <path d="M-12 50 L0 30 L12 50Z" fill="#111" />
          <path d="M-50 90 L50 90 M-30 80 L-30 100 M-10 80 L-10 100 M10 80 L10 100 M30 80 L30 100" stroke="#111" strokeWidth={5} />
        </g>
      );
  }
};

// ---------------------------------------------------------------- items held in the hand

export const HandItem: React.FC<{ item: string; at: V; t: number; flip?: boolean }> = ({ item, at, t }) => {
  const [x, y] = at;
  switch (item) {
    case "candle": {
      const fl = 1 + Math.sin(t * 17) * 0.08 + Math.sin(t * 7.3) * 0.06;
      return (
        <g transform={`translate(${x} ${y})`}>
          <circle cx={0} cy={-120} r={260 * fl} fill="url(#candleGlow)" style={{ mixBlendMode: "screen" }} />
          <rect x={-16} y={-110} width={32} height={110} rx={6} fill="#f3ead8" />
          <rect x={-44} y={-12} width={88} height={18} rx={9} fill="#b8862e" />
          <path d={`M0 -${150 * fl} C14 -132 12 -116 0 -110 C-12 -116 -14 -132 0 -${150 * fl}Z`} fill="#ffcf5a" />
          <path d="M0 -136 C6 -126 5 -118 0 -114 C-5 -118 -6 -126 0 -136Z" fill="#fff6d0" />
        </g>
      );
    }
    case "phone":
      return (
        <g transform={`translate(${x - 30} ${y - 70})`}>
          <rect width={64} height={120} rx={12} fill="#15171c" />
          <rect x={6} y={10} width={52} height={96} rx={6} fill="#7fb6ff" opacity={0.9} />
          <circle cx={32} cy={58} r={180} fill="url(#screenGlow)" style={{ mixBlendMode: "screen" }} />
        </g>
      );
    case "lantern":
    case "torch": {
      const fl = 1 + Math.sin(t * 11) * 0.03;
      return (
        <g transform={`translate(${x} ${y})`}>
          {item === "torch" ? (
            <g>
              <path d={`M20 -10 L${900} ${-260 * fl} L${900} ${240 * fl}Z`} fill="url(#beam)" style={{ mixBlendMode: "screen" }} />
              <rect x={-30} y={-20} width={70} height={36} rx={10} fill="#2b2f36" />
              <rect x={34} y={-24} width={16} height={44} rx={5} fill="#fff5c8" />
            </g>
          ) : (
            <g>
              <circle cx={0} cy={40} r={300 * fl} fill="url(#candleGlow)" style={{ mixBlendMode: "screen" }} />
              <path d="M-30 0 L30 0 L36 90 L-36 90Z" fill="#ffd27a" stroke="#3a2b1a" strokeWidth={8} />
              <path d="M-20 -10 Q0 -50 20 -10" stroke="#3a2b1a" strokeWidth={6} fill="none" />
            </g>
          )}
        </g>
      );
    }
    case "letter":
    case "map":
      return (
        <g transform={`translate(${x} ${y - 40}) rotate(-6)`}>
          <rect x={-90} y={-60} width={180} height={130} rx={4} fill={item === "map" ? "#e7d9b0" : "#f6f1e6"} stroke="#b8a888" strokeWidth={3} />
          {item === "map" ? (
            <path d="M-70 40 C-30 0 0 30 30 -20 C50 -40 60 -30 70 -40" stroke="#c0392b" strokeWidth={5} strokeDasharray="10 8" fill="none" />
          ) : (
            [0, 1, 2, 3].map((i) => <line key={i} x1={-70} y1={-36 + i * 24} x2={60 - (i % 2) * 30} y2={-36 + i * 24} stroke="#5a5a6a" strokeWidth={5} />)
          )}
        </g>
      );
    case "box":
      return <rect x={x - 130} y={y - 120} width={260} height={150} rx={8} fill="#b98a55" stroke="#8a6234" strokeWidth={6} />;
    case "bag":
      return (
        <g transform={`translate(${x} ${y})`}>
          <path d="M-60 0 L60 0 L75 150 L-75 150Z" fill="#30343c" />
          <path d="M-35 0 Q0 -55 35 0" stroke="#30343c" strokeWidth={10} fill="none" />
        </g>
      );
    case "cash":
      return (
        <g transform={`translate(${x - 70} ${y - 50})`}>
          {[0, 1, 2].map((i) => (
            <rect key={i} x={i * 4} y={-i * 14} width={140} height={60} rx={5} fill="#5aa469" stroke="#2f6b3c" strokeWidth={4} />
          ))}
          <circle cx={78} cy={-2} r={14} fill="none" stroke="#2f6b3c" strokeWidth={4} />
        </g>
      );
    case "key":
      return (
        <g transform={`translate(${x} ${y - 30})`}>
          <circle cx={0} cy={0} r={22} fill="none" stroke="#e0b84a" strokeWidth={10} />
          <path d="M22 0 L90 0 M70 0 L70 18 M84 0 L84 14" stroke="#e0b84a" strokeWidth={10} />
        </g>
      );
    case "teddy":
      return (
        <g transform={`translate(${x} ${y - 60})`}>
          <circle cx={-34} cy={-60} r={20} fill="#9b6a43" />
          <circle cx={34} cy={-60} r={20} fill="#9b6a43" />
          <circle cx={0} cy={-30} r={46} fill="#b07a4e" />
          <ellipse cx={0} cy={50} rx={54} ry={60} fill="#b07a4e" />
          <circle cx={-15} cy={-36} r={5} fill="#111" />
          <circle cx={15} cy={-36} r={5} fill="#111" />
        </g>
      );
    case "cup":
      return (
        <g transform={`translate(${x} ${y - 30})`}>
          <rect x={-34} y={-40} width={68} height={76} rx={10} fill="#e8e2d6" />
          <path d="M34 -24 C60 -24 60 16 34 16" stroke="#e8e2d6" strokeWidth={10} fill="none" />
          <path d="M-10 -56 C-20 -76 0 -86 -8 -104 M12 -56 C2 -76 22 -86 14 -104" stroke="#fff" strokeWidth={5} opacity={0.5} fill="none" />
        </g>
      );
    case "bells":
      return (
        <g transform={`translate(${x} ${y + 10}) rotate(${Math.sin(t * 14) * 12})`}>
          {[-40, 0, 40].map((dx) => (
            <path key={dx} d={`M${dx - 18} 40 Q${dx - 18} 0 ${dx} 0 Q${dx + 18} 0 ${dx + 18} 40Z`} fill="#c9a23a" stroke="#7a5a10" strokeWidth={4} />
          ))}
        </g>
      );
    default:
      return null;
  }
};

// ---------------------------------------------------------------- person

export interface PersonProps {
  cast: Cast;
  spec: Char;
  t: number; // seconds into the shot
  progress: number; // 0..1 through the shot (for walking)
  open: number; // mouth openness 0..1 from lip-sync
  item?: string;
  rim?: string; // rim-light colour (moonlight, fire...)
  mirror?: boolean; // drawn flipped: keep text (badges) readable
}

export const Person: React.FC<PersonProps> = ({ cast, spec, t, open, item, rim, mirror }) => {
  const seed = hash(spec.id);
  const expr: Expr = spec.expr ?? "neutral";
  const pose: Pose = spec.pose ?? "idle";
  const moving = (pose === "walk" || pose === "run") && spec.to !== undefined;
  const running = pose === "run";
  const r = rig(pose, t, moving || pose === "walk" || pose === "run", running, open, seed);
  const back = pose === "back";
  const variant = cast.variant;
  const skin = variant === "infected" ? "#9aa98b" : variant === "ghost" ? "#dfe4e6" : variant === "pale" ? "#ece3da" : cast.skin ?? SKIN[0];
  const skinD = shade(skin, -0.16);
  const top = cast.top;
  const topD = shade(top, -0.22);
  const pants = cast.topStyle === "jumpsuit" ? top : cast.pants ?? "#2f3a4f";
  const shoes = cast.shoes ?? "#1f1f24";
  const hairC = cast.hairColor ?? "#3b2416";
  const bw = cast.build ?? 1;
  const age = cast.age ?? "adult";
  const bodyK = age === "kid" ? 0.66 : age === "teen" ? 0.88 : 1; // body below the neck
  const headK = age === "kid" ? 1.16 : age === "teen" ? 1.05 : 1;
  const terr = expr === "terrified" ? Math.sin(t * 45 + seed * 9) * 2.2 : 0;
  const blinkT = (t + seed * 3.1) % 3.4;
  const blink = blinkT < 0.12 ? 1 : 0;
  const style = cast.topStyle ?? "shirt";
  const hair = hairShapes(cast.hair ?? "short", hairC, cast.top2 ?? hairC);
  const drop = r.drop;
  const by = r.bob + drop;

  // shoulders / hips scaled by body proportions
  const sh: [V, V] = [
    [-118 * bw, -672],
    [118 * bw, -672],
  ];
  const hips: [V, V] = [
    [-58 * bw, -392 + drop],
    [58 * bw, -392 + drop],
  ];
  const armL = ik(sh[0], [r.lh[0], r.lh[1]], UA, FA, -1);
  const armR = ik(sh[1], [r.rh[0], r.rh[1]], UA, FA, 1);
  const legL = ik(hips[0], r.lf, TH, SH, -r.legsOut);
  const legR = ik(hips[1], r.rf, TH, SH, r.legsOut);

  const sleeve = style === "dress" ? skin : top;
  const sleeveD = shade(sleeve, -0.12);
  const arm = (a: { e: V; h: V }, s: V, k: string, front: boolean) => (
    <g key={k} opacity={front ? 1 : 1}>
      <path d={`M${s[0]} ${s[1]} L${a.e[0]} ${a.e[1]} L${a.h[0]} ${a.h[1]}`} stroke={sleeveD} strokeWidth={62} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d={`M${s[0]} ${s[1]} L${a.e[0]} ${a.e[1]} L${a.h[0]} ${a.h[1]}`} stroke={sleeve} strokeWidth={52} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      {/* light along the upper edge of the sleeve + a cuff at the wrist */}
      <path d={`M${s[0]} ${s[1] - 12} L${a.e[0]} ${a.e[1] - 12}`} stroke="#fff" strokeOpacity={0.08} strokeWidth={14} strokeLinecap="round" fill="none" />
      {style !== "dress" && (
        <path d={`M${a.e[0] + (a.h[0] - a.e[0]) * 0.72} ${a.e[1] + (a.h[1] - a.e[1]) * 0.72} L${a.e[0] + (a.h[0] - a.e[0]) * 0.84} ${a.e[1] + (a.h[1] - a.e[1]) * 0.84}`} stroke={shade(sleeve, -0.28)} strokeWidth={56} fill="none" />
      )}
      <circle cx={a.h[0]} cy={a.h[1]} r={29} fill={skinD} />
      <circle cx={a.h[0] - 2} cy={a.h[1] - 2} r={25} fill={skin} />
      <ellipse cx={a.h[0] + (s[0] < 0 ? 22 : -22)} cy={a.h[1] - 14} rx={11} ry={17} fill={skin} stroke={skinD} strokeWidth={3} transform={`rotate(${s[0] < 0 ? -30 : 30} ${a.h[0] + (s[0] < 0 ? 22 : -22)} ${a.h[1] - 14})`} />
    </g>
  );

  const torsoBottom = style === "coat" ? -170 : style === "dress" ? -200 : -392;
  const torso = `M${-128 * bw} -650 C${-132 * bw} -700 ${-96 * bw} -708 ${-70 * bw} -708 L${70 * bw} -708 C${96 * bw} -708 ${132 * bw} -700 ${128 * bw} -650 L${(style === "dress" ? 175 : style === "coat" ? 130 : 112) * bw} ${torsoBottom + 10} Q0 ${torsoBottom + 26} ${-(style === "dress" ? 175 : style === "coat" ? 130 : 112) * bw} ${torsoBottom + 10}Z`;

  const legs = (
    <g>
      {[
        [legL, hips[0]],
        [legR, hips[1]],
      ].map(([l, h], i) => {
        const leg = l as { e: V; h: V };
        const hp = h as V;
        return (
          <g key={i}>
            <path d={`M${hp[0]} ${hp[1]} L${leg.e[0]} ${leg.e[1]} L${leg.h[0]} ${leg.h[1] - 18}`} stroke={shade(pants, -0.18)} strokeWidth={74} strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <path d={`M${hp[0]} ${hp[1]} L${leg.e[0]} ${leg.e[1]} L${leg.h[0]} ${leg.h[1] - 18}`} stroke={pants} strokeWidth={64} strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <ellipse cx={leg.h[0] + (i ? 14 : -14)} cy={leg.h[1] - 6} rx={58} ry={30} fill={shoes} />
            <path d={`M${leg.h[0] + (i ? 14 : -14) - 56} ${leg.h[1] + 2} Q${leg.h[0] + (i ? 14 : -14)} ${leg.h[1] + 22} ${leg.h[0] + (i ? 14 : -14) + 56} ${leg.h[1] + 2}`} stroke={shade(shoes, 0.35)} strokeWidth={8} fill="none" opacity={0.6} />
            <ellipse cx={leg.h[0] + (i ? 4 : -24)} cy={leg.h[1] - 16} rx={22} ry={8} fill="#fff" opacity={0.15} />
          </g>
        );
      })}
      <path d={`M${-112 * bw} ${-412 + drop} L${112 * bw} ${-412 + drop} L${100 * bw} ${-330 + drop} L${-100 * bw} ${-330 + drop}Z`} fill={pants} />
      <path d={`M0 ${-400 + drop} L0 ${-340 + drop}`} stroke={shade(pants, -0.25)} strokeWidth={5} />
    </g>
  );
  const hem =
    style === "shirt" || style === "hoodie" || style === "sweater" ? (
      <path d={`M${-113 * bw} ${-404} Q0 ${-386} ${113 * bw} ${-404} L${112 * bw} ${-382} Q0 ${-364} ${-112 * bw} ${-382}Z`} fill={shade(top, -0.18)} />
    ) : style === "uniform" ? null : style === "jumpsuit" ? (
      <rect x={-114 * bw} y={-428} width={228 * bw} height={20} fill={shade(top, -0.2)} />
    ) : null;

  const headG = (
    <g transform={`translate(${terr} ${HEAD_Y + r.headDy}) rotate(${r.tilt + (spec.look === "up" ? -5 : 0)}) scale(${headK})`} style={{ ["--skin" as string]: skin }}>
      {back && hair.back}
      {/* ears */}
      <circle cx={-146} cy={8} r={28} fill={skinD} />
      <circle cx={146} cy={8} r={28} fill={skinD} />
      <ellipse cx={0} cy={0} rx={150} ry={156} fill={skin} />
      {/* soft shading on the shadow side + rim light */}
      <path d="M60 -140 C150 -100 170 40 100 130 C130 50 130 -60 60 -140Z" fill="#000" opacity={0.08} />
      {rim && <path d="M-118 -96 C-150 -40 -150 40 -118 96" stroke={rim} strokeWidth={9} fill="none" opacity={0.55} strokeLinecap="round" />}
      {back ? (
        <ellipse cx={0} cy={-10} rx={156} ry={162} fill={cast.hair === "bald" ? skin : hairC} />
      ) : cast.mask ? (
        <MaskFace mask={cast.mask} t={t} />
      ) : (
        <g>
          {cast.wrinkles && (
            <g stroke={skinD} strokeWidth={5} fill="none" strokeLinecap="round">
              <path d="M-60 -92 Q0 -102 60 -92 M-50 -76 Q0 -84 50 -76 M-104 20 Q-96 34 -100 48 M104 20 Q96 34 100 48" />
            </g>
          )}
          {variant !== "ghost" && <circle cx={-88} cy={50} r={24} fill="#ff7d7d" opacity={variant === "infected" ? 0 : 0.28} />}
          {variant !== "ghost" && <circle cx={88} cy={50} r={24} fill="#ff7d7d" opacity={variant === "infected" ? 0 : 0.28} />}
          <Eyes expr={expr} gaze={spec.look === "left" ? [-9, 0] : spec.look === "right" ? [9, 0] : spec.look === "up" ? [0, -11] : spec.look === "down" ? [0, 9] : spec.look === "cam" ? [0, 0] : r.gaze} blink={blink} variant={variant} seed={seed} t={t} />
          {/* brows */}
          {(() => {
            const [inner, outer] = brows(expr);
            const lift = open > 0.4 ? -4 : 0;
            const bc = cast.hair === "bald" || !cast.hairColor ? "#4a3326" : shade(hairC, -0.15);
            return (
              <g stroke={bc} strokeWidth={11} strokeLinecap="round" fill="none">
                <path d={`M-82 ${-52 + outer + lift} Q-56 ${-64 + (outer + inner) / 2 + lift} -26 ${-50 + inner + lift}`} />
                <path d={`M82 ${-52 + outer + lift} Q56 ${-64 + (outer + inner) / 2 + lift} 26 ${-50 + inner + lift}`} />
              </g>
            );
          })()}
          <path d="M-8 34 Q0 44 10 34" stroke={skinD} strokeWidth={7} fill="none" strokeLinecap="round" />
          {cast.beard === "stubble" && <path d="M-110 50 C-90 150 90 150 110 50 C80 120 -80 120 -110 50Z" fill="#000" opacity={0.12} />}
          {cast.beard === "full" && <path d="M-130 20 C-130 190 130 190 130 20 C110 80 70 60 50 105 C20 92 -20 92 -50 105 C-70 60 -110 80 -130 20Z" fill={hairC} />}
          {cast.beard === "moustache" && <path d="M-50 66 Q-25 46 0 60 Q25 46 50 66 Q25 62 0 70 Q-25 62 -50 66Z" fill={hairC} />}
          <Mouth expr={expr} open={open} t={t} variant={variant} />
          {cast.glasses && (
            <g stroke="#2b2b30" strokeWidth={7} fill="#cfe6ff" fillOpacity={0.12}>
              <circle cx={-52} cy={-5} r={42} />
              <circle cx={52} cy={-5} r={42} />
              <path d="M-10 -8 Q0 -16 10 -8" fill="none" />
            </g>
          )}
          {expr === "crying" &&
            [-60, 60].map((x, i) => {
              const k = ((t * 0.9 + i * 0.5) % 1) as number;
              return <ellipse key={x} cx={x + (x < 0 ? -10 : 10)} cy={30 + k * 110} rx={9} ry={14} fill="#7cc7ff" opacity={1 - k} />;
            })}
          {(expr === "terrified" || expr === "scared" || expr === "worried") && (
            <path d={`M118 ${-70 + ((t * 40) % 60)} q12 22 0 30 q-12 -8 0 -30Z`} fill="#9fd6ff" opacity={0.85} />
          )}
          {variant === "infected" && (
            <g fill="#c7b07a" stroke="#8d7442" strokeWidth={4}>
              <circle cx={90} cy={-110} r={34} />
              <circle cx={120} cy={-70} r={24} />
              <circle cx={60} cy={-140} r={20} />
            </g>
          )}
        </g>
      )}
      {!back && hair.front}
      {back && cast.hair === "long" && hair.back}
    </g>
  );

  // long / bob / ponytail hair hangs behind the shoulders, not over the chest
  const headBack = !back && hair.back ? (
    <g transform={`translate(${terr} ${HEAD_Y + r.headDy}) rotate(${r.tilt + (spec.look === "up" ? -5 : 0)}) scale(${headK})`}>{hair.back}</g>
  ) : null;

  const neck = (
    <g>
      <rect x={-34} y={-742} width={68} height={60} fill={skinD} />
      <rect x={-34} y={-742} width={68} height={22} fill="#000" opacity={0.12} />
    </g>
  );

  const topDetails = (() => {
    const out: React.ReactNode[] = [];
    if (style === "hoodie") {
      out.push(<path key="h" d="M-95 -706 C-90 -660 90 -660 95 -706 C70 -690 -70 -690 -95 -706Z" fill={topD} />);
      out.push(<path key="p" d={`M-70 -470 L70 -470 L80 -420 L-80 -420Z`} fill={topD} />);
      out.push(<path key="s" d="M-26 -680 L-30 -600 M26 -680 L30 -600" stroke="#eee" strokeWidth={6} />);
    } else if (style === "jacket" || style === "coat" || style === "suit") {
      out.push(<path key="in" d="M-50 -706 L0 -560 L50 -706Z" fill={cast.top2 ?? "#e9e6df"} />);
      out.push(<path key="l" d={`M-50 -706 L0 -560 L0 ${torsoBottom + 18}`} stroke={topD} strokeWidth={6} fill="none" />);
      if (style === "suit") out.push(<path key="tie" d="M-10 -690 L10 -690 L16 -600 L0 -570 L-16 -600Z" fill="#7a1f24" />);
      out.push(<path key="lap" d="M-50 -706 L-70 -640 L-30 -620 M50 -706 L70 -640 L30 -620" stroke={topD} strokeWidth={6} fill="none" />);
    } else if (style === "sweater") {
      out.push(<rect key="b1" x={-118 * bw} y={-560} width={236 * bw} height={26} fill={cast.top2 ?? "#f4efe6"} opacity={0.9} />);
      out.push(
        <g key="dots" fill={cast.top2 ?? "#f4efe6"}>
          {[-80, -40, 0, 40, 80].map((x) => (
            <path key={x} d={`M${x} -606 l12 14 l-12 14 l-12 -14Z`} />
          ))}
        </g>,
      );
    } else if (style === "jumpsuit") {
      out.push(<line key="z" x1={0} y1={-704} x2={0} y2={-420} stroke={topD} strokeWidth={6} />);
      out.push(<path key="c" d="M-60 -706 L0 -670 L60 -706" stroke={topD} strokeWidth={10} fill="none" />);
    } else if (style === "uniform") {
      out.push(<rect key="belt" x={-114 * bw} y={-430} width={228 * bw} height={26} fill="#1d1d22" />);
      out.push(<path key="c" d="M-60 -706 L0 -660 L60 -706" stroke={topD} strokeWidth={12} fill="none" />);
      out.push(<path key="st" d="M-70 -600 l14 -12 l14 12 l-6 16 h-16Z" fill="#e3c04a" />);
    } else if (style === "dress") {
      out.push(<path key="c" d="M-60 -706 Q0 -650 60 -706" stroke={topD} strokeWidth={8} fill="none" />);
    } else {
      out.push(<path key="c" d="M-56 -706 Q0 -660 56 -706" stroke={topD} strokeWidth={10} fill="none" />);
    }
    if (cast.badge) {
      out.push(
        <g key="badge">
          <rect x={30} y={-640} width={78} height={48} rx={6} fill="#f4f4f4" />
          <text x={69} y={-604} fontSize={34} fontFamily="Montserrat" fontWeight={900} textAnchor="middle" fill="#1a1a1a" transform={mirror ? "matrix(-1 0 0 1 138 0)" : undefined}>
            {cast.badge}
          </text>
        </g>,
      );
    }
    return out;
  })();

  const body = (
    <g>
      {legs}
      <g transform={`translate(0 ${by})`}>
        {back && arm(armL, sh[0], "al", false)}
        {back && arm(armR, sh[1], "ar", false)}
        {headBack}
        {neck}
        <path d={torso} fill={top} />
        <path d={`M${60 * bw} -700 C${120 * bw} -690 ${130 * bw} -600 ${110 * bw} ${torsoBottom + 20}`} stroke="#000" strokeOpacity={0.1} strokeWidth={30} fill="none" />
        {!back && hem}
        {!back && topDetails}
        {rim && <path d={`M${-124 * bw} -650 L${-110 * bw} ${torsoBottom}`} stroke={rim} strokeWidth={8} opacity={0.45} strokeLinecap="round" />}
        {headG}
        {!back && arm(armL, sh[0], "al", true)}
        {!back && arm(armR, sh[1], "ar", true)}
        {item && <HandItem item={item} at={pose === "hold" ? [(r.lh[0] + r.rh[0]) / 2, (r.lh[1] + r.rh[1]) / 2] : r.rh} t={t} />}
      </g>
    </g>
  );

  const scale = (cast.height ?? 1) * bodyK;
  return (
    <g>
      {pose !== "lie" && <ellipse cx={0} cy={0} rx={150 * bw * scale} ry={22 * scale} fill="#000" opacity={0.28} />}
      <g transform={`rotate(${r.lean}) scale(${scale})`}>
        {pose === "lie" ? (
          <g transform="translate(0 -150) rotate(-90)">
            {body}
            {/* blanket over everything below the neck */}
            <path d="M-190 -690 Q-200 -300 -170 30 L170 30 Q200 -300 190 -690 Q0 -720 -190 -690Z" fill={item ?? "#4a6fa5"} />
            <path d="M-190 -690 Q0 -720 190 -690 L190 -640 Q0 -670 -190 -640Z" fill="#f1ede4" />
          </g>
        ) : (
          body
        )}
      </g>
    </g>
  );
};

/** Screen x (0..1) of a character at progress k through the shot. */
export function charX(c: Char, progress: number): number {
  if (c.to === undefined) return c.x;
  const run = c.pose === "run";
  const k = interpolate(progress, [0, run ? 0.75 : 1], [0, 1], { ...clamp });
  return c.x + (c.to - c.x) * (k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2);
}

export { lerp, mix };
