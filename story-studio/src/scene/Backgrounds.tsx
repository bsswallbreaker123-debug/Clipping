import React from "react";
import { random } from "remotion";
import type { Background, TimeOfDay } from "../types";

// Flat, slightly desaturated sets in 1920x1080 scene space. Floor line ~ y 820-1010.

const sky = (tod: TimeOfDay) =>
  tod === "night" ? ["#0d1b3a", "#24365e"] : tod === "evening" ? ["#ff9a62", "#ffd39a"] : ["#8fd3ff", "#d8f1ff"];

const Sky: React.FC<{ id: string; tod: TimeOfDay; x: number; y: number; w: number; h: number }> = ({ id, tod, x, y, w, h }) => {
  const [a, b] = sky(tod);
  return (
    <>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={a} />
          <stop offset="1" stopColor={b} />
        </linearGradient>
      </defs>
      <rect x={x} y={y} width={w} height={h} fill={`url(#${id})`} />
      {tod === "night" && <circle cx={x + w * 0.75} cy={y + h * 0.3} r={Math.min(w, h) * 0.09} fill="#fdf6d8" />}
    </>
  );
};

const Window: React.FC<{ x: number; y: number; w: number; h: number; tod: TimeOfDay; id: string; frame?: string }> = ({ x, y, w, h, tod, id, frame = "#f3efe6" }) => (
  <g>
    <rect x={x - 14} y={y - 14} width={w + 28} height={h + 28} rx={6} fill={frame} />
    <Sky id={id} tod={tod} x={x} y={y} w={w} h={h} />
    <path d={`M ${x + w / 2} ${y} V ${y + h} M ${x} ${y + h / 2} H ${x + w}`} stroke={frame} strokeWidth={12} />
    <path d={`M ${x + 20} ${y + h - 30} L ${x + w * 0.45} ${y + 20}`} stroke="rgba(255,255,255,0.35)" strokeWidth={10} />
  </g>
);

const Clock: React.FC<{ x: number; y: number; r?: number; hour?: number }> = ({ x, y, r = 55, hour = 3 }) => (
  <g>
    <circle cx={x} cy={y} r={r} fill="#fff" stroke="#333" strokeWidth={8} />
    {Array.from({ length: 12 }).map((_, i) => {
      const a = (i * Math.PI) / 6;
      return <line key={i} x1={x + Math.sin(a) * r * 0.78} y1={y - Math.cos(a) * r * 0.78} x2={x + Math.sin(a) * r * 0.9} y2={y - Math.cos(a) * r * 0.9} stroke="#333" strokeWidth={4} />;
    })}
    <line x1={x} y1={y} x2={x + Math.sin((hour * Math.PI) / 6) * r * 0.5} y2={y - Math.cos((hour * Math.PI) / 6) * r * 0.5} stroke="#222" strokeWidth={7} strokeLinecap="round" />
    <line x1={x} y1={y} x2={x} y2={y - r * 0.75} stroke="#222" strokeWidth={4} strokeLinecap="round" />
  </g>
);

const Sign: React.FC<{ x: number; y: number; text: string; color?: string; bg?: string; size?: number }> = ({ x, y, text, color = "#4a3b2e", bg, size = 34 }) => (
  <g>
    {bg && <rect x={x - text.length * size * 0.36 - 20} y={y - size} width={text.length * size * 0.72 + 40} height={size * 1.5} rx={8} fill={bg} />}
    <text x={x} y={y} textAnchor="middle" fontFamily="Montserrat" fontWeight={800} fontSize={size} letterSpacing={4} fill={color}>
      {text}
    </text>
  </g>
);

const Floor: React.FC<{ y: number; color: string; line?: string; boards?: boolean }> = ({ y, color, line = "rgba(0,0,0,0.08)", boards }) => (
  <g>
    <rect x={0} y={y} width={1920} height={1080 - y} fill={color} />
    <rect x={0} y={y} width={1920} height={10} fill="rgba(0,0,0,0.12)" />
    {boards && Array.from({ length: 6 }).map((_, i) => <line key={i} x1={0} x2={1920} y1={y + 30 + i * 45} y2={y + 30 + i * 45} stroke={line} strokeWidth={3} />)}
  </g>
);

