import React from "react";
import { Composition } from "remotion";
import { Episode } from "./Episode";
import type { EpisodeProps } from "./types";

// Props come from build/<story>/part-XX.props.json (written by `studio.py build`).
const demo: EpisodeProps = {
  story: {
    id: "demo",
    title: "What If Every Lie You Told Became True?",
    stat: { name: "Max", start: 4.2 },
    cast: { max: { name: "Max", hair: "spiky", shirt: "#f2c230", shirtStyle: "hoodie" } },
  },
  part: 1,
  totalParts: 5,
  durationInFrames: 150,
  statTimeline: [{ frame: 0, value: 4.2 }],
  shots: [
    { from: 0, dur: 150, bg: "classroom", label: "MONDAY", crowd: 5, camera: "slowzoom", chars: [{ id: "max", x: 0.5, expr: "nervous", fx: ["sweat"] }] },
  ],
};

export const Root: React.FC = () => (
  <Composition
    id="Episode"
    component={Episode}
    width={1080}
    height={1920}
    fps={30}
    durationInFrames={demo.durationInFrames}
    defaultProps={demo}
    calculateMetadata={({ props }) => ({ durationInFrames: props.durationInFrames })}
  />
);
