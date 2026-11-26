import React from "react";
import { interpolate, random, useCurrentFrame, useVideoConfig, Easing } from "remotion";
import type { Accessory, Action, CastMember, Expression, Hair, ShotChar } from "../types";

// Flat "silhouette" character: big dark round head, white line-art face,
// coloured shirt, thin stick limbs. Drawn facing right; mirrored for left.
// Origin = between the feet. Scene space is 1920x1080.

const W = "#ffffff";

type Pose = {
  // shoulder angle / elbow bend for each arm (degrees, 0 = straight down, + = forward)
  l: [number, number];
  r: [number, number];
  legSwing: number; // degrees
  sit: boolean;
  bodyY: number;
  bodyRot: number;
};

const easeOut = Easing.out(Easing.cubic);

function pose(action: Action | undefined, t: number, f: number, dur: number, talking: boolean): Pose {
  const p: Pose = { l: [-8, 6], r: [8, 6], legSwing: 0, sit: false, bodyY: 0, bodyRot: 0 };
  const breathe = Math.sin(t * 2.2) * 2.5;
  p.bodyY = breathe;
  if (talking) {
    p.r = [20 + Math.sin(t * 5) * 10, 50 + Math.sin(t * 4) * 15];
  }
  switch (action) {
    case "walk":
    case "enter-left":
    case "enter-right":
    case "exit-left":
    case "exit-right": {
      const moving =
        action === "walk" ||
        (action.startsWith("enter") && f < 24) ||
        (action.startsWith("exit") && f > dur * 0.3);
      if (moving) {
        const s = Math.sin(t * 9);
        p.legSwing = s * 24;
        p.l = [s * 22, 10];
        p.r = [-s * 22, 10];
        p.bodyY = -Math.abs(Math.cos(t * 9)) * 7;
      }
      break;
    }
    case "run": {
      const s = Math.sin(t * 15);
      p.legSwing = s * 38;
      p.l = [s * 45, 70];
      p.r = [-s * 45, 70];
      p.bodyY = -Math.abs(Math.cos(t * 15)) * 14;
      p.bodyRot = 6;
      break;
    }
    case "jump": {
      const h = Math.abs(Math.sin(t * 5.5));
      p.bodyY = -h * 90;
      p.l = [-150 + h * 20, -10];
      p.r = [150 - h * 20, 10];
      p.legSwing = 0;
      break;
    }
    case "celebrate": {
      const pump = Math.sin(t * 8) * 12;
      p.l = [-160 + pump, -15];
      p.r = [160 - pump, 15];
      p.bodyY = -Math.abs(Math.sin(t * 4)) * 25;
      break;
    }
    case "wave": {
      p.r = [150 + Math.sin(t * 10) * 22, 20];
      break;
    }
    case "point": {
      p.r = [95, 0];
      break;
    }
    case "facepalm": {
      p.r = [55, 125];
      p.bodyRot = 4;
      break;
    }
    case "shrug": {
      p.l = [-40, -100];
      p.r = [40, 100];
      p.bodyY = -Math.abs(Math.sin(t * 3)) * 8;
      break;
    }
    case "phone": {
      p.r = [40, 115];
      break;
    }
    case "sit": {
      p.sit = true;
      p.l = [-10, 40];
      p.r = [10, 40];
      break;
    }
    case "shake": {
      p.bodyRot = Math.sin(t * 40) * 3;
      p.l = [-25, 30];
      p.r = [25, 30];
      break;
    }
    case "fall": {
      // tip over backwards around the feet, then a small bounce on the floor
      const k = interpolate(f, [6, 16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.quad) });
      const bounce = f > 16 ? Math.abs(Math.sin((f - 16) / 3)) * Math.exp(-(f - 16) / 6) * 6 : 0;
      p.bodyRot = -k * 84 + bounce;
      p.l = [-60 * k, 0];
      p.r = [60 * k, 0];
      p.legSwing = k * 10;
      break;
    }
  }
  return p;
}

// ---------- face ----------