const Lamp: React.FC<{ x: number; y: number; color?: string }> = ({ x, y, color = "#2f6b4f" }) => (
  <g>
    <line x1={x} y1={0} x2={x} y2={y} stroke="#333" strokeWidth={4} />
    <path d={`M ${x - 55} ${y + 45} Q ${x} ${y - 25} ${x + 55} ${y + 45} Z`} fill={color} />
    <ellipse cx={x} cy={y + 47} rx={30} ry={8} fill="#fff6c8" />
  </g>
);

const Lockers: React.FC<{ x: number; y: number; n: number; colors: string[] }> = ({ x, y, n, colors }) => (
  <g>
    {Array.from({ length: n }).map((_, i) => {
      const c = colors[Math.floor(i / 4) % colors.length];
      const lx = x + i * 92;
      return (
        <g key={i}>
          <rect x={lx} y={y} width={88} height={400} fill={c} />
          <rect x={lx + 6} y={y + 6} width={76} height={388} fill="rgba(0,0,0,0.06)" />
          {[0, 1, 2].map((k) => (
            <rect key={k} x={lx + 22} y={y + 30 + k * 12} width={44} height={5} rx={2} fill="rgba(0,0,0,0.25)" />
          ))}
          <rect x={lx + 66} y={y + 200} width={8} height={36} rx={3} fill="rgba(0,0,0,0.3)" />
        </g>
      );
    })}
  </g>
);

const Building: React.FC<{ x: number; w: number; h: number; color: string; tod: TimeOfDay; seed: number }> = ({ x, w, h, color, tod, seed }) => (
  <g>
    <rect x={x} y={860 - h} width={w} height={h} fill={color} />
    {Array.from({ length: Math.floor(h / 70) }).map((_, r) =>
      Array.from({ length: Math.floor(w / 60) }).map((__, c) => {
        const lit = tod === "night" ? random(`${seed}-${r}-${c}`) > 0.45 : false;
        return <rect key={`${r}-${c}`} x={x + 18 + c * 60} y={860 - h + 26 + r * 70} width={30} height={38} fill={lit ? "#ffe9a3" : tod === "night" ? "#1d2440" : "#cfe7f5"} opacity={0.9} />;
      }),
    )}
  </g>
);

const Tree: React.FC<{ x: number; s?: number }> = ({ x, s = 1 }) => (
  <g transform={`translate(${x} 860) scale(${s})`}>
    <rect x={-16} y={-260} width={32} height={260} fill="#6b4a33" />
    <circle cx={0} cy={-320} r={120} fill="#4f9a5a" />
    <circle cx={-80} cy={-260} r={80} fill="#5aa866" />
    <circle cx={80} cy={-270} r={85} fill="#468c50" />
  </g>
);

const Table: React.FC<{ x: number; y: number; w: number; color?: string }> = ({ x, y, w, color = "#8e9aa8" }) => (
  <g>
    <rect x={x} y={y} width={w} height={22} rx={6} fill={color} />
    <rect x={x + 20} y={y + 22} width={14} height={120} fill="#5b6470" />
    <rect x={x + w - 34} y={y + 22} width={14} height={120} fill="#5b6470" />
  </g>
);

