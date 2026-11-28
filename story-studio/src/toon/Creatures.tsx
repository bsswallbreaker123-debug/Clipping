import React from "react";
import type { Creature } from "./types";
import { rnd, shade, wob } from "./util";

// Original creature designs drawn from folklore (public domain myths), not from any film or game.
// Local space like Person: feet at 0, y up negative. headY = where close-ups centre.

export const CREATURE_HEAD: Record<Creature["type"], number> = {
  horned: -1180,
  wendigo: -1500,
  ghost: -830,
  shade: -1250,
  owl: -980,
  hollow: -1240,
};

const Fur: React.FC<{ cx: number; cy: number; rx: number; ry: number; n: number; col: string; t: number; seed: number; len?: number }> = ({ cx, cy, rx, ry, n, col, t, seed, len = 70 }) => (
  <g>
    {Array.from({ length: n }).map((_, i) => {
      const a = rnd(seed + i) * Math.PI * 2;
      const rr = Math.sqrt(rnd(seed + i * 3.1));
      const x = cx + Math.cos(a) * rx * rr;
      const y = cy + Math.sin(a) * ry * rr;
      const sway = Math.sin(t * 2.2 + i * 0.7) * 8;
      const l = len * (0.6 + rnd(seed + i * 5.3) * 0.8);
      return (
        <path
          key={i}
          d={`M${x - 10} ${y} Q${x + sway} ${y + l * 0.5} ${x + sway * 1.6} ${y + l} Q${x + 4} ${y + l * 0.5} ${x + 10} ${y}Z`}
          fill={shade(col, (rnd(seed + i * 7) - 0.5) * 0.35)}
        />
      );
    })}
  </g>
);