const Eyes: React.FC<{ expr: Expression; blink: boolean; look: number }> = ({ expr, blink, look }) => {
  const xs = [-34, 30];
  const y = -372;
  const stroke = { stroke: W, strokeWidth: 7, strokeLinecap: "round" as const, fill: "none" };
  const pupil = (x: number, r = 7) => (
    <g>
      <circle cx={x + look} cy={y + 2} r={r} fill="#000" />
      <circle cx={x + look + r * 0.35} cy={y + 2 - r * 0.4} r={Math.max(1.6, r * 0.32)} fill="#fff" />
    </g>
  );
  const out: React.ReactNode[] = [];
  xs.forEach((x, i) => {
    const k = `e${i}`;
    const inner = i === 0 ? 1 : -1; // direction toward nose
    if (blink && !["happy", "grin", "crying", "sleepy", "love", "cringe"].includes(expr)) {
      out.push(<path key={k} d={`M ${x - 12} ${y} L ${x + 12} ${y}`} {...stroke} />);
      return;
    }
    switch (expr) {
      case "happy":
      case "grin":
        out.push(<path key={k} d={`M ${x - 14} ${y + 5} Q ${x} ${y - 15} ${x + 14} ${y + 5}`} {...stroke} />);
        break;
      case "crying":
        out.push(<path key={k} d={`M ${x - 14} ${y - 4} Q ${x} ${y + 12} ${x + 14} ${y - 4}`} {...stroke} />);
        break;
      case "sleepy":
        out.push(<path key={k} d={`M ${x - 13} ${y + 2} Q ${x} ${y + 9} ${x + 13} ${y + 2}`} {...stroke} />);
        break;
      case "cringe":
        out.push(
          <path
            key={k}
            d={i === 0 ? `M ${x - 12} ${y - 10} L ${x + 10} ${y} L ${x - 12} ${y + 10}` : `M ${x + 12} ${y - 10} L ${x - 10} ${y} L ${x + 12} ${y + 10}`}
            {...stroke}
          />,
        );
        break;
      case "love":
        out.push(
          <path
            key={k}
            d={`M ${x} ${y + 12} C ${x - 22} ${y - 2} ${x - 12} ${y - 20} ${x} ${y - 8} C ${x + 12} ${y - 20} ${x + 22} ${y - 2} ${x} ${y + 12} Z`}
            fill="#ff4d7a"
          />,
        );
        break;
      case "shocked":
        out.push(
          <g key={k}>
            <circle cx={x} cy={y} r={21} fill={W} />
            {pupil(x, 4.5)}
          </g>,
        );
        break;
      case "smug":
      case "determined":
        out.push(
          <g key={k}>
            <path d={`M ${x - 13} ${y} A 13 13 0 0 0 ${x + 13} ${y} Z`} fill={W} />
            <circle cx={x + look} cy={y + 4} r={6} fill="#000" />
            <circle cx={x + look + 2} cy={y + 2} r={1.8} fill="#fff" />
            <path d={`M ${x - 15} ${y} L ${x + 15} ${y}`} {...stroke} strokeWidth={6} />
          </g>,
        );
        break;
      default:
        out.push(
          <g key={k}>
            <ellipse cx={x} cy={y} rx={13} ry={17} fill={W} />
            {pupil(x)}
          </g>,
        );
    }
    // brows
    const by = y - 28;
    let brow: string | null = null;
    if (expr === "angry" || expr === "determined") brow = `M ${x - 16} ${by - 8 * inner * -1 - 4} L ${x + 16} ${by + 8 * inner * -1 - 4}`;
    if (expr === "angry") brow = i === 0 ? `M ${x - 16} ${by - 8} L ${x + 14} ${by + 6}` : `M ${x - 14} ${by + 6} L ${x + 16} ${by - 8}`;
    if (expr === "determined") brow = i === 0 ? `M ${x - 16} ${by - 3} L ${x + 14} ${by + 4}` : `M ${x - 14} ${by + 4} L ${x + 16} ${by - 3}`;
    if (expr === "sad" || expr === "crying" || expr === "nervous")
      brow = i === 0 ? `M ${x - 15} ${by + 6} L ${x + 13} ${by - 6}` : `M ${x - 13} ${by - 6} L ${x + 15} ${by + 6}`;
    if (expr === "shocked") brow = `M ${x - 15} ${by - 10} Q ${x} ${by - 20} ${x + 15} ${by - 10}`;
    if (expr === "confused") brow = i === 0 ? `M ${x - 15} ${by - 12} Q ${x} ${by - 22} ${x + 15} ${by - 10}` : `M ${x - 14} ${by + 2} L ${x + 14} ${by + 2}`;
    if (expr === "smug") brow = i === 0 ? `M ${x - 15} ${by - 2} L ${x + 14} ${by - 6}` : `M ${x - 14} ${by - 12} Q ${x} ${by - 18} ${x + 15} ${by - 8}`;
    if (brow) out.push(<path key={`b${i}`} d={brow} {...stroke} strokeWidth={6} />);
  });
  return <>{out}</>;
};

