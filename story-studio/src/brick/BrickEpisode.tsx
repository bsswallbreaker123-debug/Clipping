import React, { useEffect, useLayoutEffect, useState } from "react";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { AbsoluteFill, Audio, Easing, Sequence, continueRender, delayRender, interpolate, random, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import "@fontsource/montserrat/800.css";
import "@fontsource/montserrat/900.css";
import type { BCamera, BChar, BTimedShot, BrickProps } from "./types";
import { BrickChar, Monster } from "./Actors";
import { MONSTER_CENTER, World } from "./World";

const VO_OFFSET = 3;
const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

// ---------------------------------------------------------------- helpers

function charPos(c: BChar, f: number, dur: number): [number, number, number] {
  const z = c.z ?? 0;
  if (c.to && (c.anim === "walk" || c.anim === "run")) {
    const end = c.anim === "run" ? Math.max(10, dur * 0.7) : dur;
    const k = interpolate(f, [0, end], [0, 1], { ...clamp, easing: Easing.inOut(Easing.sin) });
    return [c.x + (c.to[0] - c.x) * k, 0, z + (c.to[1] - z) * k];
  }
  return [c.x, 0, z];
}

function charYaw(c: BChar): number {
  if (c.turn !== undefined) return (c.turn * Math.PI) / 180;
  if (c.to && (c.anim === "walk" || c.anim === "run")) return Math.atan2(c.to[0] - c.x, c.to[1] - (c.z ?? 0));
  return 0;
}

function monsterHead(shot: BTimedShot): [number, number, number] {
  const m = shot.monster!;
  const s = m.scale ?? 1;
  const h = m.type === "stalker" ? 26 : m.type === "brute" ? 18 : 2.5;
  return [m.x, h * s, m.z];
}

function targetOf(id: string, shot: BTimedShot, f: number): { pos: [number, number, number]; head: number } {
  if (id === "monster" && shot.monster) {
    const h = monsterHead(shot);
    return { pos: [h[0], 0, h[2]], head: h[1] };
  }
  const c = (shot.chars ?? []).find((x) => x.id === id) ?? (shot.chars ?? [])[0];
  if (!c) return { pos: [0, 0, 0], head: 4.6 };
  const p = charPos(c, f, shot.dur);
  const sc = 1; // cast scale is applied in the scene; close enough for framing
  const drop = c.anim === "sit" ? 1.0 : c.anim === "crouch" ? 0.6 : 0;
  return { pos: p, head: (4.6 - drop) * sc };
}

// ---------------------------------------------------------------- camera

const CameraRig: React.FC<{ shot: BTimedShot; f: number }> = ({ shot, f }) => {
  const { camera } = useThree();
  useLayoutEffect(() => {
    const k = interpolate(f, [0, Math.max(1, shot.dur)], [0, 1], clamp);
    const e = Easing.inOut(Easing.sin)(k);
    const cam: BCamera = shot.camera ?? "wide";
    let pos = new THREE.Vector3(0, 6, 22);
    let look = new THREE.Vector3(0, 4.5, -4);
    const mc = new THREE.Vector3(MONSTER_CENTER[0], 0, MONSTER_CENTER[1]);
    const hasMonster = !!shot.monster;
    if (cam === "wide") {
      pos = hasMonster ? new THREE.Vector3(0, 7, 30 - e * 3) : new THREE.Vector3(0, 6, 22 - e * 3);
      look = hasMonster ? new THREE.Vector3(0, 15, -14) : new THREE.Vector3(0, 4.2, -4);
    } else if (cam === "establish") {
      const a = 0.6 + e * 0.35;
      pos = new THREE.Vector3(Math.sin(a) * 48, 34 - e * 6, mc.z + Math.cos(a) * 48);
      look = new THREE.Vector3(mc.x, 10, mc.z);
    } else if (cam === "top") {
      pos = new THREE.Vector3(0, 52, mc.z + 8);
      look = new THREE.Vector3(0, 0, mc.z);
    } else if (cam === "orbit") {
      const a = -0.6 + e * 1.2;
      pos = new THREE.Vector3(Math.sin(a) * 34, 14, mc.z + Math.cos(a) * 34);
      look = new THREE.Vector3(mc.x, 11, mc.z);
    } else if (cam === "shake") {
      pos = new THREE.Vector3(Math.sin(f * 2.3) * 0.35, 6 + Math.cos(f * 2.9) * 0.3, 20);
      look = new THREE.Vector3(0, hasMonster ? 9 : 4.5, -6);
    } else if (typeof cam === "object" && "close" in cam) {
      const t = targetOf(cam.close, shot, f);
      if (cam.close === "monster") {
        pos = new THREE.Vector3(t.pos[0] + 3, t.head - 2, t.pos[2] + 17 - e * 2);
        look = new THREE.Vector3(t.pos[0], t.head, t.pos[2]);
      } else {
        const side = cam.side ?? 0.6;
        pos = new THREE.Vector3(t.pos[0] + side * 1.3, t.head + 0.15, t.pos[2] + 5.0 - e * 0.6);
        look = new THREE.Vector3(t.pos[0], t.head - 0.7, t.pos[2]);
      }
    } else if (typeof cam === "object" && "low" in cam) {
      const t = targetOf(cam.low, shot, f);
      if (cam.low === "monster") {
        pos = new THREE.Vector3(t.pos[0] + 7, 1.6, t.pos[2] + 20 - e * 3);
        look = new THREE.Vector3(t.pos[0], t.head * 0.85, t.pos[2]);
      } else {
        pos = new THREE.Vector3(t.pos[0] + 1.5, 1.0, t.pos[2] + 5.5);
        look = new THREE.Vector3(t.pos[0], 4.8, t.pos[2]);
      }
    } else if (typeof cam === "object" && "over" in cam) {
      const a = targetOf(cam.over, shot, f);
      const b = targetOf(cam.at, shot, f);
      const dir = new THREE.Vector3(b.pos[0] - a.pos[0], 0, b.pos[2] - a.pos[2]).normalize();
      pos = new THREE.Vector3(a.pos[0] - dir.x * 4 + 1.6, 6.2, a.pos[2] - dir.z * 4 + 1.2);
      look = new THREE.Vector3(b.pos[0], cam.at === "monster" ? b.head * 0.8 : 4.4, b.pos[2]);
    }
    camera.position.copy(pos);
    camera.lookAt(look);
    camera.updateProjectionMatrix();
  }, [camera, shot, f]);
  return null;
};

// ---------------------------------------------------------------- scene

const Scene: React.FC<{ shot: BTimedShot; f: number; props: BrickProps; index: number }> = ({ shot, f, props, index }) => {
  const { fps } = useVideoConfig();
  const t = f / fps + index * 0.37;
  const speaking = f >= VO_OFFSET && f < VO_OFFSET + (shot.voFrames ?? 0);
  return (
    <>
      <CameraRig shot={shot} f={f} />
      <World shot={shot} frame={f} />
      {(shot.chars ?? []).map((c, i) => {
        const cast = props.story.cast[c.id] ?? {
          name: "",
          shirt: ["#c0392b", "#2e86de", "#27ae60", "#8e44ad", "#f39c12"][Math.floor(random(`cs${index}${i}`) * 5)],
          pants: "#2c3e50",
          hat: (["hair", "cap", "none", "longhair"] as const)[Math.floor(random(`ch${index}${i}`) * 4)],
        };
        const p = charPos(c, f, shot.dur);
        return (
          <group key={i} position={p} rotation={[0, charYaw(c), 0]}>
            <BrickChar cast={cast} anim={c.anim ?? "idle"} face={c.face ?? "neutral"} t={t + i} frame={f} talking={speaking && shot.who === c.id} hold={c.hold} seed={index * 5 + i} />
          </group>
        );
      })}
      {Array.from({ length: shot.crowd ?? 0 }).map((_, i) => {
        const x = (random(`cx${index}${i}`) - 0.5) * 26;
        const z = -6 - random(`cz${index}${i}`) * 10;
        return (
          <group key={`c${i}`} position={[x, 0, z]} rotation={[0, (random(`cr${index}${i}`) - 0.5) * 1.2, 0]}>
            <BrickChar
              cast={{ name: "", shirt: ["#c0392b", "#2e86de", "#27ae60", "#8e44ad", "#f39c12", "#16a085"][i % 6], pants: "#2c3e50", hat: (["hair", "cap", "none", "longhair"] as const)[i % 4], hatColor: ["#3b2416", "#111", "#c9a227"][i % 3] }}
              anim={shot.monster ? "panic" : "idle"}
              face={shot.monster ? "scared" : "neutral"}
              t={t + i * 0.7}
              frame={f}
              talking={false}
              seed={i}
            />
          </group>
        );
      })}
      {shot.monster && (
        <group position={[shot.monster.x, 0, shot.monster.z]} rotation={[0, ((shot.monster.turn ?? 0) * Math.PI) / 180, 0]} scale={shot.monster.scale ?? 1}>
          <Monster spec={shot.monster} t={t} frame={f} />
        </group>
      )}
    </>
  );
};

// ---------------------------------------------------------------- overlays

const Caption: React.FC<{ shot: BTimedShot; f: number }> = ({ shot, f }) => {
  const lf = f - VO_OFFSET;
  const w = (shot.words ?? []).find((x) => lf >= x.start && lf < x.end + 2);
  if (!w) return null;
  const age = lf - w.start;
  const s = interpolate(age, [0, 3, 6], [0.7, 1.12, 1], clamp);
  const text = w.text.replace(/[.,!?;:"]+$/g, "").replace(/^"/, "");
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 1080, display: "flex", justifyContent: "center" }}>
      <div
        style={{
          transform: `scale(${s})`,
          fontFamily: "Montserrat",
          fontWeight: 900,
          fontSize: 118,
          color: "#f5f50a",
          WebkitTextStroke: "16px #000",
          paintOrder: "stroke",
          textShadow: "0 10px 18px rgba(0,0,0,0.45)",
          letterSpacing: -1,
        }}
      >
        {text.toLowerCase()}
      </div>
    </div>
  );
};

