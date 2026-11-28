import React, { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { random } from "remotion";
import type { BShot } from "./types";

// ---------------------------------------------------------------- procedural textures

const texCache = new Map<string, THREE.Texture>();

function canvasTex(key: string, w: number, h: number, draw: (g: CanvasRenderingContext2D) => void, repeat?: [number, number]) {
  const hit = texCache.get(key);
  if (hit) return hit;
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  draw(c.getContext("2d")!);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  if (repeat) {
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(repeat[0], repeat[1]);
  }
  texCache.set(key, t);
  return t;
}

const windowsTex = (variant: number, lit: boolean) =>
  canvasTex(`win${variant}${lit}`, 128, 256, (g) => {
    g.fillStyle = lit ? "#000000" : ["#5d6b85", "#6f6a7d", "#7c8aa0", "#8a7f74"][variant % 4];
    g.fillRect(0, 0, 128, 256);
    for (let r = 0; r < 16; r++)
      for (let c = 0; c < 6; c++) {
        const on = random(`w${variant}-${r}-${c}`) > 0.45;
        g.fillStyle = lit ? (on ? ["#ffd98a", "#fff2c4", "#bfe3ff"][(r + c) % 3] : "#000000") : on ? "#b9d7ef" : "#9fb6cc";
        g.fillRect(6 + c * 20, 6 + r * 15.5, 12, 9);
      }
  });

const tilesTex = (color: string, line: string, rep: number) =>
  canvasTex(`tile${color}${line}${rep}`, 128, 128, (g) => {
    g.fillStyle = color;
    g.fillRect(0, 0, 128, 128);
    g.strokeStyle = line;
    g.lineWidth = 3;
    g.strokeRect(0, 0, 128, 128);
    g.beginPath();
    g.moveTo(64, 0);
    g.lineTo(64, 128);
    g.moveTo(0, 64);
    g.lineTo(128, 64);
    g.stroke();
  }, [rep, rep]);

const roadTex = () =>
  canvasTex("road", 128, 256, (g) => {
    g.fillStyle = "#2c2f36";
    g.fillRect(0, 0, 128, 256);
    g.fillStyle = "#e9e3c9";
    g.fillRect(60, 20, 8, 90);
    g.fillRect(60, 150, 8, 90);
  }, [1, 12]);

// ---------------------------------------------------------------- building blocks

const Building: React.FC<{ x: number; z: number; w: number; d: number; h: number; v: number; night: boolean; blackout?: boolean }> = ({ x, z, w, d, h, v, night, blackout }) => {
  const map = windowsTex(v, false);
  const emis = windowsTex(v, true);
  const mat = useMemo(() => {
    const m = map.clone();
    m.wrapS = m.wrapT = THREE.RepeatWrapping;
    m.repeat.set(Math.max(1, w / 8), Math.max(1, h / 16));
    m.needsUpdate = true;
    const e = emis.clone();
    e.wrapS = e.wrapT = THREE.RepeatWrapping;
    e.repeat.copy(m.repeat);
    e.needsUpdate = true;
    return { m, e };
  }, [map, emis, w, h]);
  return (
    <mesh position={[x, h / 2, z]} castShadow receiveShadow>
      <boxGeometry args={[w, h, d]} />
      <meshStandardMaterial map={mat.m} emissiveMap={mat.e} emissive="#ffffff" emissiveIntensity={night && !blackout ? 1.2 : 0} roughness={0.85} />
    </mesh>
  );
};

const Skyline: React.FC<{ night: boolean; blackout?: boolean; radius?: number; count?: number; y?: number }> = ({ night, blackout, radius = 55, count = 26, y = 0 }) => (
  <group position={[0, y, 0]}>
    {Array.from({ length: count }).map((_, i) => {
      const a = (i / count) * Math.PI * 2 + random(`sa${i}`) * 0.2;
      const r = radius + random(`sr${i}`) * 25;
      return (
        <Building
          key={i}
          x={Math.cos(a) * r}
          z={Math.sin(a) * r - 10}
          w={8 + random(`sw${i}`) * 10}
          d={8 + random(`sd${i}`) * 10}
          h={16 + random(`sh${i}`) * 50}
          v={i % 4}
          night={night}
          blackout={blackout}
        />
      );
    })}
  </group>
);

const FloodTower: React.FC<{ x: number; z: number; target: [number, number, number]; on: boolean; flicker?: boolean; frame: number }> = ({ x, z, target, on, frame }) => {
  const H = 16;
  const dir = new THREE.Vector3(target[0] - x, target[1] - H, target[2] - z);
  const len = dir.length();
  const yaw = Math.atan2(dir.x, dir.z);
  const pitch = Math.atan2(-dir.y, Math.hypot(dir.x, dir.z));
  const spot = useRef<THREE.SpotLight>(null);
  const tgt = useMemo(() => new THREE.Object3D(), []);
  useLayoutEffect(() => {
    tgt.position.set(target[0], target[1], target[2]);
    tgt.updateMatrixWorld();
    if (spot.current) spot.current.target = tgt;
  }, [tgt, target]);
  return (
    <group>
      <group position={[x, 0, z]}>
        {[-1, 1].map((sx) =>
          [-1, 1].map((sz) => (
            <mesh key={`${sx}${sz}`} position={[sx * 0.8, H / 2, sz * 0.8]} rotation={[sz * 0.04, 0, -sx * 0.04]} castShadow>
              <boxGeometry args={[0.22, H, 0.22]} />
              <meshStandardMaterial color="#1d1f24" />
            </mesh>
          )),
        )}
        {Array.from({ length: 7 }).map((_, i) => (
          <mesh key={i} position={[0, 1 + i * 2.2, 0]} rotation={[0, 0, i % 2 ? 0.7 : -0.7]}>
            <boxGeometry args={[2.2, 0.12, 0.12]} />
            <meshStandardMaterial color="#1d1f24" />
          </mesh>
        ))}
        <group position={[0, H, 0]} rotation={[0, yaw, 0]}>
          <group rotation={[pitch, 0, 0]}>
            <mesh>
              <boxGeometry args={[3, 2, 1]} />
              <meshStandardMaterial color="#2a2c33" />
            </mesh>
            <mesh position={[0, 0, 0.51]}>
              <planeGeometry args={[2.7, 1.7]} />
              <meshBasicMaterial color={on ? "#fffbe6" : "#3a3a3a"} />
            </mesh>
            {on && (
              <mesh position={[0, 0, len / 2]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[4.5, 1.2, len, 24, 1, true]} />
                <meshBasicMaterial color="#fff6d8" transparent opacity={0.07 + 0.01 * Math.sin(frame / 3)} depthWrite={false} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} />
              </mesh>
            )}
          </group>
        </group>
      </group>
      {on && <spotLight ref={spot} position={[x, H, z]} angle={0.35} penumbra={0.5} intensity={900} distance={70} decay={1.6} color="#fff4dc" />}
    </group>
  );
};