const Mouth: React.FC<{ expr: Expression; open: number }> = ({ expr, open }) => {
  const x = 0;
  const y = -320;
  const stroke = { stroke: W, strokeWidth: 7, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, fill: "none" };
  if (open > 0.15) {
    const big = expr === "shocked" || expr === "angry" || expr === "crying";
    return <ellipse cx={x} cy={y + 2} rx={big ? 17 : 13} ry={4 + open * (big ? 16 : 11)} fill="#5a1220" stroke={W} strokeWidth={5} />;
  }
  switch (expr) {
    case "happy":
    case "love":
      return <path d={`M ${x - 22} ${y - 6} Q ${x} ${y + 18} ${x + 22} ${y - 6}`} {...stroke} />;
    case "grin":
      return <path d={`M ${x - 26} ${y - 8} Q ${x} ${y + 26} ${x + 26} ${y - 8} Z`} fill={W} />;
    case "smug":
      return <path d={`M ${x - 18} ${y + 2} Q ${x + 4} ${y + 10} ${x + 22} ${y - 8}`} {...stroke} />;
    case "sad":
    case "crying":
      return <path d={`M ${x - 18} ${y + 8} Q ${x} ${y - 10} ${x + 18} ${y + 8}`} {...stroke} />;
    case "shocked":
      return <ellipse cx={x} cy={y + 2} rx={14} ry={18} fill="#5a1220" stroke={W} strokeWidth={5} />;
    case "angry":
      return <path d={`M ${x - 20} ${y + 6} L ${x - 8} ${y} L ${x + 8} ${y} L ${x + 20} ${y + 6}`} {...stroke} />;
    case "nervous":
      return <path d={`M ${x - 22} ${y} q 5.5 -7 11 0 t 11 0 t 11 0 t 11 0`} {...stroke} strokeWidth={6} />;
    case "confused":
      return <path d={`M ${x - 16} ${y + 4} L ${x + 16} ${y - 4}`} {...stroke} />;
    case "sleepy":
      return <ellipse cx={x} cy={y} rx={7} ry={8} fill="none" stroke={W} strokeWidth={5} />;
    case "determined":
      return <path d={`M ${x - 18} ${y} L ${x + 18} ${y - 2}`} {...stroke} />;
    case "cringe":
      return (
        <g>
          <rect x={x - 26} y={y - 10} width={52} height={20} rx={6} fill={W} />
          <path d={`M ${x - 26} ${y} H ${x + 26} M ${x - 9} ${y - 10} V ${y + 10} M ${x + 9} ${y - 10} V ${y + 10}`} stroke="#222" strokeWidth={3} />
        </g>
      );
    default:
      return <path d={`M ${x - 14} ${y} L ${x + 14} ${y}`} {...stroke} />;
  }
};

// ---------- hair & accessories ----------

const HEAD_Y = -365;
const HEAD_R = 95;

function spikes(n: number, r1: number, r2: number, a0: number, a1: number, cy = HEAD_Y) {
  let d = "";
  for (let i = 0; i <= n * 2; i++) {
    const a = a0 + ((a1 - a0) * i) / (n * 2);
    const r = i % 2 === 0 ? r1 : r2;
    const px = Math.cos((a * Math.PI) / 180) * r;
    const py = cy + Math.sin((a * Math.PI) / 180) * r;
    d += `${i === 0 ? "M" : "L"} ${px.toFixed(1)} ${py.toFixed(1)} `;
  }
  // curved hairline back to the start instead of a straight "hat brim"
  const sx = Math.cos((a0 * Math.PI) / 180) * r1;
  const sy = cy + Math.sin((a0 * Math.PI) / 180) * r1;
  const midY = cy + Math.sin((((a0 + a1) / 2) * Math.PI) / 180) * r1 * 0.62;
  return d + `Q ${((sx + Math.cos((a1 * Math.PI) / 180) * r1) / 2).toFixed(1)} ${midY.toFixed(1)} ${sx.toFixed(1)} ${sy.toFixed(1)} Z`;
}

const HairBack: React.FC<{ hair: Hair; color: string; t: number }> = ({ hair, color, t }) => {
  switch (hair) {
    case "afro":
      return <circle cx={-8} cy={HEAD_Y - 30} r={135} fill={color} />;
    case "long":
      return <path d={`M -105 ${HEAD_Y - 10} Q -115 ${HEAD_Y + 130} -80 ${HEAD_Y + 175} L 70 ${HEAD_Y + 175} Q 110 ${HEAD_Y + 120} 100 ${HEAD_Y - 10} Z`} fill={color} />;
    case "bob":
      return <path d={`M -112 ${HEAD_Y - 20} Q -120 ${HEAD_Y + 80} -90 ${HEAD_Y + 85} L 85 ${HEAD_Y + 85} Q 115 ${HEAD_Y + 70} 108 ${HEAD_Y - 20} Z`} fill={color} />;
    case "ponytail": {
      const sw = Math.sin(t * 3) * 8;
      return <path d={`M -80 ${HEAD_Y - 40} Q ${-180 + sw} ${HEAD_Y + 10} ${-150 + sw} ${HEAD_Y + 130} Q ${-120 + sw} ${HEAD_Y + 40} -60 ${HEAD_Y - 10} Z`} fill={color} />;
    }
    default:
      return null;
  }
};