const PartBadge: React.FC<{ part: number }> = ({ part }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: f, fps, config: { damping: 12, stiffness: 160 } });
  const o = interpolate(f, [60, 75], [1, 0], clamp);
  return (
    <div style={{ position: "absolute", top: 230, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: o }}>
      <div style={{ transform: `scale(${s})`, fontFamily: "Montserrat", fontWeight: 900, fontSize: 64, color: "#fff", background: "#e11d2e", padding: "10px 34px", borderRadius: 18, boxShadow: "0 8px 20px rgba(0,0,0,0.4)" }}>
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
    <AbsoluteFill style={{ background: `rgba(0,0,0,${0.55 * Math.min(1, f / 8)})`, alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 20 }}>
      <div style={{ transform: `scale(${s})`, fontFamily: "Montserrat", fontWeight: 900, fontSize: last ? 130 : 110, color: "#fff", WebkitTextStroke: "12px #000", paintOrder: "stroke" }}>
        {last ? "THE END" : `PART ${part + 1}`}
      </div>
      {!last && <div style={{ opacity: interpolate(f, [8, 16], [0, 1], clamp), fontFamily: "Montserrat", fontWeight: 900, fontSize: 52, color: "#f5f50a", WebkitTextStroke: "8px #000", paintOrder: "stroke" }}>FOLLOW FOR MORE</div>}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- episode

export const BrickEpisode: React.FC<BrickProps> = (props) => {
  const [handle] = useState(() => delayRender("fonts"));
  useEffect(() => {
    document.fonts.ready.then(() => continueRender(handle));
  }, [handle]);
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const { shots } = props;
  let idx = shots.findIndex((s) => frame >= s.from && frame < s.from + s.dur);
  if (idx < 0) idx = shots.length - 1;
  const shot = shots[idx];
  const f = frame - shot.from;
  let overlay: React.ReactNode = null;
  if (shot.transition === "flash") overlay = <AbsoluteFill style={{ background: "#fff", opacity: interpolate(f, [0, 9], [1, 0], clamp) }} />;
  if (shot.transition === "fade") overlay = <AbsoluteFill style={{ background: "#000", opacity: interpolate(f, [0, 10], [1, 0], clamp) }} />;
  if (shot.transition === "whip") overlay = <AbsoluteFill style={{ backdropFilter: `blur(${interpolate(f, [0, 7], [24, 0], clamp)}px)` }} />;
  const endLen = 45;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <ThreeCanvas width={width} height={height} camera={{ fov: 55, near: 0.1, far: 400 }} shadows gl={{ antialias: true }}>
        <Scene shot={shot} f={f} props={props} index={idx} />
      </ThreeCanvas>
      {shot.label && (
        <div style={{ position: "absolute", top: 380, left: 0, right: 0, textAlign: "center", fontFamily: "Montserrat", fontWeight: 900, fontSize: 66, color: "#fff", WebkitTextStroke: "10px #000", paintOrder: "stroke", opacity: interpolate(f, [0, 6], [0, 1], clamp) }}>
          {shot.label}
        </div>
      )}
      <Caption shot={shot} f={f} />
      {overlay}
      <Sequence from={0} durationInFrames={78} layout="none">
        <PartBadge part={props.part} />
      </Sequence>
      <Sequence from={props.durationInFrames - endLen} durationInFrames={endLen} layout="none">
        <EndCard part={props.part} total={props.totalParts} />
      </Sequence>
      {shots.map((s, i) => (
        <React.Fragment key={i}>
          {s.audio && (
            <Sequence from={s.from + VO_OFFSET} layout="none">
              <Audio src={staticFile(s.audio)} />
            </Sequence>
          )}
          {s.sfxFile && (
            <Sequence from={s.from} layout="none">
              <Audio src={staticFile(s.sfxFile)} volume={0.35} />
            </Sequence>
          )}
        </React.Fragment>
      ))}
    </AbsoluteFill>
  );
};

export const brickDemo: BrickProps = {
  story: {
    id: "demo",
    title: "demo",
    cast: {
      me: { name: "Me", shirt: "#f5c400", pants: "#2f3e66", hat: "hair", hatColor: "#5a3a1e", stripes: true },
      dad: { name: "Dad", shirt: "#1f2d55", pants: "#1f2d55", hat: "police", badge: true, scale: 1.08 },
    },
  },
  part: 1,
  totalParts: 10,
  durationInFrames: 120,
  statTimeline: [],
  shots: [
    {
      from: 0,
      dur: 120,
      set: "square",
      time: "night",
      floodlights: 6,
      police: 3,
      camera: "wide",
      monster: { type: "stalker", x: MONSTER_CENTER[0], z: MONSTER_CENTER[1], anim: "frozen" },
      chars: [
        { id: "me", x: -2, z: 4, face: "scared", hold: "flashlight", anim: "aim", turn: 180 },
        { id: "dad", x: 2.2, z: 3, face: "determined", anim: "radio", turn: 160 },
      ],
      words: [{ text: "monster", start: 0, end: 30 }],
    },
  ],
};
