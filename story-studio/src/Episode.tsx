import React, { useEffect, useState } from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
  Sequence,
  continueRender,
  delayRender,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import "@fontsource/inter/600.css";
import "@fontsource/inter/800.css";
import "@fontsource/montserrat/700.css";
import "@fontsource/montserrat/800.css";
import "@fontsource/montserrat/900.css";
import type { Camera, EpisodeProps, ShotChar, TimedShot } from "./types";
import { BackgroundView, Crowd } from "./scene/Backgrounds";
import { Character, charFacing, charX } from "./scene/Character";
import { BannerView, EmojiBurst, PhoneView, PopupView } from "./scene/Overlays";

const SCENE_TOP = 690;
const SCENE_H = 608; // 16:9 at full width
const S = 1080 / 1920; // scene space -> screen
const VO_OFFSET = 3; // frames of air before each line
const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

// ---------------- camera ----------------

function cameraTransform(cam: Camera | undefined, f: number, dur: number, chars: ShotChar[]) {
  const k = interpolate(f, [0, Math.max(1, dur)], [0, 1], clamp);
  const ease = Easing.inOut(Easing.sin)(k);
  const meanX = chars.length ? (chars.reduce((a, c) => a + charX(c, f, dur), 0) / chars.length) * 1920 : 960;
  let s = 1;
  let cx = 960;
  let cy = 540;
  let jitterX = 0;
  let jitterY = 0;
  if (!cam || cam === "wide") {
    s = 1 + 0.03 * ease;
  } else if (cam === "slowzoom") {
    s = 1 + 0.2 * ease;
    cx = meanX;
    cy = 600;
  } else if (cam === "zoomout") {
    s = 1.35 - 0.35 * ease;
    cx = meanX;
    cy = 600;
  } else if (cam === "panleft" || cam === "panright") {
    s = 1.28;
    cx = cam === "panright" ? 700 + 520 * ease : 1220 - 520 * ease;
    cy = 580;
  } else if (cam === "punch") {
    s = 1 + interpolate(f, [0, 7], [0, 0.38], { ...clamp, easing: Easing.out(Easing.cubic) }) + 0.03 * ease;
    cx = meanX;
    cy = 580;
  } else if (cam === "shake") {
    s = 1.1;
    jitterX = Math.sin(f * 2.7) * 14 * (1 - k * 0.5);
    jitterY = Math.cos(f * 3.1) * 10 * (1 - k * 0.5);
  } else if (typeof cam === "object") {
    const target = chars.find((c) => c.id === cam.focus) ?? chars[0];
    const z = cam.zoom ?? 2.0;
    s = z * (1 + 0.05 * ease);
    cx = target ? charX(target, f, dur) * 1920 : 960;
    const sc = target?.scale ?? 1;
    cy = 1000 - 425 * sc;
  }
  const halfW = 960 / s;
  const halfH = 540 / s;
  cx = Math.min(Math.max(cx, halfW), 1920 - halfW);
  cy = Math.min(Math.max(cy, halfH), 1080 - halfH);
  return { s, tx: 960 - cx * s + jitterX, ty: 540 - cy * s + jitterY };
}

// ---------------- shot ----------------

