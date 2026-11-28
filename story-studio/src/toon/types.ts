// "Toon" style: full-frame flat 2D story videos (myths, film/game-inspired series).
// Scripts are written in the .story text format and converted to these props by pipeline/toon.py.

export type Expr =
  | "neutral" | "smile" | "grin" | "sad" | "crying" | "scared" | "terrified" | "shocked" | "angry"
  | "determined" | "suspicious" | "creepy" | "blank" | "sleep" | "pain" | "relief" | "smug" | "worried";

export type Pose =
  | "idle" | "talk" | "walk" | "run" | "point" | "hush" | "cover" | "phone" | "crouch" | "reach" | "torch"
  | "lookup" | "wave" | "hug" | "hold" | "knock" | "back" | "sit" | "lie" | "carry" | "arms" | "fists" | "hide"
  | "shrug" | "hands-up" | "write" | "think";

export type Hair =
  | "short" | "bob" | "long" | "bun" | "curly" | "bald" | "ponytail" | "spiky" | "hood" | "cap" | "beanie"
  | "messy" | "side" | "buzz" | "braids" | "afro" | "pigtails";

export interface Cast {
  name: string;
  voice?: string;
  age?: "kid" | "teen" | "adult" | "old";
  skin?: string;
  hair?: Hair;
  hairColor?: string;
  top: string;
  top2?: string;
  topStyle?: "shirt" | "hoodie" | "jacket" | "sweater" | "dress" | "suit" | "jumpsuit" | "coat" | "uniform";
  pants?: string;
  shoes?: string;
  glasses?: boolean;
  beard?: "stubble" | "full" | "moustache";
  wrinkles?: boolean;
  mask?: "fox" | "doll" | "visor" | "sack" | "gas" | "skull" | "gold";
  variant?: "infected" | "ghost" | "pale" | "wrong";
  badge?: string; // number / name tag on the chest ("218")
  height?: number;
  build?: number; // width multiplier (1 = normal)
}

export interface Char {
  id: string;
  x: number; // 0..1 across the frame
  y?: number; // px offset from the floor line (+ = lower / closer)
  size?: number;
  expr?: Expr;
  pose?: Pose;
  flip?: boolean; // turned towards the left
  to?: number; // walk / run target x
  look?: "left" | "right" | "up" | "down" | "cam";
  fade?: "in" | "out";
  dim?: boolean; // silhouette (backlit)
  item?: string; // candle | phone | torch | lantern | letter | map | box | bag | cash | key | teddy | cup | bells
}

export interface Creature {
  type: "horned" | "wendigo" | "ghost" | "shade" | "owl" | "hollow";
  x: number;
  y?: number;
  size?: number;
  pose?: "idle" | "step" | "reach" | "scream" | "lurk" | "peek" | "frozen" | "turn" | "crawl";
  flip?: boolean;
  to?: number;
  dim?: boolean;
}

export type Cam = "still" | "push" | "pull" | "punch" | "shake" | "up" | "down" | "left" | "right" | "drift" | "creep" | "zoom";

export interface Prop {
  type: string;
  a?: string;
  b?: string;
  c?: string;
}

export interface Shot {
  scene: string;
  vo?: string;
  who?: string;
  hold?: number;
  chars?: Char[];
  close?: string[];
  creature?: Creature;
  prop?: Prop;
  cam?: Cam;
  t?: "cut" | "flash" | "black" | "whip" | "glitch";
  fx?: string[];
  tag?: string;
  card?: { title: string; sub?: string; level?: number; label?: string };
  rule?: string;
  cross?: boolean;
  check?: boolean;
  sfx?: string;
  win?: string; // what is in the window: silhouette | eyes | face | light | horned | none
}

export interface Word {
  text: string;
  start: number;
  end: number;
  hl?: 1 | 2; // 1 = accent colour, 2 = red
}

export interface TimedShot extends Shot {
  from: number;
  dur: number;
  audio?: string;
  voFrames?: number;
  mouth?: string; // one digit per frame, 0..9: lip-sync from the voice's loudness
  sfxFile?: string;
  amb?: string; // ambience loop
  words?: Word[];
}

export interface SceneDef {
  kind: string; // room | outside | preset name
  [key: string]: unknown;
}

export interface ToonProps {
  story: {
    id: string;
    title: string;
    cast: Record<string, Cast>;
    scenes: Record<string, SceneDef>;
    accent?: string;
    handle?: string;
  };
  part: number;
  totalParts: number;
  shots: TimedShot[];
  durationInFrames: number;
  [key: string]: unknown;
}
