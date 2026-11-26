import React from "react";
import { interpolate } from "remotion";
import type { Prop } from "./types";
import { back, clamp, rnd } from "./util";

// Full-frame insert shots: a calendar page, a phone screen, a note, a newspaper ...
// a/b/c carry the text; underscores become spaces, "/" starts a new line.

const txt = (s?: string) => (s ?? "").replace(/_/g, " ");
const lines = (s?: string) => txt(s).split("/").map((l) => l.trim());

const Font = { fontFamily: "Montserrat", fontWeight: 900 } as const;

/** break text into lines of at most n characters */
export function wrap(s: string, n: number): string[] {
  const out: string[] = [];
  let cur = "";
  for (const w of s.split(" ")) {
    if ((cur + " " + w).trim().length > n && cur) {
      out.push(cur);
      cur = w;
    } else cur = (cur + " " + w).trim();
  }
  if (cur) out.push(cur);
  return out;
}

export const PropView: React.FC<{ p: Prop; f: number; dur: number; t: number }> = ({ p, f, dur, t }) => {
  const k = interpolate(f, [0, 10], [0, 1], { ...clamp, easing: back });
  const drift = interpolate(f, [0, dur], [1.0, 1.06], clamp);
  switch (p.type) {
    case "calendar": {
      const strike = interpolate(f, [12, 28], [0, 1], clamp);
      return (
        <g transform={`translate(540 900) scale(${(0.8 + 0.2 * k) * drift}) rotate(-2)`}>
          <rect x={-330} y={-420} width={660} height={820} rx={20} fill="#f4efe4" />
          <rect x={-330} y={-420} width={660} height={190} rx={20} fill="#c0242c" />
          <rect x={-330} y={-260} width={660} height={30} fill="#c0242c" />
          {[-200, -70, 70, 200].map((x) => (
            <rect key={x} x={x - 14} y={-460} width={28} height={80} rx={14} fill="#55575e" />
          ))}
          <text x={0} y={-290} textAnchor="middle" fontSize={84} fill="#fff" {...Font} letterSpacing={6}>
            {txt(p.b) || "DECEMBER"}
          </text>
          <text x={0} y={170} textAnchor="middle" fontSize={420} fill="#1d1d22" {...Font}>
            {p.a}
          </text>
          {p.c && (
            <text x={0} y={330} textAnchor="middle" fontSize={64} fill="#c0242c" {...Font}>
              {txt(p.c)}
            </text>
          )}
          {strike > 0 && (
            <g stroke="#c0242c" strokeWidth={22} strokeLinecap="round" opacity={0.9}>
              <line x1={-230} y1={-180} x2={-230 + 460 * strike} y2={-180 + 380 * strike} />
              {strike > 0.5 && <line x1={-170} y1={-210} x2={-170 + 420 * (strike - 0.5) * 2} y2={-210 + 360 * (strike - 0.5) * 2} />}
            </g>
          )}
        </g>
      );
    }
    case "phone": {
      // a = screen kind (post | chat | call | notify | camera | search), b/c = text
      const kind = p.a ?? "chat";
      const msgs = lines(p.c);
      return (
        <g transform={`translate(540 ${930 + (1 - k) * 600}) scale(${drift})`}>
          <rect x={-300} y={-600} width={600} height={1200} rx={70} fill="#0c0d10" />
          <rect x={-280} y={-580} width={560} height={1160} rx={56} fill={kind === "call" ? "#14301f" : kind === "camera" ? "#111" : "#f2f2f5"} />
          <rect x={-70} y={-566} width={140} height={34} rx={17} fill="#0c0d10" />
          {kind === "post" && (
            <g>
              <rect x={-280} y={-500} width={560} height={720} fill="#222" />
              <text x={-250} y={-430} fontSize={34} fill="#fff" {...Font}>
                {txt(p.b)}
              </text>
              <text x={0} y={-130} fontSize={150} textAnchor="middle">
                ▶
              </text>
              <g fill="#1d1d22">
                {msgs.flatMap((m) => wrap(m, 24)).map((m, i) => (
                  <text key={i} x={-250} y={290 + i * 58} fontSize={38} fontFamily="Inter" fontWeight={600} opacity={interpolate(f, [8 + i * 8, 14 + i * 8], [0, 1], clamp)}>
                    {m}
                  </text>
                ))}
              </g>
              <text x={200} y={-150} fontSize={44} fill="#ff2d55">
                ♥
              </text>
            </g>
          )}
          {kind === "chat" && (
            <g>
              <rect x={-280} y={-520} width={560} height={110} fill="#e6e6ec" />
              <text x={0} y={-450} textAnchor="middle" fontSize={40} fill="#1d1d22" {...Font}>
                {txt(p.b)}
              </text>
              {msgs.map((m, i) => {
                const mine = m.startsWith(">");
                const text = mine ? m.slice(1).trim() : m;
                const a = interpolate(f, [6 + i * 14, 12 + i * 14], [0, 1], { ...clamp, easing: back });
                const ls = wrap(text, 20);
                const w = Math.min(470, 50 + Math.max(...ls.map((l) => l.length)) * 21);
                const y0 = -380 + msgs.slice(0, i).reduce((acc, mm) => acc + 40 + wrap(mm.replace(/^>/, "").trim(), 20).length * 48 + 30, 0);
                return (
                  <g key={i} transform={`translate(${mine ? 250 - w : -250} ${y0}) scale(${a})`} opacity={a}>
                    <rect width={w} height={40 + ls.length * 48} rx={30} fill={mine ? "#2f7bf6" : "#dedee6"} />
                    {ls.map((l, j) => (
                      <text key={j} x={26} y={62 + j * 48} fontSize={38} fontFamily="Inter" fontWeight={600} fill={mine ? "#fff" : "#1d1d22"}>
                        {l}
                      </text>
                    ))}
                  </g>
                );
              })}
            </g>
          )}
          {kind === "call" && (
            <g>
              <circle cx={0} cy={-280} r={120} fill="#2a5a3a" />
              <text x={0} y={-240} textAnchor="middle" fontSize={120} fill="#fff" {...Font}>
                {txt(p.b).slice(0, 1)}
              </text>
              <text x={0} y={-60} textAnchor="middle" fontSize={64} fill="#fff" {...Font}>
                {txt(p.b)}
              </text>
              <text x={0} y={10} textAnchor="middle" fontSize={36} fill="#9fd8b0" fontFamily="Inter">
                {txt(p.c) || "incoming call…"}
              </text>
              <circle cx={-150} cy={360} r={70} fill="#e5383b" />
              <circle cx={150} cy={360 + Math.sin(t * 14) * 8} r={70} fill="#2fbf5b" />
            </g>
          )}
          {kind === "notify" && (
            <g>
              <rect x={-280} y={-580} width={560} height={1160} rx={56} fill="#1b2340" />
              <text x={0} y={-330} textAnchor="middle" fontSize={130} fill="#fff" {...Font}>
                {txt(p.c) || "3:12"}
              </text>
              <g transform={`translate(0 ${-120 + (1 - k) * 60})`} opacity={k}>
                <rect x={-250} y={0} width={500} height={170} rx={34} fill="#ffffff" opacity={0.92} />
                <text x={-220} y={60} fontSize={34} fill="#1d1d22" {...Font}>
                  {txt(p.b)}
                </text>
                <text x={-220} y={115} fontSize={30} fill="#3d3d45" fontFamily="Inter" fontWeight={600}>
                  {lines(p.c)[1] ?? ""}
                </text>
              </g>
            </g>
          )}
          {kind === "camera" && (
            <g>
              <circle cx={200} cy={-500} r={14} fill="#ff2a2a" opacity={Math.sin(t * 6) > 0 ? 1 : 0.2} />
              <text x={-240} y={-488} fontSize={34} fill="#fff" {...Font}>
                REC
              </text>
              <text x={0} y={0} textAnchor="middle" fontSize={44} fill="#ddd" fontFamily="Inter">
                {txt(p.b)}
              </text>
            </g>
          )}
        </g>
      );
    }
    case "note":
    case "letter": {
      const ls = lines(p.a);
      return (
        <g transform={`translate(540 900) scale(${(0.85 + 0.15 * k) * drift}) rotate(${-3 + rnd(3) * 2})`}>
          <rect x={-380} y={-460} width={760} height={900} fill="#efe6cf" />
          <rect x={-380} y={-460} width={760} height={900} fill="url(#paper)" />
          {ls.map((l, i) => (
            <text key={i} x={0} y={-220 + i * 130} textAnchor="middle" fontSize={84} fill={p.b ?? "#1d1d22"} fontFamily="'Caveat', 'Comic Sans MS', cursive" fontWeight={700} opacity={interpolate(f, [4 + i * 8, 12 + i * 8], [0, 1], clamp)}>
              {l}
            </text>
          ))}
        </g>
      );
    }
    case "book": {
      // an old chronicle page with a list (a = title, c = lines, b = line to circle in red)
      const ls = lines(p.c);
      return (
        <g transform={`translate(540 900) scale(${drift})`}>
          <rect x={-420} y={-560} width={840} height={1120} rx={10} fill="#d9c79f" />
          <rect x={-390} y={-530} width={780} height={1060} fill="#e8d9b4" />
          <text x={0} y={-430} textAnchor="middle" fontSize={64} fill="#4a2e14" fontFamily="Georgia, serif" fontWeight={700}>
            {txt(p.a)}
          </text>
          <line x1={-300} y1={-390} x2={300} y2={-390} stroke="#4a2e14" strokeWidth={4} />
          {ls.map((l, i) => {
            const hit = p.b && l.includes(txt(p.b));
            return (
              <g key={i} opacity={interpolate(f, [4 + i * 5, 10 + i * 5], [0, 1], clamp)}>
                <text x={-320} y={-300 + i * 96} fontSize={50} fill="#3a2410" fontFamily="Georgia, serif" fontStyle="italic">
                  {l}
                </text>
                {hit && <ellipse cx={0} cy={-316 + i * 96} rx={360} ry={50} fill="none" stroke="#c0242c" strokeWidth={8} strokeDasharray={2300} strokeDashoffset={interpolate(f, [20, 40], [2300, 0], clamp)} />}
              </g>
            );
          })}
        </g>
      );
    }
    case "news": {
      return (
        <g transform={`translate(540 900) scale(${(0.7 + 0.3 * k) * drift}) rotate(${(1 - k) * 30 - 3})`}>
          <rect x={-420} y={-560} width={840} height={1120} fill="#ece8de" />
          <text x={0} y={-450} textAnchor="middle" fontSize={70} fill="#1d1d22" fontFamily="Georgia, serif" fontWeight={700}>
            {txt(p.b) || "THE MOUNTAIN POST"}
          </text>
          <line x1={-380} y1={-420} x2={380} y2={-420} stroke="#1d1d22" strokeWidth={6} />
          {lines(p.a).map((l, i) => (
            <text key={i} x={0} y={-310 + i * 100} textAnchor="middle" fontSize={92} fill="#1d1d22" {...Font}>
              {l}
            </text>
          ))}
          <rect x={-380} y={-40} width={420} height={320} fill="#9aa0aa" />
          {Array.from({ length: 12 }).map((_, i) => (
            <rect key={i} x={70} y={-40 + i * 34} width={300 - (i % 3) * 40} height={14} fill="#9a9a9a" />
          ))}
          {txt(p.c) && (
            <text x={-170} y={330} textAnchor="middle" fontSize={34} fill="#333" fontFamily="Georgia, serif" fontStyle="italic">
              {txt(p.c)}
            </text>
          )}
        </g>
      );
    }
    case "photo": {
      return (
        <g transform={`translate(540 880) scale(${(0.8 + 0.2 * k) * drift}) rotate(4)`}>
          <rect x={-360} y={-420} width={720} height={840} fill="#f6f3ea" />
          <rect x={-320} y={-380} width={640} height={620} fill="#8a7a62" />
          <rect x={-320} y={-380} width={640} height={620} fill="url(#sepia)" />
          <text x={0} y={340} textAnchor="middle" fontSize={56} fill="#3a2a1a" fontFamily="'Caveat', cursive" fontWeight={700}>
            {txt(p.a)}
          </text>
        </g>
      );
    }
    case "clock": {
      const s = (p.a ?? "0:00").split(":");
      return (
        <g transform={`translate(540 900) scale(${drift})`}>
          <rect x={-380} y={-220} width={760} height={440} rx={40} fill="#0c0c0f" stroke="#2a2a30" strokeWidth={12} />
          <text x={0} y={90} textAnchor="middle" fontSize={260} fill="#ff2a2a" fontFamily="'Courier New', monospace" fontWeight={700} style={{ filter: "drop-shadow(0 0 24px #ff2a2a)" }}>
            {s[0]}
            <tspan opacity={Math.floor(t * 2) % 2 ? 0.2 : 1}>:</tspan>
            {s[1]}
          </text>
          {p.b && (
            <text x={0} y={180} textAnchor="middle" fontSize={44} fill="#ff6a6a" {...Font}>
              {txt(p.b)}
            </text>
          )}
        </g>
      );
    }
    case "ticket":
    case "card2": {
      // invitation card (game), a = front text, b = back symbol text
      const flip = interpolate(f, [10, 22], [1, -1], clamp);
      return (
        <g transform={`translate(540 900) scale(${drift}) rotate(-4)`}>
          <g transform={`scale(${flip} 1)`}>
            <rect x={-380} y={-230} width={760} height={460} rx={24} fill={flip > 0 ? (p.c ?? "#b0904a") : "#f1ead8"} />
            <text x={0} y={flip > 0 ? 30 : 20} textAnchor="middle" fontSize={flip > 0 ? 120 : 70} fill={flip > 0 ? "#1d1d22" : "#1d1d22"} transform={flip < 0 ? "scale(-1 1)" : undefined} {...Font}>
              {flip > 0 ? txt(p.a) : txt(p.b)}
            </text>
          </g>
        </g>
      );
    }
    case "sign":
    case "poster": {
      return (
        <g transform={`translate(540 900) scale(${(0.8 + 0.2 * k) * drift})`}>
          <rect x={-400} y={-520} width={800} height={1040} fill={p.c ?? "#e8dfc8"} />
          {lines(p.a).map((l, i) => (
            <text key={i} x={0} y={-320 + i * 130} textAnchor="middle" fontSize={110} fill="#1d1d22" {...Font}>
              {l}
            </text>
          ))}
          {p.b && (
            <text x={0} y={420} textAnchor="middle" fontSize={56} fill="#c0242c" {...Font}>
              {txt(p.b)}
            </text>
          )}
        </g>
      );
    }
    case "map": {
      const prog = interpolate(f, [6, dur * 0.8], [0, 1], clamp);
      return (
        <g transform={`translate(540 900) scale(${drift})`}>
          <rect x={-460} y={-600} width={920} height={1200} fill="#e6d8b0" />
          <path d="M-460 -200 C-200 -260 -100 -100 100 -180 C260 -240 360 -120 460 -160" stroke="#9cc0d8" strokeWidth={40} fill="none" />
          {Array.from({ length: 14 }).map((_, i) => (
            <path key={i} d={`M${-400 + rnd(i) * 800} ${-500 + rnd(i * 3) * 1000} l30 -60 l30 60Z`} fill="#7a9a6a" />
          ))}
          <path d="M-300 420 C-200 200 0 300 80 100 C160 -100 260 -200 300 -420" stroke="#c0242c" strokeWidth={14} strokeDasharray="30 20" fill="none" pathLength={1} strokeDashoffset={0} opacity={0.9} />
          <circle cx={-300} cy={420} r={26} fill="#1d1d22" />
          <g transform={`translate(${-300 + 600 * prog} ${420 - 840 * prog})`}>
            <circle r={22} fill="#c0242c" />
          </g>
          <text x={300} y={-460} textAnchor="middle" fontSize={56} fill="#1d1d22" {...Font}>
            ✕ {txt(p.a)}
          </text>
          {p.b && (
            <text x={-300} y={500} textAnchor="middle" fontSize={44} fill="#1d1d22" {...Font}>
              {txt(p.b)}
            </text>
          )}
        </g>
      );
    }
    case "number": {
      // big number / counter (players left, money ...)
      const from = Number(p.b ?? p.a ?? 0);
      const to = Number(p.a ?? 0);
      const v = Math.round(interpolate(f, [4, Math.min(dur - 4, 40)], [from, to], clamp));
      return (
        <g transform={`translate(540 900) scale(${(0.6 + 0.4 * k) * drift})`}>
          <text x={0} y={100} textAnchor="middle" fontSize={300} fill={p.c?.startsWith("#") ? p.c : "#ffffff"} {...Font} style={{ filter: "drop-shadow(0 10px 30px rgba(0,0,0,.6))" }}>
            {v.toLocaleString("en-US")}
          </text>
          {p.c && !p.c.startsWith("#") && (
            <text x={0} y={210} textAnchor="middle" fontSize={64} fill="#ffd23a" {...Font}>
              {txt(p.c)}
            </text>
          )}
        </g>
      );
    }
    default:
      return null;
  }
};