const Horned: React.FC<{ c: Creature; t: number }> = ({ c, t }) => {
  const pose = c.pose ?? "idle";
  const breath = Math.sin(t * 1.8) * 6;
  const fur = "#2a1d17";
  const step = pose === "step" ? Math.sin(t * 5) : 0;
  const reach = pose === "reach" ? 1 : 0;
  const scream = pose === "scream" ? 1 : 0;
  const lurk = pose === "lurk" || pose === "peek" ? 1 : 0;
  const tilt = wob(t, 3, 0.5) * 4 + lurk * 14;
  const tongue = 120 + Math.sin(t * 3) * 20 + scream * 80;
  const chainRattle = Math.sin(t * 18) * (pose === "step" ? 4 : 1);
  return (
    <g>
      <ellipse cx={0} cy={0} rx={240} ry={30} fill="#000" opacity={0.35} />
      {/* basket on the back */}
      <g transform="translate(150 -900) rotate(10)">
        <path d="M-120 0 L120 0 L100 320 L-100 320Z" fill="#6a4a24" />
        {Array.from({ length: 7 }).map((_, i) => (
          <line key={i} x1={-110 + i * 6} y1={20 + i * 45} x2={110 - i * 6} y2={20 + i * 45} stroke="#4a3216" strokeWidth={8} />
        ))}
      </g>
      {/* legs: one hoof, one foot */}
      <g transform={`translate(0 ${-Math.abs(step) * 20})`}>
        <path d={`M-140 -560 Q-180 -300 ${-120 + step * 30} -60 L${-60 + step * 30} -60 Q-60 -300 -40 -560Z`} fill={fur} />
        <path d={`M${-130 + step * 30} -70 L${-50 + step * 30} -70 L${-40 + step * 30} 0 L${-140 + step * 30} 0Z`} fill="#141010" />
        <line x1={-90 + step * 30} y1={-40} x2={-90 + step * 30} y2={0} stroke="#000" strokeWidth={6} />
        <path d={`M40 -560 Q60 -300 ${60 - step * 30} -60 L${140 - step * 30} -60 Q170 -300 140 -560Z`} fill={fur} />
        <path d={`M${50 - step * 30} -60 L${170 - step * 30} -40 Q${190 - step * 30} 0 ${150 - step * 30} 0 L${50 - step * 30} 0Z`} fill="#3a2a22" />
      </g>
      {/* body */}
      <g transform={`translate(0 ${breath})`}>
        <path d="M-220 -1020 Q-280 -800 -200 -520 L200 -520 Q280 -800 220 -1020 Q0 -1080 -220 -1020Z" fill={fur} />
        <Fur cx={0} cy={-760} rx={230} ry={260} n={150} col={fur} t={t} seed={11} len={90} />
        {/* chains */}
        <path d={`M-200 -960 Q0 ${-760 + chainRattle} 210 -600`} stroke="#8a8a90" strokeWidth={14} fill="none" strokeDasharray="22 10" />
        <path d={`M200 -960 Q0 ${-800 - chainRattle} -200 -640`} stroke="#6a6a70" strokeWidth={12} fill="none" strokeDasharray="20 10" />
        {/* bells */}
        {[-140, -70, 0, 70, 140].map((bx, i) => (
          <g key={bx} transform={`translate(${bx} -560) rotate(${Math.sin(t * 9 + i) * (pose === "step" ? 20 : 6)})`}>
            <path d="M-26 50 Q-26 0 0 0 Q26 0 26 50Z" fill="#b8902a" stroke="#6a5010" strokeWidth={4} />
            <circle cx={0} cy={54} r={7} fill="#6a5010" />
          </g>
        ))}
        {/* arms */}
        <g transform={`rotate(${-reach * 70 + Math.sin(t * 1.5) * 3} -220 -960)`}>
          <path d="M-250 -980 Q-320 -760 -280 -560 L-200 -560 Q-220 -760 -180 -960Z" fill={fur} />
          <Fur cx={-240} cy={-760} rx={50} ry={190} n={36} col={fur} t={t} seed={33} len={60} />
          <g transform="translate(-240 -540)">
            {[-40, -15, 10, 35].map((fx, i) => (
              <path key={i} d={`M${fx} 0 Q${fx - 6} 60 ${fx - 2} ${110 + i * 6} L${fx + 10} ${100 + i * 6} Q${fx + 8} 50 ${fx + 14} 0Z`} fill="#1a1210" />
            ))}
          </g>
        </g>
        <g transform={`rotate(${Math.sin(t * 1.2) * 4} 220 -960)`}>
          <path d="M250 -980 Q320 -760 280 -560 L200 -560 Q220 -760 180 -960Z" fill={fur} />
          <Fur cx={240} cy={-760} rx={50} ry={190} n={36} col={fur} t={t} seed={44} len={60} />
          {/* birch bundle */}
          <g transform="translate(250 -560) rotate(20)">
            {Array.from({ length: 9 }).map((_, i) => (
              <line key={i} x1={0} y1={0} x2={-40 + i * 10} y2={-330 + Math.abs(i - 4) * 18} stroke="#3a2a1a" strokeWidth={6} />
            ))}
            <rect x={-20} y={-60} width={40} height={30} fill="#111" />
          </g>
        </g>
        {/* head */}
        <g transform={`translate(0 -1150) rotate(${tilt})`}>
          {/* horns */}
          <path d="M-90 -90 C-200 -160 -300 -120 -330 -10 C-340 60 -290 110 -250 80 C-290 40 -280 -40 -220 -70 C-170 -90 -120 -60 -80 -40Z" fill="#3a2a20" />
          <path d="M90 -90 C200 -160 300 -120 330 -10 C340 60 290 110 250 80 C290 40 280 -40 220 -70 C170 -90 120 -60 80 -40Z" fill="#3a2a20" />
          {[0, 1, 2, 3].map((i) => (
            <React.Fragment key={i}>
              <path d={`M${-130 - i * 45} ${-120 + i * 10} l12 30`} stroke="#5a4232" strokeWidth={8} />
              <path d={`M${130 + i * 45} ${-120 + i * 10} l-12 30`} stroke="#5a4232" strokeWidth={8} />
            </React.Fragment>
          ))}
          <ellipse cx={0} cy={0} rx={140} ry={160} fill={fur} />
          <Fur cx={0} cy={-30} rx={150} ry={120} n={60} col={fur} t={t} seed={55} len={50} />
          {/* face */}
          <path d="M-100 -40 Q0 -90 100 -40 Q120 80 60 150 Q0 180 -60 150 Q-120 80 -100 -40Z" fill="#6e1f1c" />
          <path d="M-100 -40 Q0 -90 100 -40 L90 -10 Q0 -50 -90 -10Z" fill="#4a1210" />
          <path d="M-80 -10 L-20 0 L-70 20Z M80 -10 L20 0 L70 20Z" fill="#ffd23a" />
          <circle cx={-52} cy={4} r={6} fill="#1a0a00" />
          <circle cx={52} cy={4} r={6} fill="#1a0a00" />
          {/* mouth with teeth */}
          <path d={`M-80 70 Q0 ${110 + scream * 60} 80 70 Q0 ${90 + scream * 30} -80 70Z`} fill="#140404" />
          {Array.from({ length: 9 }).map((_, i) => (
            <path key={i} d={`M${-72 + i * 18} ${74 + Math.sin(i) * 2} l8 18 l8 -18Z`} fill="#f2ead8" />
          ))}
          {/* tongue */}
          <path d={`M-18 90 Q${-30 + Math.sin(t * 2) * 20} ${90 + tongue * 0.6} ${Math.sin(t * 2.4) * 30} ${90 + tongue} Q${20 + Math.sin(t * 2) * 10} ${90 + tongue * 0.6} 18 90Z`} fill="#d23a4a" />
        </g>
      </g>
    </g>
  );
};

