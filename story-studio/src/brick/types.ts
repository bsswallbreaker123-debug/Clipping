// Script format for the 3D "brick" style (blocky characters, night city, monster stories).

export type BFace = "neutral" | "happy" | "scared" | "angry" | "shocked" | "smug" | "sad" | "determined" | "screaming";
export type BAnim = "idle" | "talk" | "walk" | "run" | "point" | "wave" | "panic" | "fall" | "sit" | "aim" | "radio" | "crouch" | "lookup";
export type BHat = "none" | "hair" | "cap" | "police" | "beanie" | "longhair" | "helmet";
export type BSet = "square" | "street" | "city" | "bedroom" | "livingroom" | "school" | "forest" | "rooftop" | "bunker" | "park";
export type BMonster = "stalker" | "brute" | "crawler";

export interface BCast {
  name: string;
  voice?: string;
  skin?: string;
  shirt: string;
  pants?: string;
  hat?: BHat;
  hatColor?: string;
  badge?: boolean; // police badge + radio on the chest
  stripes?: boolean; // reflective stripes (security / firefighter)
  scale?: number;
}

export interface BChar {
  id: string;
  x: number; // world units, roughly -10..10
  z?: number; // depth, default 0 (negative = further away)
  face?: BFace;
  anim?: BAnim;
  turn?: number; // degrees, 0 = facing camera, 90 = facing right
  to?: [number, number]; // walk/run target (x, z)
  hold?: "flashlight" | "radio" | "phone" | "none";
}

export interface BMonsterSpec {
  type: BMonster;
  x: number;
  z: number;
  scale?: number;
  anim?: "idle" | "frozen" | "step" | "reach" | "scream";
  turn?: number;
  eyes?: string; // glow colour
  holding?: boolean; // something (someone) in its hand
}

export type BCamera =
  | "wide"
  | "establish" // high, far, slow push
  | "top"
  | "orbit"
  | "shake"
  | { close: string; side?: number } // close-up on a character id (or "monster")
  | { low: string } // low angle looking up at a character or the monster
  | { over: string; at: string }; // over-the-shoulder of `over`, looking at `at`

export interface BShot {
  set: BSet;
  time?: "night" | "day" | "dusk";
  weather?: "clear" | "rain" | "storm" | "fog";
  vo?: string;
  who?: string;
  hold?: number;
  chars?: BChar[];
  crowd?: number;
  monster?: BMonsterSpec;
  camera?: BCamera;
  floodlights?: number; // towers around the square that are on (0..6)
  police?: number; // police cars with flashing lights
  blackout?: boolean; // city lights off
  lightning?: boolean;
  label?: string; // "2:13 AM", "THREE YEARS AGO", ...
  transition?: "cut" | "fade" | "flash" | "whip";
  sfx?: string;
  stat?: { set?: number; delta?: number };
  // compatibility with the 2D pipeline
  bg?: string;
}

export interface BTimedShot extends BShot {
  from: number;
  dur: number;
  audio?: string;
  voFrames?: number;
  sfxFile?: string;
  words?: { text: string; start: number; end: number }[];
}

export interface BrickProps {
  story: {
    id: string;
    title: string;
    cast: Record<string, BCast>;
    stat?: { name: string; start: number; decimals?: number; suffix?: string };
  };
  part: number;
  totalParts: number;
  shots: BTimedShot[];
  durationInFrames: number;
  statTimeline: { frame: number; value: number }[];
  [key: string]: unknown;
}
