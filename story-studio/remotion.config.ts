import { Config } from "@remotion/cli/config";
import { existsSync } from "node:fs";

// Use the system Chromium when present (cloud sandbox), else Remotion downloads its own.
const systemChromium = process.env.REMOTION_CHROMIUM ?? "/opt/pw-browsers/chromium_headless_shell";
if (existsSync(systemChromium)) Config.setBrowserExecutable(systemChromium);
Config.setVideoImageFormat("jpeg");
Config.setJpegQuality(92);
Config.setConcurrency(Number(process.env.RENDER_CONCURRENCY ?? 4));