const HairFront: React.FC<{ hair: Hair; color: string; t: number }> = ({ hair, color }) => {
  const edge = { stroke: "rgba(255,255,255,0.12)", strokeWidth: 2 };
  switch (hair) {
    case "spiky":
      return <path d={spikes(9, 100, 128, 190, 350, HEAD_Y - 8)} fill={color} {...edge} />;
    case "mohawk":
      return <path d={spikes(5, 85, 135, 235, 305, HEAD_Y - 5)} fill={color} />;
    case "curly":
      return (
        <g fill={color}>
          {Array.from({ length: 11 }).map((_, i) => {
            const a = ((200 + i * 14) * Math.PI) / 180;
            return <circle key={i} cx={Math.cos(a) * 95} cy={HEAD_Y + Math.sin(a) * 95} r={24} />;
          })}
        </g>
      );
    case "beanie":
      return (
        <g>
          <path d={`M -100 ${HEAD_Y - 18} A 102 102 0 0 1 102 ${HEAD_Y - 18} Z`} fill={color} />
          <rect x={-106} y={HEAD_Y - 40} width={212} height={34} rx={14} fill={color} stroke="rgba(0,0,0,0.25)" strokeWidth={3} />
          {Array.from({ length: 9 }).map((_, i) => (
            <line key={i} x1={-88 + i * 22} y1={HEAD_Y - 36} x2={-88 + i * 22} y2={HEAD_Y - 10} stroke="rgba(0,0,0,0.22)" strokeWidth={4} />
          ))}
        </g>
      );
    case "cap":
      return (
        <g>
          <path d={`M -98 ${HEAD_Y - 22} A 100 100 0 0 1 100 ${HEAD_Y - 22} Z`} fill={color} />
          <path d={`M 40 ${HEAD_Y - 28} Q 150 ${HEAD_Y - 40} 165 ${HEAD_Y - 14} L 60 ${HEAD_Y - 14} Z`} fill={color} stroke="rgba(0,0,0,0.3)" strokeWidth={3} />
        </g>
      );
    case "long":
    case "bob":
    case "ponytail":
      return <path d={`M -100 ${HEAD_Y - 10} Q -80 ${HEAD_Y - 120} 20 ${HEAD_Y - 102} Q 100 ${HEAD_Y - 95} 104 ${HEAD_Y - 20} Q 40 ${HEAD_Y - 75} -100 ${HEAD_Y - 10} Z`} fill={color} />;
    case "bun":
      return (
        <g fill={color}>
          <circle cx={-10} cy={HEAD_Y - 112} r={42} />
          <path d={`M -100 ${HEAD_Y - 10} Q -80 ${HEAD_Y - 118} 20 ${HEAD_Y - 100} Q 100 ${HEAD_Y - 92} 102 ${HEAD_Y - 22} Q 30 ${HEAD_Y - 70} -100 ${HEAD_Y - 10} Z`} />
        </g>
      );
    case "slick":
      return (
        <g>
          <path d={`M -98 ${HEAD_Y - 20} Q -60 ${HEAD_Y - 130} 70 ${HEAD_Y - 105} Q 120 ${HEAD_Y - 80} 100 ${HEAD_Y - 30} Q 20 ${HEAD_Y - 80} -98 ${HEAD_Y - 20} Z`} fill={color} />
          <path d={`M -40 ${HEAD_Y - 95} Q 20 ${HEAD_Y - 112} 70 ${HEAD_Y - 92}`} stroke="rgba(255,255,255,0.35)" strokeWidth={5} fill="none" />
        </g>
      );
    default:
      return null;
  }
};

const Accessories: React.FC<{ list: Accessory[]; t: number }> = ({ list }) => (
  <>
    {list.includes("glasses") && (
      <g stroke={W} strokeWidth={5} fill="rgba(255,255,255,0.08)">
        <rect x={-58} y={-392} width={46} height={38} rx={10} />
        <rect x={7} y={-392} width={46} height={38} rx={10} />
        <path d="M -12 -376 L 7 -376" fill="none" />
      </g>
    )}
    {list.includes("sunglasses") && (
      <g>
        <path d="M -62 -392 H 58 L 54 -372 Q 40 -350 14 -356 L 6 -374 H -10 L -18 -356 Q -50 -350 -58 -372 Z" fill="#050505" stroke={W} strokeWidth={4} />
        <path d="M -48 -384 L -30 -384" stroke="rgba(255,255,255,0.6)" strokeWidth={4} />
      </g>
    )}
    {list.includes("headphones") && (
      <g>
        <path d={`M -100 ${HEAD_Y} A 102 108 0 0 1 102 ${HEAD_Y}`} stroke="#e8e8e8" strokeWidth={14} fill="none" />
        <rect x={-118} y={HEAD_Y - 18} width={30} height={56} rx={12} fill="#e94560" />
        <rect x={90} y={HEAD_Y - 18} width={30} height={56} rx={12} fill="#e94560" />
      </g>
    )}
    {list.includes("earrings") && <circle cx={-92} cy={-322} r={9} fill="#f5c542" />}
    {list.includes("crown") && (
      <path d={`M -60 ${HEAD_Y - 88} L -70 ${HEAD_Y - 150} L -30 ${HEAD_Y - 115} L 0 ${HEAD_Y - 165} L 30 ${HEAD_Y - 115} L 70 ${HEAD_Y - 150} L 60 ${HEAD_Y - 88} Z`} fill="#f5c542" stroke="#b8860b" strokeWidth={4} />
    )}
    {list.includes("bow") && (
      <g fill="#ff6fa5">
        <path d={`M 40 ${HEAD_Y - 92} L 0 ${HEAD_Y - 120} L 0 ${HEAD_Y - 70} Z`} />
        <path d={`M 40 ${HEAD_Y - 92} L 80 ${HEAD_Y - 120} L 80 ${HEAD_Y - 66} Z`} />
        <circle cx={40} cy={HEAD_Y - 93} r={11} />
      </g>
    )}
  </>
);