const Wendigo: React.FC<{ c: Creature; t: number }> = ({ c, t }) => {
  const pose = c.pose ?? "idle";
  const bone = "#e8e0cc";
  const skin = "#5a5650";
  const sway = Math.sin(t * 1.3) * 6;
  const step = pose === "step" ? Math.sin(t * 3.5) : 0;
  const reach = pose === "reach" ? 1 : 0;
  const crawl = pose === "crawl";
  return (
    <g transform={crawl ? "translate(0 0) rotate(-70) translate(0 -300)" : undefined}>
      <ellipse cx={0} cy={0} rx={200} ry={24} fill="#000" opacity={0.3} />
      <path d={`M-60 -900 L${-90 + step * 40} -460 L${-70 + step * 40} 0`} stroke={skin} strokeWidth={40} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d={`M60 -900 L${90 - step * 40} -460 L${70 - step * 40} 0`} stroke={skin} strokeWidth={40} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <g transform={`rotate(${sway * 0.3})`}>
        <path d="M-110 -1380 Q-140 -1100 -70 -880 L70 -880 Q140 -1100 110 -1380Z" fill={skin} />
        {[0, 1, 2, 3, 4].map((i) => (
          <path key={i} d={`M-90 ${-1300 + i * 70} Q0 ${-1270 + i * 70} 90 ${-1300 + i * 70}`} stroke={shade(skin, -0.35)} strokeWidth={8} fill="none" />
        ))}
        <g transform={`rotate(${-reach * 60} -110 -1350)`}>
          <path d={`M-110 -1350 L-200 -1000 L-190 -600`} stroke={skin} strokeWidth={30} strokeLinecap="round" fill="none" />
          {[-30, -10, 10, 30].map((fx) => (
            <line key={fx} x1={-190} y1={-600} x2={-190 + fx} y2={-480} stroke="#2a2622" strokeWidth={8} strokeLinecap="round" />
          ))}
        </g>
        <g transform={`rotate(${reach * 40} 110 -1350)`}>
          <path d={`M110 -1350 L200 -1000 L190 -600`} stroke={skin} strokeWidth={30} strokeLinecap="round" fill="none" />
          {[-30, -10, 10, 30].map((fx) => (
            <line key={fx} x1={190} y1={-600} x2={190 + fx} y2={-480} stroke="#2a2622" strokeWidth={8} strokeLinecap="round" />
          ))}
        </g>
        {/* skull head with antlers */}
        <g transform={`translate(0 -1500) rotate(${wob(t, 5, 0.4) * 6})`}>
          <g stroke={bone} strokeWidth={16} strokeLinecap="round" fill="none">
            <path d="M-50 -80 L-120 -250 L-200 -330 M-120 -250 L-90 -360 M-160 -290 L-250 -270 M-80 -170 L-170 -160" />
            <path d="M50 -80 L120 -250 L200 -330 M120 -250 L90 -360 M160 -290 L250 -270 M80 -170 L170 -160" />
          </g>
          <path d="M-90 -60 Q0 -130 90 -60 L70 80 Q0 160 -70 80Z" fill={bone} />
          <ellipse cx={-34} cy={-10} rx={24} ry={30} fill="#0a0a0a" />
          <ellipse cx={34} cy={-10} rx={24} ry={30} fill="#0a0a0a" />
          <circle cx={-34} cy={-8} r={6} fill="#cfe8ff" opacity={0.6 + 0.4 * Math.sin(t * 4)} />
          <circle cx={34} cy={-8} r={6} fill="#cfe8ff" opacity={0.6 + 0.4 * Math.sin(t * 4)} />
          <path d="M-40 70 L40 70" stroke="#0a0a0a" strokeWidth={6} />
          {[-30, -15, 0, 15, 30].map((x) => (
            <line key={x} x1={x} y1={60} x2={x} y2={84} stroke="#0a0a0a" strokeWidth={4} />
          ))}
        </g>
      </g>
    </g>
  );
};