const PoliceCar: React.FC<{ x: number; z: number; turn: number; frame: number; lightsOn?: boolean }> = ({ x, z, turn, frame, lightsOn = true }) => {
  const phase = Math.floor(frame / 6) % 2;
  return (
    <group position={[x, 0, z]} rotation={[0, turn, 0]}>
      <mesh position={[0, 0.9, 0]} castShadow>
        <boxGeometry args={[2.6, 1.1, 5.4]} />
        <meshStandardMaterial color="#f2f2f2" />
      </mesh>
      <mesh position={[0, 0.9, 0]}>
        <boxGeometry args={[2.62, 0.5, 2.2]} />
        <meshStandardMaterial color="#1b2a4a" />
      </mesh>
      <mesh position={[0, 1.8, -0.3]} castShadow>
        <boxGeometry args={[2.3, 0.9, 2.8]} />
        <meshStandardMaterial color="#0f1726" roughness={0.2} metalness={0.4} />
      </mesh>
      <mesh position={[-0.5, 2.35, -0.3]}>
        <boxGeometry args={[0.9, 0.25, 0.5]} />
        <meshBasicMaterial color={lightsOn && phase ? "#ff2a2a" : "#4a0d0d"} />
      </mesh>
      <mesh position={[0.5, 2.35, -0.3]}>
        <boxGeometry args={[0.9, 0.25, 0.5]} />
        <meshBasicMaterial color={lightsOn && !phase ? "#2a5bff" : "#0d1a4a"} />
      </mesh>
      {[-1, 1].map((s) =>
        [-1.7, 1.7].map((w) => (
          <mesh key={`${s}${w}`} position={[s * 1.3, 0.45, w]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.45, 0.45, 0.35, 16]} />
            <meshStandardMaterial color="#111" />
          </mesh>
        )),
      )}
      {lightsOn && <pointLight position={[0, 3, 0]} color={phase ? "#ff2a2a" : "#2a5bff"} intensity={40} distance={14} />}
      {lightsOn &&
        [-0.8, 0.8].map((s) => (
          <mesh key={s} position={[s, 1, 2.71]}>
            <planeGeometry args={[0.6, 0.3]} />
            <meshBasicMaterial color="#fffbe0" />
          </mesh>
        ))}
    </group>
  );
};

