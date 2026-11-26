import { Easing, interpolate } from "remotion";

export const W = 1080;
export const H = 1920;
export const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

function parse(hex: string): [number, number, number] {
  let h = hex.replace("#", "");
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  const n = parseInt(h.slice(0, 6), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

const toHex = (r: number, g: number, b: number) =>
  "#" + [r, g, b].map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0")).join("");

/** amt < 0 darkens, > 0 lightens (-1..1). */
export function shade(hex: string, amt: number): string {
  const [r, g, b] = parse(hex);
  if (amt < 0) return toHex(r * (1 + amt), g * (1 + amt), b * (1 + amt));
  return toHex(r + (255 - r) * amt, g + (255 - g) * amt, b + (255 - b) * amt);
}

export function mix(a: string, b: string, k: number): string {
  const [r1, g1, b1] = parse(a);
  const [r2, g2, b2] = parse(b);
  return toHex(r1 + (r2 - r1) * k, g1 + (g2 - g1) * k, b1 + (b2 - b1) * k);
}

export function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return ((h >>> 0) % 100000) / 100000;
}

/** deterministic pseudo random in 0..1 */
export function rnd(seed: number): number {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}

export const ease = Easing.inOut(Easing.sin);
export const easeOut = Easing.out(Easing.cubic);
export const back = Easing.out(Easing.back(1.6));

export function lerp(f: number, a: number, b: number, from: number, to: number, e = ease) {
  return interpolate(f, [a, b], [from, to], { ...clamp, easing: e });
}

/** Smooth value noise for organic motion (sum of sines). */
export function wob(t: number, seed: number, speed = 1): number {
  return (
    Math.sin(t * 1.3 * speed + seed * 7.1) * 0.5 +
    Math.sin(t * 2.7 * speed + seed * 3.3) * 0.3 +
    Math.sin(t * 5.9 * speed + seed * 1.7) * 0.2
  );
}
