// Story script format. Written by hand or by `studio new`, enriched with timing by the pipeline.

export type Expression =
  | "neutral"
  | "happy"
  | "grin"
  | "smug"
  | "sad"
  | "crying"
  | "shocked"
  | "angry"
  | "nervous"
  | "confused"
  | "love"
  | "sleepy"
  | "determined"
  | "cringe";

export type Action =
  | "idle"
  | "talk"
  | "walk"
  | "run"
  | "jump"
  | "shake"
  | "wave"
  | "point"
  | "celebrate"
  | "facepalm"
  | "shrug"
  | "phone"
  | "sit"
  | "fall"
  | "enter-left"
  | "enter-right"
  | "exit-left"
  | "exit-right";

export type Hair =
  | "none"
  | "spiky"
  | "beanie"
  | "cap"
  | "curly"
  | "afro"
  | "long"
  | "bun"
  | "ponytail"
  | "bob"
  | "mohawk"
  | "slick";

export type Accessory = "glasses" | "sunglasses" | "headphones" | "earrings" | "crown" | "bow" | "chain" | "tie";

export interface CastMember {
  name: string;
  voice?: string; // kokoro voice id for dialogue
  hair?: Hair;
  hairColor?: string;
  shirt?: string;
  shirtStyle?: "tee" | "hoodie" | "suit" | "dress" | "jacket";
  pants?: string;
  skin?: string; // head + limbs colour, default near-black like the reference style
  accessories?: Accessory[];
  height?: number; // 0.8..1.2
}

export type Background =
  | "bedroom"
  | "classroom"
  | "cafeteria"
  | "hallway"
  | "street"
  | "park"
  | "office"
  | "gym"
  | "party"
  | "livingroom"
  | "store"
  | "rooftop"
  | "void"
  | "stage"
  | "school"
  | "hospital";

export type TimeOfDay = "day" | "evening" | "night";

export interface ShotChar {
  id: string; // key in cast, or "extra" for a nameless silhouette
  x: number; // 0..1 across the scene
  expr?: Expression;
  action?: Action;
  facing?: "left" | "right" | "front";
  to?: number; // target x for walk/run
  scale?: number;
  glow?: boolean; // aura + sparkles (level up)
  fade?: number; // 0..1 how invisible the character is (flickers slightly)
  tag?: string; // floating label above the head (e.g. days left, strength)
  tagColor?: string;
  fx?: ("sweat" | "tears" | "blush" | "anger" | "sparkle" | "hearts" | "question" | "exclaim" | "zzz" | "stars")[];
  talking?: boolean; // override; defaults to true when this char voices the shot
}

export type Camera =
  | "wide"
  | "slowzoom"
  | "zoomout"
  | "panleft"
  | "panright"
  | "punch"
  | "shake"
  | { focus: string; zoom?: number }; // close-up on a cast id

export interface Popup {
  title: string;
  lines?: string[];
  color?: string; // accent, default cyan
  style?: "system" | "warning" | "success";
}

export interface PhoneMsg {
  from: "me" | "them";
  text: string;
}

export interface Phone {
  app: "chat" | "dating" | "social" | "notification" | "bank" | "search";
  title?: string; // contact / app header
  messages?: PhoneMsg[];
  big?: string; // big headline (bank balance, follower count, ...)
  sub?: string;
}

export interface Banner {
  text: string;
  style?: "ad" | "news" | "chapter" | "stamp";
}

export interface Shot {
  bg: Background;
  time?: TimeOfDay;
  label?: string; // location/time caption, top-left
  vo?: string; // spoken line
  who?: string; // "narrator" (default) or a cast id
  hold?: number; // seconds when there is no voice line
  chars?: ShotChar[];
  crowd?: number; // background silhouettes
  camera?: Camera;
  stat?: { set?: number; delta?: number; who?: string }; // HUD changes when this shot starts
  popup?: Popup;
  phone?: Phone;
  banner?: Banner;
  emoji?: string; // big reaction burst in the middle
  transition?: "cut" | "fade" | "whip" | "flash";
  sfx?: string; // force a sound effect
}

export interface Part {
  part: number;
  hook?: string; // optional subtitle under the title for this part
  shots: Shot[];
}

export interface Story {
  id: string;
  title: string; // the "What if ..." question shown in the top box
  mood?: "trend" | "phonk" | "dark" | "curious" | "emotional" | "tense" | "triumphant" | "mystery";
  narrator?: string; // kokoro voice id
  stat?: { name: string; start: number; decimals?: number; suffix?: string; who?: string };
  captions?: boolean;
  cast: Record<string, CastMember>;
  parts: Part[];
}

// ---- rendered form (after the pipeline added timing) ----

export interface TimedShot extends Shot {
  from: number; // frame
  dur: number; // frames
  audio?: string; // path under public/
  voFrames?: number; // length of the spoken line
  sfxFile?: string;
  words?: { text: string; start: number; end: number }[]; // frames relative to shot, for captions
}

export interface EpisodeProps {
  story: Omit<Story, "parts">;
  part: number;
  totalParts: number;
  shots: TimedShot[];
  music?: string;
  musicVolume?: number;
  durationInFrames: number;
  statTimeline: { frame: number; value: number }[];
  [key: string]: unknown;
}