const Tree: React.FC<{ x: number; z: number; s?: number }> = ({ x, z, s = 1 }) => (
  <group position={[x, 0, z]} scale={s}>
    <mesh position={[0, 1.5, 0]} castShadow>
      <boxGeometry args={[0.8, 3, 0.8]} />
      <meshStandardMaterial color="#6b4a2f" />
    </mesh>
    <mesh position={[0, 4.4, 0]} castShadow>
      <boxGeometry args={[3.6, 3.2, 3.6]} />
      <meshStandardMaterial color="#3f8f3a" />
    </mesh>
    <mesh position={[0, 6.2, 0]} castShadow>
      <boxGeometry args={[2.2, 1.6, 2.2]} />
      <meshStandardMaterial color="#4aa143" />
    </mesh>
  </group>
);

const StreetLamp: React.FC<{ x: number; z: number; on: boolean }> = ({ x, z, on }) => (
  <group position={[x, 0, z]}>
    <mesh position={[0, 3.5, 0]}>
      <boxGeometry args={[0.25, 7, 0.25]} />
      <meshStandardMaterial color="#25272c" />
    </mesh>
    <mesh position={[0, 7.1, 0]}>
      <boxGeometry args={[1, 0.3, 0.6]} />
      <meshBasicMaterial color={on ? "#ffe7a8" : "#333"} />
    </mesh>
    {on && <pointLight position={[0, 6.6, 0]} color="#ffd98a" intensity={30} distance={14} />}
  </group>
);

// ---------------------------------------------------------------- weather

const Rain: React.FC<{ frame: number; heavy?: boolean }> = ({ frame, heavy }) => {
  const N = heavy ? 1600 : 900;
  const ref = useRef<THREE.InstancedMesh>(null);
  const seeds = useMemo(() => Array.from({ length: N }, (_, i) => [random(`rx${i}`), random(`ry${i}`), random(`rz${i}`)]), [N]);
  useLayoutEffect(() => {
    const m = new THREE.Matrix4();
    seeds.forEach(([a, b, c], i) => {
      const y = 40 - ((b * 40 + frame * 1.6) % 40);
      m.makeTranslation((a - 0.5) * 60, y, (c - 0.5) * 60 - 5);
      ref.current?.setMatrixAt(i, m);
    });
    if (ref.current) ref.current.instanceMatrix.needsUpdate = true;
  }, [frame, seeds]);
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, N]}>
      <boxGeometry args={[0.03, 1.1, 0.03]} />
      <meshBasicMaterial color="#b8c8e8" transparent opacity={0.45} />
    </instancedMesh>
  );
};

// ---------------------------------------------------------------- interiors