// ---------- fx ----------

const Fx: React.FC<{ fx: NonNullable<ShotChar["fx"]>; t: number; f: number }> = ({ fx, t, f }) => {
  const pop = interpolate(f, [0, 8], [0, 1], { extrapolateRight: "clamp", easing: Easing.out(Easing.back(2)) });
  return (
    <>
      {fx.includes("sweat") && (
        <path
          d={`M 95 ${-420 + ((t * 40) % 50)} q 12 20 0 26 q -12 -6 0 -26 Z`}
          fill="#7fd3ff"
          opacity={0.95}
        />
      )}
      {fx.includes("tears") &&
        [-34, 30].map((x) => (
          <g key={x}>
            <rect x={x - 6} y={-360} width={12} height={110} rx={6} fill="#5ec8ff" opacity={0.85} />
            <circle cx={x} cy={-360 + ((t * 160 + x) % 120)} r={8} fill="#a6e3ff" />
          </g>
        ))}
      {fx.includes("blush") &&
        [-52, 50].map((x) => <ellipse key={x} cx={x} cy={-340} rx={18} ry={9} fill="#ff5d7d" opacity={0.65} />)}
      {fx.includes("anger") && (
        <g transform={`translate(70 ${-470}) scale(${pop})`} stroke="#ff3b3b" strokeWidth={8} fill="none" strokeLinecap="round">
          <path d="M -20 -6 Q -6 -6 -6 -20 M 6 -20 Q 6 -6 20 -6 M 20 6 Q 6 6 6 20 M -6 20 Q -6 6 -20 6" />
        </g>
      )}
      {fx.includes("question") && (
        <text x={0} y={-500} transform={`translate(0 ${(1 - pop) * 30})`} opacity={pop} fontSize={110} fontWeight={900} fill={W} textAnchor="middle" fontFamily="Montserrat" stroke="#000" strokeWidth={6} paintOrder="stroke">
          ?
        </text>
      )}
      {fx.includes("exclaim") && (
        <text x={0} y={-500} transform={`scale(${0.6 + pop * 0.4})`} opacity={pop} fontSize={120} fontWeight={900} fill="#ffd400" textAnchor="middle" fontFamily="Montserrat" stroke="#000" strokeWidth={6} paintOrder="stroke">
          !
        </text>
      )}
      {fx.includes("zzz") &&
        [0, 1, 2].map((i) => {
          const k = ((t * 0.7 + i / 3) % 1);
          return (
            <text key={i} x={60 + k * 80} y={-470 - k * 120} fontSize={40 + k * 30} opacity={1 - k} fill={W} fontWeight={900} fontFamily="Montserrat">
              z
            </text>
          );
        })}
      {fx.includes("hearts") &&
        [0, 1, 2, 3].map((i) => {
          const k = (t * 0.6 + i / 4) % 1;
          const x = Math.sin(i * 2.1 + t * 2) * 70;
          return (
            <path
              key={i}
              transform={`translate(${x} ${-480 - k * 160}) scale(${0.8 + k * 0.6})`}
              opacity={1 - k}
              d="M 0 14 C -26 -4 -14 -26 0 -12 C 14 -26 26 -4 0 14 Z"
              fill="#ff4d7a"
            />
          );
        })}
      {(fx.includes("sparkle") || fx.includes("stars")) &&
        Array.from({ length: 6 }).map((_, i) => {
          const a = t * (fx.includes("stars") ? 3 : 0.8) + (i * Math.PI) / 3;
          const r = fx.includes("stars") ? 80 : 150 + Math.sin(t * 3 + i) * 25;
          const cy = fx.includes("stars") ? -480 : -300;
          const tw = 0.6 + 0.4 * Math.sin(t * 8 + i * 1.7);
          return <Star key={i} x={Math.cos(a) * r * (fx.includes("stars") ? 1 : 0.9)} y={cy + Math.sin(a) * r * (fx.includes("stars") ? 0.3 : 1)} s={tw * 18} color={fx.includes("stars") ? "#ffd400" : "#fff6b0"} />;
        })}
    </>
  );
};