const ShotView: React.FC<{ shot: TimedShot; story: EpisodeProps["story"]; index: number }> = ({ shot, story, index }) => {
  const f = useCurrentFrame();
  const chars = shot.chars ?? [];
  const cam = cameraTransform(shot.camera, f, shot.dur, chars);
  const voEnd = VO_OFFSET + (shot.voFrames ?? 0);
  const speaking = f >= VO_OFFSET && f < voEnd;
  const closeUp = typeof shot.camera === "object";
  const sorted = [...chars].map((c, i) => ({ c, i })).sort((a, b) => (a.c.scale ?? 1) - (b.c.scale ?? 1));

  let transitionStyle: React.CSSProperties = {};
  let flash = 0;
  if (shot.transition === "fade") transitionStyle = { opacity: interpolate(f, [0, 10], [0, 1], clamp) };
  if (shot.transition === "whip") {
    const w = interpolate(f, [0, 8], [1, 0], { ...clamp, easing: Easing.out(Easing.cubic) });
    transitionStyle = { transform: `translateX(${w * 400}px)`, filter: `blur(${w * 18}px)` };
  }
  if (shot.transition === "flash") flash = interpolate(f, [0, 10], [1, 0], clamp);

  return (
    <AbsoluteFill style={transitionStyle}>
      <svg viewBox="0 0 1920 1080" width={1080} height={SCENE_H} style={{ position: "absolute", inset: 0 }}>
        <g transform={`translate(${cam.tx} ${cam.ty}) scale(${cam.s})`}>
          <g style={{ filter: `blur(${closeUp ? 5 : 1.2}px)` }}>
            <BackgroundView bg={shot.bg} tod={shot.time ?? "day"} frame={f} />
            {shot.crowd ? <Crowd n={shot.crowd} frame={f} seed={`${index}`} /> : null}
          </g>
          {sorted.map(({ c, i }) => {
            const x = charX(c, f, shot.dur) * 1920;
            const sc = c.scale ?? 1;
            const talking = c.talking ?? (speaking && shot.who === c.id);
            return (
              <g
                key={i}
                transform={`translate(${x} ${1000 - (1 - sc) * 120}) scale(${sc * (story.cast[c.id]?.height ?? 1)})`}
                opacity={c.fade ? Math.max(0.06, 1 - c.fade + Math.sin(f / 2.5 + i) * 0.06 * c.fade) : 1}
              >
                <ellipse cx={8} cy={6} rx={105} ry={16} fill="rgba(0,0,0,0.22)" style={{ filter: "blur(6px)" }} />
                <Character spec={{ ...c, facing: charFacing(c) }} member={story.cast[c.id]} talking={talking} shotDur={shot.dur} seed={index * 7 + i} />
                {c.tag && (
                  <g transform={`translate(0 ${-640 + Math.sin(f / 9 + i) * 6})`} opacity={interpolate(f, [0, 6], [0, 1], clamp)}>
                    <rect x={-(c.tag.length * 19 + 34)} y={-44} width={c.tag.length * 38 + 68} height={72} rx={36} fill="rgba(10,10,20,0.82)" stroke={c.tagColor ?? "#ff4d5e"} strokeWidth={5} />
                    <text x={0} y={10} textAnchor="middle" fontFamily="Montserrat" fontWeight={900} fontSize={48} fill={c.tagColor ?? "#ff4d5e"}>
                      {c.tag}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </g>
      </svg>
      {/* overlays in scene space */}
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transform: `scale(${S})`, transformOrigin: "0 0" }}>
        {shot.popup && <PopupView popup={shot.popup} low={closeUp || !!shot.phone} />}
        {shot.phone && <PhoneView phone={shot.phone} dur={shot.dur} />}
        {shot.banner && <BannerView banner={shot.banner} dur={shot.dur} />}
        {shot.emoji && <EmojiBurst emoji={shot.emoji} />}
        {shot.label && (
          <div
            style={{
              position: "absolute",
              left: 40,
              top: 30,
              fontFamily: "Montserrat",
              fontWeight: 900,
              fontSize: 46,
              letterSpacing: 3,
              color: "#fff",
              textShadow: "0 3px 0 rgba(0,0,0,0.55), 0 0 18px rgba(0,0,0,0.45)",
              opacity: interpolate(f, [0, 6], [0, 1], clamp),
              transform: `translateX(${interpolate(f, [0, 8], [-30, 0], { ...clamp, easing: Easing.out(Easing.cubic) })}px)`,
            }}
          >
            {shot.label}
          </div>
        )}
      </div>
      {flash > 0 && <AbsoluteFill style={{ background: "#fff", opacity: flash }} />}
    </AbsoluteFill>
  );
};

// ---------------- HUD ----------------

const StatHud: React.FC<{ props: EpisodeProps }> = ({ props }) => {
  const f = useCurrentFrame();
  const st = props.story.stat;
  if (!st || !props.statTimeline.length) return null;
  const tl = props.statTimeline;
  let idx = 0;
  for (let i = 0; i < tl.length; i++) if (tl[i].frame <= f) idx = i;
  const cur = tl[idx];
  const prev = tl[Math.max(0, idx - 1)];
  const k = interpolate(f, [cur.frame, cur.frame + 14], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const value = idx === 0 ? cur.value : prev.value + (cur.value - prev.value) * k;
  const delta = idx === 0 ? 0 : cur.value - prev.value;
  const since = f - cur.frame;
  const dec = st.decimals ?? 1;
  const color = delta > 0 && since < 30 ? "#38f28a" : delta < 0 && since < 30 ? "#ff4d5e" : "#fff";
  return (
    <div style={{ position: "absolute", right: 22, top: SCENE_TOP + SCENE_H - 52, fontFamily: "Montserrat", fontWeight: 900, fontSize: 30, color, textShadow: "0 2px 0 rgba(0,0,0,0.6)", letterSpacing: 1 }}>
      {st.name.toUpperCase()}: {value.toFixed(dec)}
      {st.suffix ?? ""}
      {delta !== 0 && since < 36 && (
        <span style={{ position: "absolute", right: 0, top: -40 - since * 1.2, opacity: 1 - since / 36, fontSize: 34, color: delta > 0 ? "#38f28a" : "#ff4d5e" }}>
          {delta > 0 ? "+" : ""}
          {delta.toFixed(dec)}
          {st.suffix ?? ""}
        </span>
      )}
    </div>
  );
};

// ---------------- title / part / end ----------------

const Title: React.FC<{ text: string }> = ({ text }) => (
  <div style={{ position: "absolute", left: 60, right: 60, bottom: 1920 - SCENE_TOP + 70, textAlign: "center", lineHeight: 1.38 }}>
    <span
      style={{
        fontFamily: "Inter",
        fontWeight: 800,
        fontSize: 64,
        color: "#fff",
        background: "#7f7f7f",
        padding: "4px 22px",
        borderRadius: 18,
        boxDecorationBreak: "clone",
        WebkitBoxDecorationBreak: "clone",
      }}
    >
      {text}
    </span>
  </div>
);

const PartPill: React.FC<{ part: number; total: number }> = ({ part, total }) => (
  <div style={{ position: "absolute", top: SCENE_TOP + SCENE_H + 34, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
    <div style={{ fontFamily: "Montserrat", fontWeight: 900, fontSize: 40, color: "#111", background: "#ffd400", padding: "8px 30px", borderRadius: 40, letterSpacing: 2 }}>
      PART {part}
      <span style={{ opacity: 0.55 }}>/{total}</span>
    </div>
  </div>
);

const PartStamp: React.FC<{ part: number }> = ({ part }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: f, fps, config: { damping: 10, stiffness: 170 } });
  const o = interpolate(f, [30, 40], [1, 0], clamp);
  return (
    <div style={{ position: "absolute", top: SCENE_TOP, height: SCENE_H, left: 0, right: 0, display: "flex", alignItems: "center", justifyContent: "center", opacity: o }}>
      <div style={{ transform: `scale(${s}) rotate(-4deg)`, fontFamily: "Montserrat", fontWeight: 900, fontSize: 150, color: "#ffd400", WebkitTextStroke: "8px #111", paintOrder: "stroke", textShadow: "0 10px 0 rgba(0,0,0,0.5)" }}>
        PART {part}
      </div>
    </div>
  );
};

const EndCard: React.FC<{ part: number; total: number }> = ({ part, total }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: f, fps, config: { damping: 11, stiffness: 150 } });
  const last = part >= total;
  return (
    <div style={{ position: "absolute", top: SCENE_TOP, height: SCENE_H, left: 0, right: 0, background: `rgba(0,0,0,${0.6 * Math.min(1, f / 8)})`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14 }}>
      <div style={{ transform: `scale(${s})`, fontFamily: "Montserrat", fontWeight: 900, fontSize: last ? 120 : 96, color: "#fff", textShadow: "0 8px 0 rgba(0,0,0,0.5)" }}>
        {last ? "THE END" : `PART ${part + 1} →`}
      </div>
      {!last && (
        <div style={{ opacity: interpolate(f, [8, 16], [0, 1], clamp), fontFamily: "Inter", fontWeight: 800, fontSize: 40, color: "#ffd400" }}>
          Follow so you don't miss it
        </div>
      )}
    </div>
  );
};

const Captions: React.FC<{ shots: TimedShot[] }> = ({ shots }) => {
  const f = useCurrentFrame();
  const shot = shots.find((s) => f >= s.from && f < s.from + s.dur);
  if (!shot?.words?.length) return null;
  const lf = f - shot.from - VO_OFFSET;
  const groups: (typeof shot.words)[] = [];
  for (let i = 0; i < shot.words.length; i += 4) groups.push(shot.words.slice(i, i + 4));
  const g = groups.find((gr) => lf >= gr[0].start && lf < gr[gr.length - 1].end + 4);
  if (!g) return null;
  return (
    <div style={{ position: "absolute", top: SCENE_TOP + SCENE_H + 140, left: 60, right: 60, textAlign: "center", fontFamily: "Montserrat", fontWeight: 900, fontSize: 62, lineHeight: 1.2, WebkitTextStroke: "10px #000", paintOrder: "stroke" }}>
      {g.map((w, i) => (
        <span key={i} style={{ color: lf >= w.start && lf < w.end ? "#ffd400" : "#fff" }}>
          {w.text}{" "}
        </span>
      ))}
    </div>
  );
};

// ---------------- episode ----------------

export const Episode: React.FC<EpisodeProps> = (props) => {
  const [handle] = useState(() => delayRender("fonts"));
  useEffect(() => {
    document.fonts.ready.then(() => continueRender(handle));
  }, [handle]);
  const { shots, story, part, totalParts, durationInFrames } = props;
  const voiced = shots.filter((s) => s.audio).map((s) => [s.from + VO_OFFSET, s.from + VO_OFFSET + (s.voFrames ?? 0)] as const);
  const base = props.musicVolume ?? 0.2;
  const musicVolume = (f: number) => {
    // duck under the voice, rise in the gaps; average over a short window to avoid pumping
    let acc = 0;
    for (let d = -6; d <= 6; d += 2) acc += voiced.some(([a, b]) => f + d >= a && f + d < b) ? 0.6 : 1;
    const fadeIn = interpolate(f, [0, 15], [0, 1], clamp);
    const fadeOut = interpolate(f, [durationInFrames - 30, durationInFrames], [1, 0], clamp);
    return base * (acc / 7) * fadeIn * fadeOut;
  };
  const endLen = 45;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Title text={story.title} />
      <div style={{ position: "absolute", top: SCENE_TOP, left: 0, width: 1080, height: SCENE_H, overflow: "hidden", background: "#111" }}>
        {shots.map((shot, i) => (
          <Sequence key={i} from={shot.from} durationInFrames={shot.dur} layout="none">
            <AbsoluteFill>
              <ShotView shot={shot} story={story} index={i} />
            </AbsoluteFill>
          </Sequence>
        ))}
      </div>
      <StatHud props={props} />
      <PartPill part={part} total={totalParts} />
      {story.captions && <Captions shots={shots} />}
      <Sequence from={0} durationInFrames={42} layout="none">
        <PartStamp part={part} />
      </Sequence>
      <Sequence from={durationInFrames - endLen} durationInFrames={endLen} layout="none">
        <EndCard part={part} total={totalParts} />
      </Sequence>
      {/* audio */}
      {props.music && <Audio src={staticFile(props.music)} loop volume={musicVolume} />}
      {shots.map((shot, i) => (
        <React.Fragment key={`a${i}`}>
          {shot.audio && (
            <Sequence from={shot.from + VO_OFFSET} layout="none">
              <Audio src={staticFile(shot.audio)} volume={1} />
            </Sequence>
          )}
          {shot.sfxFile && (
            <Sequence from={shot.from} layout="none">
              <Audio src={staticFile(shot.sfxFile)} volume={0.32} />
            </Sequence>
          )}
        </React.Fragment>
      ))}
    </AbsoluteFill>
  );
};