const Room: React.FC<{ kind: "bedroom" | "livingroom" | "school" | "bunker"; night: boolean; blackout?: boolean }> = ({ kind, night, blackout }) => {
  const wall = kind === "bunker" ? "#5b5f63" : kind === "school" ? "#d9d2b8" : kind === "bedroom" ? "#7d8fb3" : "#c9a982";
  const floor = kind === "bunker" ? tilesTex("#4a4d52", "#3a3c40", 12) : kind === "school" ? tilesTex("#c8c2b0", "#a9a291", 10) : tilesTex("#8a6545", "#6f5036", 8);
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial map={floor} />
      </mesh>
      <mesh position={[0, 7, -10]} receiveShadow>
        <boxGeometry args={[40, 14, 0.5]} />
        <meshStandardMaterial color={wall} />
      </mesh>
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * 14, 7, 0]} receiveShadow>
          <boxGeometry args={[0.5, 14, 40]} />
          <meshStandardMaterial color={wall} />
        </mesh>
      ))}
      <mesh position={[0, 14, 0]}>
        <boxGeometry args={[40, 0.5, 40]} />
        <meshStandardMaterial color="#e8e4da" />
      </mesh>
      {kind !== "bunker" && (
        <group position={[6, 6.5, -9.7]}>
          <mesh>
            <boxGeometry args={[7, 5, 0.3]} />
            <meshStandardMaterial color="#efefef" />
          </mesh>
          <mesh position={[0, 0, 0.2]}>
            <planeGeometry args={[6.4, 4.4]} />
            <meshBasicMaterial color={night ? "#16204a" : "#9fd3ff"} />
          </mesh>
          {night &&
            !blackout &&
            Array.from({ length: 14 }).map((_, i) => (
              <mesh key={i} position={[-2.8 + random(`rw${i}`) * 5.6, -1.8 + random(`rh${i}`) * 2.4, 0.22]}>
                <planeGeometry args={[0.18, 0.24]} />
                <meshBasicMaterial color="#ffd98a" />
              </mesh>
            ))}
        </group>
      )}
      {kind === "bedroom" && (
        <group position={[-7, 0, -6]}>
          <mesh position={[0, 1, 0]} castShadow>
            <boxGeometry args={[6, 2, 8]} />
            <meshStandardMaterial color="#3b5998" />
          </mesh>
          <mesh position={[0, 2.2, -3]}>
            <boxGeometry args={[4, 0.6, 1.4]} />
            <meshStandardMaterial color="#f2f2f2" />
          </mesh>
        </group>
      )}
      {kind === "livingroom" && (
        <group position={[-5, 0, -7]}>
          <mesh position={[0, 1.2, 0]} castShadow>
            <boxGeometry args={[8, 2.4, 3]} />
            <meshStandardMaterial color="#6b4f8a" />
          </mesh>
          <mesh position={[0, 3, -1.3]} castShadow>
            <boxGeometry args={[8, 2.4, 0.8]} />
            <meshStandardMaterial color="#5c4377" />
          </mesh>
        </group>
      )}
      {kind === "school" &&
        Array.from({ length: 10 }).map((_, i) => (
          <mesh key={i} position={[-12 + i * 2.6, 4, -9.5]} castShadow>
            <boxGeometry args={[2.4, 8, 0.8]} />
            <meshStandardMaterial color={i % 2 ? "#c0392b" : "#2e8b6d"} />
          </mesh>
        ))}
      {kind === "bunker" &&
        Array.from({ length: 4 }).map((_, i) => (
          <mesh key={i} position={[-9 + i * 6, 6, -9.6]}>
            <planeGeometry args={[4.6, 3]} />
            <meshBasicMaterial color={["#2bd96b", "#3fb6ff", "#ff4d5e", "#2bd96b"][i]} transparent opacity={0.85} />
          </mesh>
        ))}
      {!blackout && <pointLight position={[0, 12, 0]} color={kind === "bunker" ? "#ff6655" : "#fff1d6"} intensity={kind === "bunker" ? 80 : 140} distance={40} />}
    </group>
  );
};

// ---------------------------------------------------------------- the world

export const MONSTER_CENTER: [number, number] = [0, -22];