export const Star: React.FC<{ x: number; y: number; s: number; color?: string }> = ({ x, y, s, color = "#fff" }) => (
  <path
    transform={`translate(${x} ${y}) scale(${s / 10})`}
    d="M 0 -10 Q 1.5 -1.5 10 0 Q 1.5 1.5 0 10 Q -1.5 1.5 -10 0 Q -1.5 -1.5 0 -10 Z"
    fill={color}
  />
);

// ---------- colour helpers ----------

function mixHex(hex: string, target: number, k: number) {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const n = parseInt(full, 16);
  const ch = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((c) => Math.round(c + (target - c) * k));
  return `rgb(${ch.join(",")})`;
}
const lighten = (hex: string, k: number) => mixHex(hex, 255, k);
const darken = (hex: string, k: number) => mixHex(hex, 0, k);

// ---------- limb helpers ----------

function Arm({ sx, sy, a1, a2, color, sleeve, len = 118 }: { sx: number; sy: number; a1: number; a2: number; color: string; sleeve: string; len?: number }) {
  // angles: 0 = straight down, positive rotates toward +x (forward)
  const r1 = (a1 * Math.PI) / 180;
  const ex = sx + Math.sin(r1) * (len / 2);
  const ey = sy + Math.cos(r1) * (len / 2);
  const r2 = ((a1 + a2) * Math.PI) / 180;
  const hx = ex + Math.sin(r2) * (len / 2);
  const hy = ey + Math.cos(r2) * (len / 2);
  return (
    <g strokeLinecap="round" fill="none">
      <path d={`M ${sx} ${sy} L ${ex} ${ey} L ${hx} ${hy}`} stroke={color} strokeWidth={18} strokeLinejoin="round" />
      <path d={`M ${sx} ${sy} L ${sx + (ex - sx) * 0.62} ${sy + (ey - sy) * 0.62}`} stroke={sleeve} strokeWidth={34} />
      <circle cx={hx} cy={hy} r={14} fill={color} />
      <circle cx={hx - 4} cy={hy - 4} r={4} fill="rgba(255,255,255,0.10)" />
    </g>
  );
}

// ---------- main ----------