const Ghost: React.FC<{ c: Creature; t: number }> = ({ c, t }) => {
  const float = Math.sin(t * 1.6) * 16;
  const reach = c.pose === "reach" ? 1 : 0;
  const scream = c.pose === "scream" ? 1 : 0;
  return (
    <g transform={`translate(0 ${float - 40})`} opacity={0.92}>
      <path d={`M-150 -700 Q-200 -300 -230 0 Q-170 -40 -120 0 Q-60 -50 0 0 Q60 -50 120 0 Q170 -40 230 0 Q200 -300 150 -700Z`} fill="#e6eaec" />
      <path d={`M-150 -700 Q-200 -300 -230 0 Q-170 -40 -120 0 Q-60 -50 0 0`} fill="#000" opacity={0.06} />
      <g transform={`rotate(${-reach * 70} -150 -650)`}>
        <path d="M-150 -650 L-210 -380" stroke="#e6eaec" strokeWidth={40} strokeLinecap="round" />
        <path d="M-210 -380 l-20 50 M-210 -380 l0 56 M-210 -380 l20 50" stroke="#c9d0d4" strokeWidth={10} strokeLinecap="round" />
      </g>
      <g transform="rotate(0 150 -650)">
        <path d="M150 -650 L210 -380" stroke="#e6eaec" strokeWidth={40} strokeLinecap="round" />
      </g>
      <g transform="translate(0 -830)">
        <path d="M-170 -40 C-190 -230 190 -230 170 -40 L210 420 L-210 420Z" fill="#0b0b0d" />
        <ellipse cx={0} cy={0} rx={120} ry={150} fill="#dfe4e6" />
        <path d="M-130 -60 C-120 -180 120 -180 130 -60 C90 -120 40 -140 10 -120 C-40 -140 -100 -110 -130 -60Z" fill="#0b0b0d" />
        <path d="M-150 -20 C-120 80 -110 200 -90 300 L-40 300 C-70 200 -90 60 -110 -20Z M150 -20 C120 80 110 200 90 300 L40 300 C70 200 90 60 110 -20Z" fill="#0b0b0d" />
        <ellipse cx={-42} cy={-10} rx={26} ry={34} fill="#050505" />
        <ellipse cx={42} cy={-10} rx={26} ry={34} fill="#050505" />
        <circle cx={-42} cy={-6} r={4} fill="#fff" opacity={0.5} />
        <circle cx={42} cy={-6} r={4} fill="#fff" opacity={0.5} />
        <ellipse cx={0} cy={80} rx={20 + scream * 20} ry={10 + scream * 50} fill="#050505" />
      </g>
    </g>
  );
};

const Shade: React.FC<{ c: Creature; t: number }> = ({ c, t }) => {
  const reach = c.pose === "reach" ? 1 : 0;
  const jit = Math.sin(t * 23) * 2;
  return (
    <g>
      <path d={`M-110 0 C-130 -500 -120 -900 -80 -1100 L80 -1100 C120 -900 130 -500 110 0Z`} fill="#050507" />
      <g transform={`rotate(${-reach * 70 + jit} -80 -1080)`}>
        <path d="M-80 -1080 C-160 -800 -170 -600 -180 -300" stroke="#050507" strokeWidth={34} fill="none" strokeLinecap="round" />
        {[-24, -8, 8, 24].map((fx) => (
          <path key={fx} d={`M-180 -300 q${fx} 80 ${fx * 1.5} 170`} stroke="#050507" strokeWidth={10} fill="none" strokeLinecap="round" />
        ))}
      </g>
      <g transform={`rotate(${jit} 80 -1080)`}>
        <path d="M80 -1080 C160 -800 170 -600 180 -300" stroke="#050507" strokeWidth={34} fill="none" strokeLinecap="round" />
      </g>
      <ellipse cx={0} cy={-1250} rx={110} ry={150} fill="#050507" />
      <ellipse cx={-38} cy={-1260} rx={16} ry={10} fill="#f4f4f4" />
      <ellipse cx={38} cy={-1260} rx={16} ry={10} fill="#f4f4f4" />
      <path d="M-50 -1180 Q0 -1150 50 -1180" stroke="#f4f4f4" strokeWidth={4} fill="none" opacity={c.pose === "scream" ? 1 : 0.35} />
    </g>
  );
};