export const BackgroundView: React.FC<{ bg: Background; tod: TimeOfDay; frame: number }> = ({ bg, tod, frame }) => {
  const id = `${bg}-${tod}`;
  let content: React.ReactNode;
  switch (bg) {
    case "bedroom":
      content = (
        <>
          <rect width={1920} height={1080} fill="#8a6b5c" />
          <rect width={1920} height={120} y={700} fill="#7a5c4e" />
          <Window x={1250} y={190} w={360} h={300} tod={tod} id={id} />
          <rect x={300} y={200} width={170} height={230} fill="#3e5c8a" stroke="#f0e6d2" strokeWidth={10} />
          <circle cx={385} cy={290} r={50} fill="#f2c230" />
          <rect x={560} y={260} width={120} height={150} fill="#c0392b" stroke="#f0e6d2" strokeWidth={8} />
          <Clock x={900} y={260} hour={tod === "night" ? 12 : 8} />
          <Floor y={820} color="#5e4336" boards />
          {/* bed */}
          <rect x={1180} y={640} width={640} height={200} rx={20} fill="#3a4a6b" />
          <rect x={1180} y={600} width={160} height={110} rx={30} fill="#eef0f5" />
          <rect x={1150} y={560} width={40} height={300} rx={10} fill="#4a3026" />
          {/* desk + lamp */}
          <rect x={120} y={660} width={380} height={24} fill="#4a3026" />
          <rect x={140} y={684} width={20} height={150} fill="#4a3026" />
          <rect x={460} y={684} width={20} height={150} fill="#4a3026" />
          <rect x={200} y={560} width={150} height={100} rx={8} fill="#1d1f26" />
          <path d="M 420 660 L 440 590 L 400 560" stroke="#222" strokeWidth={8} fill="none" />
          <path d="M 375 545 L 430 530 L 420 585 Z" fill="#f2c230" />
        </>
      );
      break;
    case "classroom":
      content = (
        <>
          <rect width={1920} height={1080} fill="#d9c7a4" />
          <rect x={0} y={620} width={1920} height={200} fill="#c4ae86" />
          <rect x={560} y={170} width={800} height={380} rx={10} fill="#2f5d4a" stroke="#8a6a46" strokeWidth={18} />
          <path d="M 620 260 h 260 M 620 320 h 380 M 620 380 h 200" stroke="rgba(255,255,255,0.55)" strokeWidth={8} strokeLinecap="round" />
          <Window x={120} y={200} w={300} h={300} tod={tod} id={id} />
          <Window x={1520} y={200} w={300} h={300} tod={tod} id={`${id}b`} />
          <Clock x={1440} y={130} r={45} hour={9} />
          <Floor y={820} color="#a88c66" boards />
          <Table x={200} y={780} w={360} color="#c98b52" />
          <Table x={1360} y={780} w={360} color="#c98b52" />
        </>
      );
      break;
    case "cafeteria":
      content = (
        <>
          <rect width={1920} height={1080} fill="#e3cfae" />
          <rect x={0} y={560} width={1920} height={260} fill="#cdb48e" />
          <Sign x={960} y={110} text="CAFETERIA" />
          {[0, 1].map((r) => (
            <g key={r}>
              <rect x={620} y={210 + r * 110} width={680} height={14} fill="#8b6a4a" />
              {Array.from({ length: 9 }).map((_, i) => (
                <rect key={i} x={650 + i * 72} y={160 + r * 110} width={26} height={50} rx={6} fill={["#e07a5f", "#81b29a", "#f2cc8f", "#3d405b"][(i + r) % 4]} />
              ))}
            </g>
          ))}
          <rect x={60} y={230} width={420} height={260} fill="#2f4a3a" stroke="#7a5a3a" strokeWidth={14} />
          <Lamp x={300} y={120} />
          <Lamp x={1620} y={120} />
          <rect x={560} y={540} width={800} height={60} fill="#b5895c" />
          <Floor y={820} color="#9e8a74" />
          <Table x={120} y={800} w={560} />
          <Table x={1240} y={800} w={560} />
        </>
      );
      break;
    case "hallway":
      content = (
        <>
          <rect width={1920} height={1080} fill="#efe3a8" />
          <rect x={0} y={0} width={1920} height={60} fill="#e2d48f" />
          <Lockers x={40} y={400} n={8} colors={["#c0392b", "#2e8b6d"]} />
          <Window x={850} y={200} w={300} h={260} tod={tod} id={id} />
          <Lockers x={1200} y={400} n={7} colors={["#2e8b6d", "#c0392b"]} />
          <Floor y={800} color="#d6c27a" />
          <rect x={420} y={760} width={300} height={22} rx={6} fill="#6b4a33" />
          <rect x={440} y={782} width={14} height={36} fill="#4a3026" />
          <rect x={686} y={782} width={14} height={36} fill="#4a3026" />
        </>
      );
      break;
    case "street":
    case "rooftop":
      content = (
        <>
          <Sky id={id} tod={tod} x={0} y={0} w={1920} h={1080} />
          <Building x={-40} w={380} h={620} color={tod === "night" ? "#2a2f4a" : "#9aa7b8"} tod={tod} seed={1} />
          <Building x={380} w={300} h={460} color={tod === "night" ? "#323856" : "#b8a99a"} tod={tod} seed={2} />
          <Building x={720} w={420} h={700} color={tod === "night" ? "#262b45" : "#8c9bb0"} tod={tod} seed={3} />
          <Building x={1180} w={330} h={520} color={tod === "night" ? "#30365a" : "#c2b2a0"} tod={tod} seed={4} />
          <Building x={1550} w={420} h={640} color={tod === "night" ? "#2a2f4a" : "#a3b1c2"} tod={tod} seed={5} />
          {bg === "street" ? (
            <>
              <rect x={0} y={860} width={1920} height={60} fill="#b9b4ab" />
              <rect x={0} y={920} width={1920} height={160} fill="#4a4d55" />
              {Array.from({ length: 8 }).map((_, i) => (
                <rect key={i} x={i * 260 + 40} y={995} width={140} height={14} fill="#e8e2c8" />
              ))}
              <g>
                <rect x={1460} y={520} width={12} height={360} fill="#2c2c2c" />
                <rect x={1420} y={510} width={70} height={18} rx={8} fill="#2c2c2c" />
                {tod !== "day" && <ellipse cx={1440} cy={540} rx={60} ry={24} fill="#fff1b0" opacity={0.5} />}
              </g>
            </>
          ) : (
            <>
              <rect x={0} y={860} width={1920} height={220} fill="#6e6a73" />
              <rect x={0} y={840} width={1920} height={24} fill="#8b8792" />
              <rect x={1500} y={700} width={220} height={160} fill="#5a5660" />
            </>
          )}
        </>
      );
      break;
    case "park":
      content = (
        <>
          <Sky id={id} tod={tod} x={0} y={0} w={1920} h={1080} />
          <ellipse cx={500} cy={900} rx={900} ry={260} fill="#7cbf6e" />
          <ellipse cx={1500} cy={920} rx={800} ry={240} fill="#6fb262" />
          <Tree x={220} s={1.1} />
          <Tree x={1680} s={1.2} />
          <Tree x={1180} s={0.7} />
          <rect x={0} y={860} width={1920} height={220} fill="#62a557" />
          <rect x={720} y={800} width={360} height={20} rx={6} fill="#8b5a3c" />
          <rect x={720} y={760} width={360} height={18} rx={6} fill="#8b5a3c" />
          <rect x={740} y={820} width={14} height={60} fill="#3b3b3b" />
          <rect x={1046} y={820} width={14} height={60} fill="#3b3b3b" />
        </>
      );
      break;
    case "office":
      content = (
        <>
          <rect width={1920} height={1080} fill="#d7dde3" />
          <Window x={140} y={140} w={760} h={460} tod={tod} id={id} frame="#b9c2cc" />
          <g opacity={0.6}>
            <Building x={180} w={180} h={300} color="#7f8da1" tod={tod} seed={7} />
          </g>
          <rect x={1100} y={160} width={600} height={300} rx={12} fill="#fff" stroke="#9aa5b1" strokeWidth={10} />
          <path d="M 1160 400 L 1280 330 L 1380 360 L 1520 240 L 1640 220" stroke="#2bb673" strokeWidth={12} fill="none" />
          <Floor y={820} color="#9aa3ad" />
          <rect x={1000} y={700} width={760} height={30} fill="#5d6670" />
          <rect x={1220} y={560} width={240} height={140} rx={10} fill="#1d2129" />
          <rect x={1320} y={700} width={40} height={10} fill="#1d2129" />
        </>
      );
      break;
    case "gym":
      content = (
        <>
          <rect width={1920} height={1080} fill="#c8ccd3" />
          <rect x={0} y={0} width={1920} height={70} fill="#e94560" />
          <rect x={300} y={160} width={1320} height={360} fill="#b0b6c0" />
          {Array.from({ length: 5 }).map((_, i) => (
            <rect key={i} x={340 + i * 260} y={190} width={220} height={300} fill="#dfe3e8" opacity={0.8} />
          ))}
          <Floor y={800} color="#c88d55" boards line="rgba(0,0,0,0.1)" />
          <g>
            <rect x={200} y={700} width={360} height={14} fill="#333" />
            <rect x={180} y={660} width={30} height={95} rx={6} fill="#222" />
            <rect x={550} y={660} width={30} height={95} rx={6} fill="#222" />
          </g>
          <rect x={1400} y={640} width={260} height={180} rx={10} fill="#3a3f4b" />
        </>
      );
      break;
    case "party": {
      const lights = ["#ff3cac", "#2bd2ff", "#ffe53b", "#7cff6b"];
      content = (
        <>
          <rect width={1920} height={1080} fill="#1a1430" />
          {lights.map((c, i) => {
            const a = Math.sin(frame / 20 + i * 1.6) * 30;
            return <path key={i} d={`M ${400 + i * 380} 0 L ${200 + i * 380 + a * 6} 900 L ${600 + i * 380 + a * 6} 900 Z`} fill={c} opacity={0.18} />;
          })}
          <circle cx={960} cy={110} r={70} fill="#c9c9d6" />
          {Array.from({ length: 30 }).map((_, i) => (
            <rect key={i} x={910 + (i % 6) * 17} y={60 + Math.floor(i / 6) * 20} width={12} height={14} fill={(i + Math.floor(frame / 6)) % 3 ? "#e8e8f5" : "#8f8fa8"} />
          ))}
          <Floor y={820} color="#2a2245" />
        </>
      );
      break;
    }
    case "livingroom":
      content = (
        <>
          <rect width={1920} height={1080} fill="#cfb9a0" />
          <Window x={1380} y={180} w={380} h={320} tod={tod} id={id} />
          <rect x={160} y={240} width={560} height={320} rx={10} fill="#16181d" stroke="#3a3a3a" strokeWidth={12} />
          <rect x={360} y={560} width={160} height={60} fill="#3a3a3a" />
          <Floor y={820} color="#8f6f52" boards />
          <rect x={780} y={620} width={560} height={200} rx={40} fill="#5b7fa6" />
          <rect x={760} y={560} width={600} height={120} rx={40} fill="#4d6f94" />
        </>
      );
      break;
    case "store":
      content = (
        <>
          <rect width={1920} height={1080} fill="#f1f1ee" />
          <Sign x={960} y={100} text="SUPERMARKET" color="#fff" bg="#e94560" />
          {[0, 1, 2].map((s) => (
            <g key={s}>
              {[0, 1, 2, 3].map((r) => (
                <g key={r}>
                  <rect x={120 + s * 600} y={240 + r * 130} width={480} height={14} fill="#9aa1ab" />
                  {Array.from({ length: 10 }).map((_, i) => (
                    <rect key={i} x={130 + s * 600 + i * 47} y={170 + r * 130} width={36} height={70} rx={4} fill={["#ff6b6b", "#ffd93d", "#6bcB77", "#4d96ff", "#c77dff"][(i + r + s) % 5]} />
                  ))}
                </g>
              ))}
            </g>
          ))}
          <Floor y={820} color="#d9d9d4" />
        </>
      );
      break;
    case "school":
      content = (
        <>
          <Sky id={id} tod={tod} x={0} y={0} w={1920} h={1080} />
          <rect x={260} y={260} width={1400} height={600} fill="#b5523b" />
          <path d="M 220 270 L 960 90 L 1700 270 Z" fill="#7d3427" />
          <Sign x={960} y={340} text="LINCOLN HIGH" color="#fff" size={44} />
          {Array.from({ length: 2 }).map((_, r) =>
            Array.from({ length: 8 }).map((__, c) =>
              c === 3 || c === 4 ? null : <rect key={`${r}${c}`} x={320 + c * 165} y={400 + r * 200} width={110} height={130} fill="#cfe7f5" stroke="#f3efe6" strokeWidth={8} />,
            ),
          )}
          <rect x={860} y={640} width={200} height={220} fill="#5a2a1e" />
          <rect x={0} y={860} width={1920} height={220} fill="#9a9a9a" />
          <Tree x={140} s={0.9} />
          <Tree x={1800} s={0.95} />
        </>
      );
      break;
    case "hospital":
      content = (
        <>
          <rect width={1920} height={1080} fill="#dff1ee" />
          <rect x={0} y={560} width={1920} height={260} fill="#c9e6e1" />
          <Window x={1400} y={180} w={340} h={300} tod={tod} id={id} />
          <rect x={300} y={200} width={300} height={200} rx={12} fill="#1d2b2b" />
          <path d="M 320 300 h 60 l 20 -50 l 25 100 l 20 -50 h 135" stroke="#38f28a" strokeWidth={6} fill="none" />
          <Floor y={820} color="#b4cfcb" />
          <rect x={700} y={640} width={700} height={100} rx={14} fill="#f4f6f6" />
          <rect x={700} y={740} width={20} height={100} fill="#9aa" />
          <rect x={1380} y={740} width={20} height={100} fill="#9aa" />
        </>
      );
      break;
    case "stage":
      content = (
        <>
          <rect width={1920} height={1080} fill="#2b0f1a" />
          {Array.from({ length: 12 }).map((_, i) => (
            <rect key={i} x={i * 80} y={0} width={70} height={1080} fill={i % 2 ? "#8e1b2e" : "#a32238"} />
          ))}
          {Array.from({ length: 12 }).map((_, i) => (
            <rect key={`r${i}`} x={1920 - 80 - i * 80} y={0} width={70} height={1080} fill={i % 2 ? "#8e1b2e" : "#a32238"} />
          ))}
          <rect x={560} y={0} width={800} height={1080} fill="#1a0b12" />
          <path d="M 760 0 L 560 860 L 1360 860 L 1160 0 Z" fill="#fff6d0" opacity={0.18} />
          <rect x={0} y={860} width={1920} height={220} fill="#3a2316" />
        </>
      );
      break;
    case "void":
    default:
      content = (
        <>
          <defs>
            <radialGradient id={`void-${id}`} cx="50%" cy="40%" r="70%">
              <stop offset="0" stopColor="#3b3f6b" />
              <stop offset="1" stopColor="#0b0c18" />
            </radialGradient>
          </defs>
          <rect width={1920} height={1080} fill={`url(#void-${id})`} />
          {Array.from({ length: 40 }).map((_, i) => (
            <circle key={i} cx={random(`vx${i}`) * 1920} cy={random(`vy${i}`) * 1080} r={1.5 + random(`vr${i}`) * 2.5} fill="#fff" opacity={0.25 + 0.35 * Math.abs(Math.sin(frame / 25 + i))} />
          ))}
          <ellipse cx={960} cy={1010} rx={520} ry={60} fill="#000" opacity={0.35} />
        </>
      );
  }
  const indoor = !["street", "park", "rooftop", "school", "void"].includes(bg);
  return (
    <g>
      {content}
      {tod === "night" && <rect width={1920} height={1080} fill="#0b1440" opacity={indoor ? 0.45 : 0.25} style={{ mixBlendMode: "multiply" }} />}
      {tod === "evening" && <rect width={1920} height={1080} fill="#ff8a3d" opacity={0.16} style={{ mixBlendMode: "multiply" }} />}
    </g>
  );
};

/** Dark blurred silhouettes in the background, like the reference style's extras. */
export const Crowd: React.FC<{ n: number; frame: number; seed: string }> = ({ n, frame, seed }) => (
  <g style={{ filter: "blur(3px)" }} opacity={0.9}>
    {Array.from({ length: n }).map((_, i) => {
      const x = 80 + random(`${seed}cx${i}`) * 1760;
      const s = 0.55 + random(`${seed}cs${i}`) * 0.2;
      const bob = Math.sin(frame / 14 + i) * 3;
      const col = ["#3b2027", "#2c2638", "#3a2a22"][i % 3];
      return (
        <g key={i} transform={`translate(${x} ${860 + bob}) scale(${s})`}>
          <rect x={-10} y={-150} width={8} height={150} fill={col} />
          <rect x={4} y={-150} width={8} height={150} fill={col} />
          <rect x={-46} y={-300} width={92} height={160} rx={30} fill={col} />
          <circle cx={0} cy={-360} r={70} fill={col} />
        </g>
      );
    })}
  </g>
);