export const Character: React.FC<{
  spec: ShotChar;
  member?: CastMember;
  talking: boolean;
  shotDur: number;
  seed: number;
}> = ({ spec, member, talking, shotDur, seed }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps + seed * 1.37;
  const isExtra = !member;
  const m: CastMember = member ?? {
    name: "",
    hair: (["none", "spiky", "long", "bun", "curly", "cap"] as Hair[])[Math.floor(random(`h${seed}`) * 6)],
    shirt: ["#4b2e39", "#3d3550", "#2f4050", "#523a2c"][Math.floor(random(`s${seed}`) * 4)],
    skin: "#2a1a20",
  };
  const skin = m.skin ?? "#0d0d0d";
  const shirt = m.shirt ?? "#f2c230";
  const hairColor = m.hairColor ?? (m.hair === "beanie" ? "#e0362c" : m.hair === "cap" ? "#2b6cb0" : skin === "#0d0d0d" ? "#141414" : skin);
  const expr: Expression = spec.expr ?? "neutral";
  const action = spec.action ?? (talking ? "talk" : "idle");
  const p = pose(action, t, frame, shotDur, talking);
  const facing = spec.facing ?? "front";

  // talking mouth: syllable-ish open/close
  const open = talking ? Math.max(0, Math.sin(t * 17) * 0.6 + Math.sin(t * 7.3) * 0.5) : 0;
  const blinkPeriod = 3.1 + random(`b${seed}`) * 1.5;
  const blink = (t % blinkPeriod) < 0.12;
  const look = facing === "front" ? 0 : 4;

  // teen proportions (~17 years): long legs, longer torso, smaller head (~29% of height)
  const legLen = p.sit ? 0 : 205;
  const hipY = -205;
  const UPPER = "translate(0 -65) translate(0 -124) scale(0.94 1.15) translate(0 124)";
  const legColor = m.pants ?? skin;
  const dress = m.shirtStyle === "dress";
  const shoe = isExtra ? skin : m.shirtStyle === "suit" ? "#1b1b1f" : "#f3f3f3";
  const sole = isExtra ? skin : m.shirtStyle === "suit" ? "#000" : "#c9c9c9";
  const gid = `c${seed}`;

  const defs = (
    <defs>
      <radialGradient id={`${gid}head`} cx="38%" cy="32%" r="75%">
        <stop offset="0" stopColor={lighten(skin, 0.16)} />
        <stop offset="0.6" stopColor={skin} />
        <stop offset="1" stopColor={darken(skin, 0.35)} />
      </radialGradient>
      <linearGradient id={`${gid}shade`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#fff" stopOpacity={0.10} />
        <stop offset="0.5" stopColor="#000" stopOpacity={0} />
        <stop offset="1" stopColor="#000" stopOpacity={0.22} />
      </linearGradient>
    </defs>
  );

  const body = (
    <g transform={`translate(0 ${p.bodyY + (p.sit ? 135 : 0)}) rotate(${p.bodyRot} 0 ${action === "fall" ? -20 : -205})`}>
      {/* legs */}
      {p.sit ? (
        <g stroke={legColor} strokeWidth={20} strokeLinecap="round" fill="none" transform="translate(0 -65)">
          <path d="M -18 -140 L 60 -140 L 62 -76" />
          <path d="M 18 -140 L 95 -140 L 97 -76" />
          <path d="M 42 -62 Q 42 -80 58 -80 Q 80 -78 82 -62 Z M 77 -62 Q 77 -80 93 -80 Q 115 -78 117 -62 Z" fill={shoe} stroke="none" />
        </g>
      ) : (
        <g>
          {[-1, 1].map((side) => {
            const a = ((side === -1 ? p.legSwing : -p.legSwing) * Math.PI) / 180;
            const fx = side * 22 + Math.sin(a) * legLen;
            const fy = hipY + Math.cos(a) * legLen;
            return (
              <g key={side}>
                <line x1={side * 22} y1={hipY} x2={fx} y2={fy - 6} stroke={legColor} strokeWidth={dress ? 15 : 20} strokeLinecap="round" />
                <path d={`M ${fx - 16} ${fy + 4} Q ${fx - 16} ${fy - 14} ${fx + 2} ${fy - 14} Q ${fx + 26} ${fy - 12} ${fx + 30} ${fy + 4} Z`} fill={shoe} />
                <rect x={fx - 17} y={fy + 1} width={48} height={6} rx={3} fill={sole} />
              </g>
            );
          })}
        </g>
      )}
      <g transform={UPPER}>
      {/* back arm */}
      <Arm sx={-52} sy={-268} a1={p.l[0]} a2={p.l[1]} color={skin} sleeve={shirt} />
      <rect x={-17} y={-305} width={34} height={22} rx={8} fill={skin} />
      {/* torso */}
      {dress ? (
        <path d="M -60 -290 Q 0 -305 60 -290 L 95 -105 Q 0 -90 -95 -105 Z" fill={shirt} />
      ) : (
        <path d="M -40 -294 Q -76 -292 -76 -258 L -68 -146 Q -66 -124 -44 -124 L 44 -124 Q 66 -124 68 -146 L 76 -258 Q 76 -292 40 -294 Z" fill={shirt} />
      )}
      <path
        d={dress ? "M -60 -290 Q 0 -305 60 -290 L 95 -105 Q 0 -90 -95 -105 Z" : "M -40 -294 Q -76 -292 -76 -258 L -68 -146 Q -66 -124 -44 -124 L 44 -124 Q 66 -124 68 -146 L 76 -258 Q 76 -292 40 -294 Z"}
        fill={`url(#${gid}shade)`}
      />
      <path d="M -60 -284 Q -70 -270 -70 -250" stroke="rgba(255,255,255,0.28)" strokeWidth={6} strokeLinecap="round" fill="none" />
      {(!m.shirtStyle || m.shirtStyle === "tee") && <path d="M -26 -293 Q 0 -268 26 -293" stroke="rgba(0,0,0,0.28)" strokeWidth={7} fill="none" strokeLinecap="round" />}
      {m.shirtStyle === "hoodie" && (
        <g>
          <path d="M -50 -292 Q 0 -250 50 -292" stroke="rgba(0,0,0,0.25)" strokeWidth={10} fill="none" />
          <path d="M -12 -268 L -14 -225 M 12 -268 L 14 -225" stroke="rgba(255,255,255,0.7)" strokeWidth={5} />
          <rect x={-40} y={-190} width={80} height={38} rx={14} fill="rgba(0,0,0,0.15)" />
        </g>
      )}
      {m.shirtStyle === "suit" && (
        <g>
          <path d="M -26 -292 L 0 -230 L 26 -292 Z" fill="#f4f4f4" />
          <path d="M -6 -282 L 6 -282 L 10 -215 L 0 -200 L -10 -215 Z" fill="#c0392b" />
          <path d="M -26 -292 L 0 -230 M 26 -292 L 0 -230" stroke="rgba(0,0,0,0.35)" strokeWidth={5} />
        </g>
      )}
      {m.shirtStyle === "jacket" && <path d="M 0 -290 L 0 -126" stroke="rgba(0,0,0,0.35)" strokeWidth={8} />}
      {m.accessories?.includes("chain") && <path d="M -40 -288 Q 0 -215 40 -288" stroke="#f5c542" strokeWidth={7} fill="none" />}
      {m.accessories?.includes("tie") && <path d="M -7 -285 L 7 -285 L 11 -210 L 0 -196 L -11 -210 Z" fill="#c0392b" />}
      </g>
      {/* head */}
      <g transform={`translate(0 -392) scale(0.8) translate(0 290) translate(0 ${Math.sin(t * 2.2 + 1) * 1.5}) rotate(${(talking ? Math.sin(t * 3.1) * 3 : Math.sin(t * 0.9 + seed) * 1.2).toFixed(2)} 0 -290)`}>
        {m.hair && <HairBack hair={m.hair} color={hairColor} t={t} />}
        <circle cx={0} cy={HEAD_Y} r={HEAD_R} fill={`url(#${gid}head)`} />
        <path d={`M ${-HEAD_R * 0.72} ${HEAD_Y - HEAD_R * 0.5} A ${HEAD_R * 0.9} ${HEAD_R * 0.9} 0 0 1 ${-HEAD_R * 0.05} ${HEAD_Y - HEAD_R * 0.88}`} stroke="rgba(255,255,255,0.10)" strokeWidth={8} strokeLinecap="round" fill="none" />
        {!isExtra && (
          <g transform={`translate(${facing === "front" ? 0 : 20} 0)`}>
            <Eyes expr={expr} blink={blink} look={look} />
            <Mouth expr={expr} open={open} />
            <Accessories list={m.accessories ?? []} t={t} />
          </g>
        )}
        {m.hair && <HairFront hair={m.hair} color={hairColor} t={t} />}
        {spec.fx && <Fx fx={spec.fx} t={t} f={frame} />}
      </g>
      <g transform={UPPER}>
      {/* front arm (+ phone) */}
      <Arm sx={52} sy={-268} a1={p.r[0]} a2={p.r[1]} color={skin} sleeve={shirt} />
      {action === "phone" && (() => {
        const r1 = (p.r[0] * Math.PI) / 180;
        const ex = 52 + Math.sin(r1) * 59;
        const ey = -268 + Math.cos(r1) * 59;
        const r2 = ((p.r[0] + p.r[1]) * Math.PI) / 180;
        return <rect x={ex + Math.sin(r2) * 59 - 18} y={ey + Math.cos(r2) * 59 - 50} width={36} height={64} rx={7} fill="#1b1b1f" stroke="#cfd8ff" strokeWidth={4} />;
      })()}
      </g>
    </g>
  );

  const glow = spec.glow ? (
    <g>
      <defs>
        <radialGradient id={`glow${seed}`}>
          <stop offset="0%" stopColor="#fff3a0" stopOpacity={0.85} />
          <stop offset="100%" stopColor="#ffd400" stopOpacity={0} />
        </radialGradient>
      </defs>
      <ellipse cx={0} cy={-300} rx={230 + Math.sin(t * 4) * 15} ry={360} fill={`url(#glow${seed})`} />
      {Array.from({ length: 8 }).map((_, i) => {
        const k = (t * 0.5 + i / 8) % 1;
        return <Star key={i} x={Math.sin(i * 2.4) * 170} y={-60 - k * 520} s={(1 - Math.abs(k - 0.5) * 2) * 22} color="#fff6b0" />;
      })}
    </g>
  ) : null;

  return (
    <g>
      {defs}
      {glow}
      <g transform={facing === "left" ? "scale(-1 1)" : undefined}>{body}</g>
    </g>
  );
};

/** x position over the shot for movement actions (0..1 scene units). */
export function charX(spec: ShotChar, frame: number, dur: number): number {
  const a = spec.action;
  const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
  if ((a === "walk" || a === "run") && spec.to !== undefined) {
    const end = a === "run" ? Math.max(12, dur * 0.6) : dur;
    return interpolate(frame, [0, end], [spec.x, spec.to], { ...clamp, easing: Easing.inOut(Easing.sin) });
  }
  if (a === "enter-left") return interpolate(frame, [0, 24], [-0.15, spec.x], { ...clamp, easing: easeOut });
  if (a === "enter-right") return interpolate(frame, [0, 24], [1.15, spec.x], { ...clamp, easing: easeOut });
  if (a === "exit-left") return interpolate(frame, [dur * 0.3, dur], [spec.x, -0.2], { ...clamp, easing: Easing.in(Easing.quad) });
  if (a === "exit-right") return interpolate(frame, [dur * 0.3, dur], [spec.x, 1.2], { ...clamp, easing: Easing.in(Easing.quad) });
  if (a === "shake") return spec.x + Math.sin(frame * 2.3) * 0.004;
  return spec.x;
}

export function charFacing(spec: ShotChar): "left" | "right" | "front" {
  if (spec.facing) return spec.facing;
  const a = spec.action;
  if ((a === "walk" || a === "run") && spec.to !== undefined) return spec.to < spec.x ? "left" : "right";
  if (a === "enter-left" || a === "exit-right") return "right";
  if (a === "enter-right" || a === "exit-left") return "left";
  return "front";
}