export const World: React.FC<{ shot: BShot; frame: number }> = ({ shot, frame }) => {
  const time = shot.time ?? "night";
  const night = time === "night";
  const dusk = time === "dusk";
  const sky = night ? "#0d1330" : dusk ? "#f08a5d" : "#8fc9f2";
  const fog = shot.weather === "fog" || shot.set === "forest" ? 0.55 : shot.weather === "rain" || shot.weather === "storm" ? 0.75 : 1;
  const flash = shot.lightning ? Math.max(0, 1 - ((frame + 7) % 45) / 6) : 0;
  const ambient = (night ? 0.6 : dusk ? 0.8 : 1.1) * (shot.blackout ? 0.45 : 1) + flash * 2.5;
  const indoor = ["bedroom", "livingroom", "school", "bunker"].includes(shot.set);
  const towers = 6;
  const on = shot.floodlights ?? 0;

  return (
    <>
      <color attach="background" args={[flash > 0.3 ? "#c9d4ff" : sky]} />
      <fog attach="fog" args={[flash > 0.3 ? "#c9d4ff" : sky, 30 * fog, 140 * fog]} />
      <hemisphereLight args={[night ? "#5b6fb3" : "#ffffff", night ? "#1a1a24" : "#6b6b5a", ambient]} />
      <directionalLight
        position={night ? [-30, 50, 20] : [40, 60, 30]}
        intensity={night ? 0.6 : dusk ? 1.6 : 2.6}
        color={night ? "#9fb4ff" : dusk ? "#ffb070" : "#fff6e6"}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-left={-40}
        shadow-camera-right={40}
        shadow-camera-top={40}
        shadow-camera-bottom={-40}
      />

      <directionalLight position={[6, 10, 30]} intensity={night ? 1.1 : 0.6} color={night ? "#cdd8ff" : "#ffffff"} />
      {indoor ? (
        <Room kind={shot.set as "bedroom"} night={night} blackout={shot.blackout} />
      ) : (
        <>
          {/* ground */}
          {shot.set === "street" ? (
            <>
              <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, -20]} receiveShadow>
                <planeGeometry args={[12, 160]} />
                <meshStandardMaterial map={roadTex()} />
              </mesh>
              <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                <planeGeometry args={[300, 300]} />
                <meshStandardMaterial map={tilesTex("#8d8f94", "#76787d", 60)} />
              </mesh>
            </>
          ) : shot.set === "park" || shot.set === "forest" ? (
            <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
              <planeGeometry args={[300, 300]} />
              <meshStandardMaterial color={shot.set === "forest" ? "#24452a" : "#4f9a46"} />
            </mesh>
          ) : shot.set === "rooftop" ? (
            <>
              <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                <planeGeometry args={[30, 30]} />
                <meshStandardMaterial map={tilesTex("#6d6f75", "#5c5e63", 8)} />
              </mesh>
              <mesh position={[0, 0.6, -15]}>
                <boxGeometry args={[30, 1.2, 0.6]} />
                <meshStandardMaterial color="#55575c" />
              </mesh>
            </>
          ) : (
            <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
              <planeGeometry args={[300, 300]} />
              <meshStandardMaterial map={tilesTex("#9a9ca1", "#7f8186", 80)} />
            </mesh>
          )}

          {/* surroundings */}
          {shot.set === "rooftop" ? (
            <Skyline night={night} blackout={shot.blackout} radius={40} count={30} y={-40} />
          ) : shot.set === "forest" ? (
            Array.from({ length: 40 }).map((_, i) => (
              <Tree key={i} x={(random(`fx${i}`) - 0.5) * 80} z={-8 - random(`fz${i}`) * 60} s={1.2 + random(`fs${i}`)} />
            ))
          ) : (
            <Skyline night={night} blackout={shot.blackout} />
          )}

          {shot.set === "street" && (
            <>
              {[-1, 1].map((s) =>
                Array.from({ length: 6 }).map((_, i) => (
                  <Building key={`${s}${i}`} x={s * 16} z={-6 - i * 16} w={12} d={14} h={20 + random(`bh${s}${i}`) * 25} v={i % 4} night={night} blackout={shot.blackout} />
                )),
              )}
              {[-1, 1].map((s) => [0, -18, -36].map((z) => <StreetLamp key={`${s}${z}`} x={s * 7} z={z} on={night && !shot.blackout} />))}
            </>
          )}

          {shot.set === "park" &&
            Array.from({ length: 10 }).map((_, i) => <Tree key={i} x={(i % 2 ? 1 : -1) * (8 + random(`px${i}`) * 14)} z={-4 - i * 5} />)}

          {shot.set === "square" && (
            <>
              {/* fence ring around the monster */}
              {Array.from({ length: 28 }).map((_, i) => {
                const a = (i / 28) * Math.PI * 2;
                return (
                  <mesh key={i} position={[MONSTER_CENTER[0] + Math.cos(a) * 9, 0.8, MONSTER_CENTER[1] + Math.sin(a) * 9]} rotation={[0, -a, 0]}>
                    <boxGeometry args={[0.2, 1.6, 2.1]} />
                    <meshStandardMaterial color="#c9ccd1" metalness={0.5} roughness={0.4} />
                  </mesh>
                );
              })}
              {Array.from({ length: towers }).map((_, i) => {
                const a = (i / towers) * Math.PI * 2 + Math.PI / 2 + Math.PI / 6; // keep the camera side (+z) clear
                return (
                  <FloodTower
                    key={i}
                    x={MONSTER_CENTER[0] + Math.cos(a) * 18}
                    z={MONSTER_CENTER[1] + Math.sin(a) * 18}
                    target={[MONSTER_CENTER[0], 12, MONSTER_CENTER[1]]}
                    on={i < on}
                    frame={frame}
                  />
                );
              })}
            </>
          )}
        </>
      )}

      {Array.from({ length: shot.police ?? 0 }).map((_, i) => {
        const a = -0.9 + i * (1.8 / Math.max(1, (shot.police ?? 1) - 1));
        return <PoliceCar key={i} x={MONSTER_CENTER[0] + Math.sin(a) * 13} z={MONSTER_CENTER[1] + Math.cos(a) * 13} turn={a + Math.PI} frame={frame} />;
      })}

      {(shot.weather === "rain" || shot.weather === "storm") && !indoor && <Rain frame={frame} heavy={shot.weather === "storm"} />}
    </>
  );
};