const Hollow: React.FC<{ c: Creature; t: number }> = ({ c, t }) => {
  // tall faceless thing from the other side: a crack of light where the face should be
  const reach = c.pose === "reach" ? 1 : 0;
  const open = c.pose === "scream" ? 1 : 0.15 + 0.1 * Math.sin(t * 2);
  const skin = "#3a2f36";
  const step = c.pose === "step" ? Math.sin(t * 4) : 0;
  return (
    <g>
      <ellipse cx={0} cy={0} rx={190} ry={24} fill="#000" opacity={0.3} />
      <path d={`M-50 -820 L${-90 + step * 40} -420 L${-60 + step * 40} 0`} stroke={skin} strokeWidth={46} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d={`M50 -820 L${90 - step * 40} -420 L${60 - step * 40} 0`} stroke={skin} strokeWidth={46} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M-120 -1170 Q-150 -980 -70 -800 L70 -800 Q150 -980 120 -1170Z" fill={skin} />
      <g transform={`rotate(${-reach * 65} -120 -1150)`}>
        <path d="M-120 -1150 L-200 -850 L-210 -520" stroke={skin} strokeWidth={34} strokeLinecap="round" fill="none" />
        {[-30, -10, 10, 30].map((fx) => (
          <line key={fx} x1={-210} y1={-520} x2={-210 + fx} y2={-400} stroke={skin} strokeWidth={10} strokeLinecap="round" />
        ))}
      </g>
      <path d="M120 -1150 L200 -850 L210 -520" stroke={skin} strokeWidth={34} strokeLinecap="round" fill="none" />
      <g transform="translate(0 -1250)">
        <ellipse cx={0} cy={0} rx={110} ry={140} fill={skin} />
        <path d={`M0 -120 L${-30 * open - 6} -40 L${-10 - 20 * open} 30 L${-36 * open - 6} 110 L0 130 L${36 * open + 6} 110 L${10 + 20 * open} 30 L${30 * open + 6} -40Z`} fill="#ff5a3a" />
        <path d={`M0 -110 L${-14 * open - 3} -40 L0 120 L${14 * open + 3} -40Z`} fill="#ffe0a0" />
      </g>
    </g>
  );
};

export const CreatureView: React.FC<{ c: Creature; t: number }> = ({ c, t }) => {
  switch (c.type) {
    case "horned":
      return <Horned c={c} t={t} />;
    case "wendigo":
      return <Wendigo c={c} t={t} />;
    case "ghost":
      return <Ghost c={c} t={t} />;
    case "shade":
      return <Shade c={c} t={t} />;
    case "hollow":
      return <Hollow c={c} t={t} />;
    default:
      return null;
  }
};

/** glow drawn above the night tint (eyes etc.) */
export const CreatureGlow: React.FC<{ c: Creature; t: number }> = ({ c, t }) => {
  if (c.type === "horned")
    return (
      <g transform={`translate(0 -1150)`}>
        <circle cx={-50} cy={4} r={70} fill="url(#eyeGlow)" opacity={0.55 + 0.2 * Math.sin(t * 3)} />
        <circle cx={50} cy={4} r={70} fill="url(#eyeGlow)" opacity={0.55 + 0.2 * Math.sin(t * 3)} />
      </g>
    );
  if (c.type === "hollow") return <circle cx={0} cy={-1250} r={260} fill="url(#redPool)" opacity={0.6} />;
  if (c.type === "wendigo")
    return (
      <g transform="translate(0 -1508)">
        <circle cx={-34} cy={0} r={50} fill="#cfe8ff" opacity={0.15} />
        <circle cx={34} cy={0} r={50} fill="#cfe8ff" opacity={0.15} />
      </g>
    );
  return null;
};
