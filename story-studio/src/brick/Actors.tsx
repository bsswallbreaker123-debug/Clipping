import React, { useMemo } from "react";
import * as THREE from "three";
import type { BAnim, BCast, BFace, BMonsterSpec } from "./types";

// ---------------------------------------------------------------- textures

const faceCache = new Map<string, THREE.CanvasTexture>();

/** Draws a cartoon face (eyes, brows, mouth) on a transparent canvas. */
export function faceTexture(face: BFace, blink: boolean, talk: number): THREE.CanvasTexture {
  const key = `${face}|${blink}|${Math.round(talk * 3)}`;
  const hit = faceCache.get(key);
  if (hit) return hit;
  const c = document.createElement("canvas");
  c.width = 256;
  c.height = 256;
  const g = c.getContext("2d")!;
  g.clearRect(0, 0, 256, 256);
  g.fillStyle = "#1b1b1b";
  g.strokeStyle = "#1b1b1b";
  g.lineCap = "round";
  g.lineJoin = "round";
  const eyeY = 108;
  const ex = [88, 168];
  const wide = face === "scared" || face === "shocked" || face === "screaming";
  // eyes
  ex.forEach((x) => {
    if (blink) {
      g.lineWidth = 8;
      g.beginPath();
      g.moveTo(x - 16, eyeY);
      g.lineTo(x + 16, eyeY);
      g.stroke();
      return;
    }
    if (face === "happy") {
      g.lineWidth = 9;
      g.beginPath();
      g.arc(x, eyeY + 8, 15, Math.PI * 1.15, Math.PI * 1.85);
      g.stroke();
      return;
    }
    const rx = wide ? 17 : 12;
    const ry = wide ? 21 : 17;
    g.fillStyle = wide ? "#ffffff" : "#1b1b1b";
    g.beginPath();
    g.ellipse(x, eyeY, rx, ry, 0, 0, Math.PI * 2);
    g.fill();
    if (wide) {
      g.lineWidth = 5;
      g.stroke();
      g.fillStyle = "#1b1b1b";
      g.beginPath();
      g.arc(x, eyeY + 2, 6, 0, Math.PI * 2);
      g.fill();
    } else {
      g.fillStyle = "#ffffff";
      g.beginPath();
      g.arc(x + 4, eyeY - 6, 4, 0, Math.PI * 2);
      g.fill();
    }
    g.fillStyle = "#1b1b1b";
  });
  // brows
  g.lineWidth = 8;
  const brow = (x: number, inner: number, outer: number) => {
    const dir = x < 128 ? 1 : -1;
    g.beginPath();
    g.moveTo(x - 20 * dir, eyeY - 34 + outer);
    g.lineTo(x + 18 * dir, eyeY - 34 + inner);
    g.stroke();
  };
  if (face === "angry" || face === "determined") ex.forEach((x) => brow(x, face === "angry" ? 12 : 6, -4));
  if (face === "scared" || face === "sad" || face === "screaming") ex.forEach((x) => brow(x, -10, 6));
  if (face === "shocked") ex.forEach((x) => brow(x, -12, -12));
  if (face === "smug") {
    brow(ex[0], 2, 2);
    brow(ex[1], -10, -4);
  }
  // mouth
  const my = 178;
  g.lineWidth = 8;
  const open = talk > 0.15 || face === "screaming" || face === "shocked";
  if (open) {
    const h = face === "screaming" ? 34 : face === "shocked" ? 22 : 8 + talk * 18;
    g.fillStyle = "#3b0d0d";
    g.beginPath();
    g.ellipse(128, my, face === "screaming" ? 26 : 18, h, 0, 0, Math.PI * 2);
    g.fill();
    g.fillStyle = "#1b1b1b";
  } else if (face === "happy" || face === "neutral") {
    g.beginPath();
    g.arc(128, my - 18, 30, Math.PI * 0.2, Math.PI * 0.8);
    g.stroke();
  } else if (face === "smug") {
    g.beginPath();
    g.moveTo(100, my);
    g.quadraticCurveTo(130, my + 10, 160, my - 12);
    g.stroke();
  } else if (face === "sad" || face === "scared") {
    g.beginPath();
    g.arc(128, my + 22, 26, Math.PI * 1.2, Math.PI * 1.8);
    g.stroke();
  } else {
    g.beginPath();
    g.moveTo(104, my);
    g.lineTo(152, my);
    g.stroke();
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  faceCache.set(key, tex);
  return tex;
}

// ---------------------------------------------------------------- character

const std = (color: string, extra: Partial<THREE.MeshStandardMaterialParameters> = {}) => (
  <meshStandardMaterial color={color} roughness={0.65} metalness={0.05} {...extra} />
);

function poseFor(anim: BAnim, t: number) {
  // arm/leg rotations around X (forward swing) and Z (sideways), body bob/lean
  const p = { la: 0, ra: 0, laz: 0.05, raz: -0.05, ll: 0, rl: 0, bob: 0, lean: 0, headTilt: 0, sit: false, fall: 0 };
  const breathe = Math.sin(t * 2) * 0.02;
  p.bob = breathe;
  switch (anim) {
    case "walk": {
      const s = Math.sin(t * 7);
      p.la = s * 0.6;
      p.ra = -s * 0.6;
      p.ll = -s * 0.6;
      p.rl = s * 0.6;
      p.bob = Math.abs(Math.cos(t * 7)) * 0.12;
      break;
    }
    case "run": {
      const s = Math.sin(t * 12);
      p.la = s * 1.1;
      p.ra = -s * 1.1;
      p.ll = -s * 1.0;
      p.rl = s * 1.0;
      p.bob = Math.abs(Math.cos(t * 12)) * 0.25;
      p.lean = 0.15;
      break;
    }
    case "talk":
      p.ra = -0.4 + Math.sin(t * 4) * 0.25;
      p.headTilt = Math.sin(t * 3) * 0.06;
      break;
    case "point":
      p.ra = -1.55;
      break;
    case "aim":
      p.ra = -1.5;
      p.la = -1.4;
      p.laz = -0.25;
      break;
    case "radio":
      p.ra = -2.4;
      p.raz = 0.5;
      break;
    case "wave":
      p.ra = -2.8 + Math.sin(t * 9) * 0.25;
      p.raz = -0.3;
      break;
    case "panic":
      p.la = -2.9 + Math.sin(t * 14) * 0.2;
      p.ra = -2.9 - Math.sin(t * 14) * 0.2;
      p.laz = 0.3;
      p.raz = -0.3;
      p.bob = Math.abs(Math.sin(t * 10)) * 0.1;
      break;
    case "lookup":
      p.headTilt = -0.35;
      p.la = 0.1;
      p.ra = 0.1;
      break;
    case "crouch":
      p.bob = -0.6;
      p.ll = -0.9;
      p.rl = -0.9;
      p.la = -0.6;
      p.ra = -0.6;
      break;
    case "sit":
      p.sit = true;
      p.ll = -1.57;
      p.rl = -1.57;
      p.bob = -1.0;
      break;
    case "fall":
      p.fall = 1;
      p.la = -2.6;
      p.ra = -2.2;
      break;
  }
  return p;
}

export const BrickChar: React.FC<{
  cast: BCast;
  anim: BAnim;
  face: BFace;
  t: number;
  frame: number;
  talking: boolean;
  hold?: string;
  seed: number;
}> = ({ cast, anim, face, t, frame, talking, hold, seed }) => {
  const p = poseFor(talking && anim === "idle" ? "talk" : anim, t);
  const blink = (t + seed * 0.7) % 3.6 < 0.12;
  const talk = talking ? Math.max(0, Math.sin(t * 16) * 0.6 + Math.sin(t * 6.1) * 0.5) : 0;
  const tex = useMemo(() => faceTexture(face, blink, talk), [face, blink, talk]);
  const skin = cast.skin ?? "#f5c58a";
  const pants = cast.pants ?? "#2f3e66";
  const hatColor = cast.hatColor ?? (cast.hat === "police" ? "#1f2d55" : "#3b2416");
  const fallRot = p.fall ? Math.min(1, frame / 10) * -1.45 : 0;

  const limb = (x: number, y: number, rx: number, rz: number, color: string, len = 2, top?: string) => (
    <group position={[x, y, 0]} rotation={[rx, 0, rz]}>
      <mesh position={[0, -len / 2, 0]} castShadow>
        <boxGeometry args={[0.95, len, 0.95]} />
        {std(color)}
      </mesh>
      {top && (
        <mesh position={[0, -0.35, 0]} castShadow>
          <boxGeometry args={[1.0, 0.72, 1.0]} />
          {std(top)}
        </mesh>
      )}
    </group>
  );

  return (
    <group scale={cast.scale ?? 1} rotation={[fallRot, 0, 0]} position={[0, p.fall ? Math.min(1, frame / 10) * 0.5 : 0, 0]}>
      <group position={[0, p.bob + (p.sit ? -0.9 : 0), 0]} rotation={[p.lean, 0, 0]}>
        {/* legs */}
        {limb(-0.5, 2, p.ll, 0, pants)}
        {limb(0.5, 2, p.rl, 0, pants)}
        {/* torso */}
        <mesh position={[0, 3, 0]} castShadow>
          <boxGeometry args={[2, 2, 1]} />
          {std(cast.shirt)}
        </mesh>
        {cast.stripes && (
          <>
            <mesh position={[0, 2.6, 0.51]}>
              <boxGeometry args={[2.02, 0.16, 0.02]} />
              <meshStandardMaterial color="#e8e8e8" emissive="#8a8a8a" />
            </mesh>
            <mesh position={[0, 3.4, 0.51]}>
              <boxGeometry args={[2.02, 0.16, 0.02]} />
              <meshStandardMaterial color="#e8e8e8" emissive="#8a8a8a" />
            </mesh>
          </>
        )}
        {cast.badge && (
          <>
            <mesh position={[-0.5, 3.4, 0.52]}>
              <boxGeometry args={[0.28, 0.32, 0.04]} />
              <meshStandardMaterial color="#f2c14e" metalness={0.6} roughness={0.3} />
            </mesh>
            <mesh position={[0.55, 3.3, 0.55]}>
              <boxGeometry args={[0.22, 0.42, 0.12]} />
              {std("#1a1a1a")}
            </mesh>
          </>
        )}
        {/* arms (pivot at shoulder) */}
        {limb(-1.5, 3.95, p.la, p.laz, skin, 2, cast.shirt)}
        <group position={[1.5, 3.95, 0]} rotation={[p.ra, 0, p.raz]}>
          <mesh position={[0, -1, 0]} castShadow>
            <boxGeometry args={[0.95, 2, 0.95]} />
            {std(skin)}
          </mesh>
          <mesh position={[0, -0.35, 0]} castShadow>
            <boxGeometry args={[1.0, 0.72, 1.0]} />
            {std(cast.shirt)}
          </mesh>
          {hold === "flashlight" && (
            <group position={[0, -2.05, 0.2]} rotation={[Math.PI / 2, 0, 0]}>
              <mesh>
                <cylinderGeometry args={[0.16, 0.12, 0.9, 12]} />
                {std("#222")}
              </mesh>
              <mesh position={[0, 0.46, 0]}>
                <cylinderGeometry args={[0.17, 0.17, 0.05, 12]} />
                <meshBasicMaterial color="#fffbe0" />
              </mesh>
            </group>
          )}
          {(hold === "radio" || hold === "phone") && (
            <mesh position={[0, -2.05, 0.25]}>
              <boxGeometry args={[0.32, 0.6, 0.14]} />
              {hold === "phone" ? <meshStandardMaterial color="#111" emissive="#5b8cff" emissiveIntensity={0.6} /> : std("#1a1a1a")}
            </mesh>
          )}
        </group>
        {/* head */}
        <group position={[0, 4.6, 0]} rotation={[p.headTilt, 0, 0]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.62, 0.62, 1.15, 28]} />
            {std(skin)}
          </mesh>
          <mesh position={[0, 0, 0.63]}>
            <planeGeometry args={[1.05, 1.05]} />
            <meshBasicMaterial map={tex} transparent />
          </mesh>
          {cast.hat === "hair" && (
            <mesh position={[0, 0.45, -0.05]} castShadow>
              <boxGeometry args={[1.35, 0.42, 1.35]} />
              {std(hatColor)}
            </mesh>
          )}
          {cast.hat === "longhair" && (
            <>
              <mesh position={[0, 0.45, -0.05]} castShadow>
                <boxGeometry args={[1.4, 0.45, 1.4]} />
                {std(hatColor)}
              </mesh>
              <mesh position={[0, -0.25, -0.45]} castShadow>
                <boxGeometry args={[1.4, 1.4, 0.5]} />
                {std(hatColor)}
              </mesh>
            </>
          )}
          {(cast.hat === "cap" || cast.hat === "police") && (
            <>
              <mesh position={[0, 0.62, 0]} castShadow>
                <cylinderGeometry args={[0.68, 0.68, 0.32, 24]} />
                {std(hatColor)}
              </mesh>
              <mesh position={[0, 0.5, 0.65]}>
                <boxGeometry args={[1.1, 0.08, 0.6]} />
                {std(cast.hat === "police" ? "#111" : hatColor)}
              </mesh>
              {cast.hat === "police" && (
                <mesh position={[0, 0.66, 0.69]}>
                  <boxGeometry args={[0.22, 0.2, 0.04]} />
                  <meshStandardMaterial color="#f2c14e" metalness={0.6} roughness={0.3} />
                </mesh>
              )}
            </>
          )}
          {cast.hat === "beanie" && (
            <mesh position={[0, 0.55, 0]} castShadow>
              <cylinderGeometry args={[0.5, 0.68, 0.55, 24]} />
              {std(hatColor)}
            </mesh>
          )}
          {cast.hat === "helmet" && (
            <mesh position={[0, 0.45, 0]} castShadow>
              <sphereGeometry args={[0.78, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
              {std(hatColor)}
            </mesh>
          )}
        </group>
      </group>
    </group>
  );
};

// ---------------------------------------------------------------- monsters (original designs)

export const Monster: React.FC<{ spec: BMonsterSpec; t: number; frame: number }> = ({ spec, t, frame }) => {
  const eye = spec.eyes ?? "#ffffff";
  const frozen = spec.anim === "frozen";
  const k = frozen ? 0 : 1;
  const sway = Math.sin(t * 1.3) * 0.04 * k;
  const reach = spec.anim === "reach" ? Math.min(1, frame / 20) : 0;
  const scream = spec.anim === "scream" ? 1 : 0;
  const shake = scream ? Math.sin(frame * 2.1) * 0.08 : 0;
  const dark = "#26272b";
  const darker = "#151518";

  if (spec.type === "brute") {
    return (
      <group rotation={[0, 0, sway + shake]}>
        {[-1, 1].map((s) => (
          <mesh key={s} position={[s * 2.2, 3.5, 0]} castShadow>
            <boxGeometry args={[2.6, 7, 2.6]} />
            <meshStandardMaterial color={darker} roughness={0.9} />
          </mesh>
        ))}
        <mesh position={[0, 11, 0]} castShadow>
          <boxGeometry args={[8, 8, 5]} />
          <meshStandardMaterial color={dark} roughness={0.9} />
        </mesh>
        {[-1, 1].map((s) => (
          <group key={s} position={[s * 5.2, 14, 0]} rotation={[-reach * 1.2 * (s > 0 ? 1 : 0.3), 0, s * (0.15 + Math.sin(t + s) * 0.05 * k)]}>
            <mesh position={[0, -4, 0]} castShadow>
              <boxGeometry args={[2.2, 9, 2.2]} />
              <meshStandardMaterial color={darker} roughness={0.9} />
            </mesh>
          </group>
        ))}
        <mesh position={[0, 17.5, 0.5]} castShadow>
          <boxGeometry args={[5, 4.5, 4]} />
          <meshStandardMaterial color={dark} roughness={0.9} />
        </mesh>
        {[-1, 1].map((s) => (
          <mesh key={s} position={[s * 1.2, 18.3, 2.52]}>
            <boxGeometry args={[0.9, 0.5, 0.05]} />
            <meshBasicMaterial color={eye} />
          </mesh>
        ))}
        <mesh position={[0, 16.6, 2.52]}>
          <boxGeometry args={[2.6, 0.5 + scream * 1.4, 0.05]} />
          <meshBasicMaterial color="#0a0000" />
        </mesh>
        <pointLight position={[0, 18, 4]} color={eye} intensity={6} distance={14} />
      </group>
    );
  }

  if (spec.type === "crawler") {
    return (
      <group rotation={[0, 0, shake]}>
        <mesh position={[0, 2, 0]} castShadow>
          <boxGeometry args={[3, 1.6, 6]} />
          <meshStandardMaterial color={dark} roughness={0.9} />
        </mesh>
        {[-1, 1].map((s) =>
          [-2, 0, 2].map((z, i) => (
            <group key={`${s}${z}`} position={[s * 1.4, 2, z]} rotation={[Math.sin(t * 6 + i) * 0.3 * k, 0, s * 0.9]}>
              <mesh position={[0, -1.4, 0]} castShadow>
                <boxGeometry args={[0.35, 3, 0.35]} />
                <meshStandardMaterial color={darker} />
              </mesh>
            </group>
          )),
        )}
        <mesh position={[0, 2.4, 3.4]} castShadow>
          <boxGeometry args={[2, 1.6, 1.4]} />
          <meshStandardMaterial color={dark} />
        </mesh>
        {[-1, 1].map((s) => (
          <mesh key={s} position={[s * 0.5, 2.6, 4.12]}>
            <boxGeometry args={[0.35, 0.35, 0.05]} />
            <meshBasicMaterial color={eye} />
          </mesh>
        ))}
        <pointLight position={[0, 2.5, 5]} color={eye} intensity={3} distance={8} />
      </group>
    );
  }

  // stalker: extremely tall, thin, a speaker-less box head with a ring of teeth, long arms
  const legY = 16;
  return (
    <group rotation={[0, 0, sway + shake]}>
      {[-1, 1].map((s) => (
        <group key={s} position={[s * 1.2, legY, 0]} rotation={[spec.anim === "step" ? Math.sin(t * 2) * 0.25 * s : 0, 0, s * 0.08]}>
          <mesh position={[0, -legY / 2, 0]} castShadow>
            <boxGeometry args={[0.7, legY, 0.7]} />
            <meshStandardMaterial color={darker} roughness={0.95} />
          </mesh>
        </group>
      ))}
      <mesh position={[0, legY + 4, 0]} castShadow>
        <boxGeometry args={[3.4, 8, 1.6]} />
        <meshStandardMaterial color={dark} roughness={0.95} />
      </mesh>
      {/* spikes */}
      {Array.from({ length: 7 }).map((_, i) => (
        <mesh key={i} position={[-1.8 + i * 0.6, legY + 8.4 + (i % 2) * 0.6, -0.3]} rotation={[0, 0, (i - 3) * 0.25]} castShadow>
          <coneGeometry args={[0.22, 2.4, 4]} />
          <meshStandardMaterial color="#cfcfd4" roughness={0.4} />
        </mesh>
      ))}
      {[-1, 1].map((s) => (
        <group key={s} position={[s * 2.1, legY + 7.4, 0]} rotation={[-(s > 0 ? reach : reach * 0.4) * 1.3, 0, s * (0.12 + Math.sin(t * 1.1 + s) * 0.04 * k)]}>
          <mesh position={[0, -6.5, 0]} castShadow>
            <boxGeometry args={[0.55, 13, 0.55]} />
            <meshStandardMaterial color={darker} roughness={0.95} />
          </mesh>
          {/* claws */}
          {[-0.3, 0, 0.3].map((c) => (
            <mesh key={c} position={[c, -13.6, 0.2]} rotation={[0.3, 0, c]}>
              <coneGeometry args={[0.12, 1.6, 4]} />
              <meshStandardMaterial color="#d9d9de" />
            </mesh>
          ))}
          {spec.holding && s > 0 && (
            <mesh position={[0, -14.2, 0.6]} castShadow>
              <boxGeometry args={[1.2, 2.4, 1]} />
              <meshStandardMaterial color="#1f2d55" />
            </mesh>
          )}
        </group>
      ))}
      {/* head */}
      <group position={[0, legY + 10.2, 0.2]} rotation={[0.1 - scream * 0.25, 0, 0]}>
        <mesh castShadow>
          <boxGeometry args={[3.4, 3.4, 2.6]} />
          <meshStandardMaterial color="#d8d6cf" roughness={0.7} />
        </mesh>
        {[-1, 1].map((s) => (
          <mesh key={s} position={[s * 0.9, 0.6, 1.31]}>
            <circleGeometry args={[0.45, 20]} />
            <meshBasicMaterial color="#0b0b0b" />
          </mesh>
        ))}
        {[-1, 1].map((s) => (
          <mesh key={`p${s}`} position={[s * 0.9, 0.6, 1.32]}>
            <circleGeometry args={[0.12, 12]} />
            <meshBasicMaterial color={eye} />
          </mesh>
        ))}
        <mesh position={[0, -0.75, 1.31]}>
          <circleGeometry args={[0.85 + scream * 0.25, 24]} />
          <meshBasicMaterial color="#120404" />
        </mesh>
        {Array.from({ length: 12 }).map((_, i) => {
          const a = (i / 12) * Math.PI * 2;
          return (
            <mesh key={i} position={[Math.cos(a) * 0.75, -0.75 + Math.sin(a) * 0.75, 1.33]} rotation={[0, 0, a + Math.PI / 2]}>
              <coneGeometry args={[0.1, 0.34, 3]} />
              <meshBasicMaterial color="#efefef" />
            </mesh>
          );
        })}
      </group>
    </group>
  );
};
