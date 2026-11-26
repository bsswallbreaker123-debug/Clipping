"""Story Studio: turn a story script (stories/*.json) into animated TikTok parts.

    uv run pipeline/studio.py build stories/rejection-glowup.json            # all parts
    uv run pipeline/studio.py build stories/rejection-glowup.json --parts 1,2
    uv run pipeline/studio.py new "What if ..." --parts 10                   # needs ANTHROPIC_API_KEY
    uv run pipeline/studio.py remix stories/rejection-glowup.json --music phonk  # swap music, no re-render
    uv run pipeline/studio.py check stories/*.json                            # validate only

Steps per part: narration (Kokoro TTS, local) -> timing -> props JSON -> Remotion render.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import math
import os
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PUBLIC = ROOT / "public"
GEN = PUBLIC / "gen"
BUILD = ROOT / "build"
OUT = ROOT / "out"
MODELS = Path(os.environ.get("KOKORO_DIR", ROOT / "models"))
FPS = 30
VO_OFFSET = 3
END_CARD = 45
SPEED = float(os.environ.get("VOICE_SPEED", "1.12"))
# TikTok Creator Rewards only pays for videos longer than 1 minute; keep a safety margin.
MIN_SECONDS = float(os.environ.get("MIN_SECONDS", "62"))

BRICK_SETS = {"square", "street", "city", "bedroom", "livingroom", "school", "forest", "rooftop", "bunker", "park"}
BACKGROUNDS = {"bedroom", "classroom", "cafeteria", "hallway", "street", "park", "office", "gym", "party", "livingroom", "store", "rooftop", "void", "stage", "school", "hospital"}
EXPRS = {"neutral", "happy", "grin", "smug", "sad", "crying", "shocked", "angry", "nervous", "confused", "love", "sleepy", "determined", "cringe"}
ACTIONS = {"idle", "talk", "walk", "run", "jump", "shake", "wave", "point", "celebrate", "facepalm", "shrug", "phone", "sit", "fall", "enter-left", "enter-right", "exit-left", "exit-right"}


# ---------------- validation ----------------


def validate(story: dict) -> list[str]:
    if story.get("style") == "brick":
        return validate_brick(story)
    errs: list[str] = []
    cast = story.get("cast", {})
    for k in ("id", "title", "parts", "cast"):
        if k not in story:
            errs.append(f"missing '{k}'")
    for p in story.get("parts", []):
        for i, s in enumerate(p.get("shots", [])):
            where = f"part {p.get('part')} shot {i + 1}"
            if s.get("bg") not in BACKGROUNDS:
                errs.append(f"{where}: unknown bg {s.get('bg')!r}")
            if not s.get("vo") and not s.get("hold") and not s.get("phone"):
                errs.append(f"{where}: needs 'vo' or 'hold'")
            who = s.get("who", "narrator")
            if who != "narrator" and who not in cast:
                errs.append(f"{where}: speaker {who!r} not in cast")
            for c in s.get("chars", []):
                if c.get("id") not in cast and c.get("id") != "extra":
                    errs.append(f"{where}: char {c.get('id')!r} not in cast")
                if c.get("expr", "neutral") not in EXPRS:
                    errs.append(f"{where}: unknown expr {c.get('expr')!r}")
                if c.get("action", "idle") not in ACTIONS:
                    errs.append(f"{where}: unknown action {c.get('action')!r}")
            cam = s.get("camera")
            if isinstance(cam, dict) and cam.get("focus") not in [c.get("id") for c in s.get("chars", [])]:
                errs.append(f"{where}: camera focus {cam.get('focus')!r} is not on screen")
    return errs


def validate_brick(story: dict) -> list[str]:
    errs: list[str] = []
    cast = story.get("cast", {})
    for p in story.get("parts", []):
        for i, s in enumerate(p.get("shots", [])):
            where = f"part {p.get('part')} shot {i + 1}"
            if s.get("set") not in BRICK_SETS:
                errs.append(f"{where}: unknown set {s.get('set')!r}")
            if not s.get("vo") and not s.get("hold"):
                errs.append(f"{where}: needs 'vo' or 'hold'")
            who = s.get("who", "narrator")
            if who != "narrator" and who not in cast:
                errs.append(f"{where}: speaker {who!r} not in cast")
            ids = [c.get("id") for c in s.get("chars", [])]
            cam = s.get("camera")
            if isinstance(cam, dict):
                for k in ("close", "low", "over", "at"):
                    if k in cam and cam[k] != "monster" and cam[k] not in ids:
                        errs.append(f"{where}: camera {k} {cam[k]!r} is not on screen")
                    if k in cam and cam[k] == "monster" and not s.get("monster"):
                        errs.append(f"{where}: camera on monster but no monster in shot")
    return errs


# ---------------- word timing (Whisper) ----------------

_whisper = None


def whisper_words(wav: Path, text: str, frames: int) -> list[dict]:
    """Exact word timings for captions; falls back to an estimate if Whisper is unavailable."""
    cache = wav.with_suffix(".words.json")
    if cache.exists():
        return json.loads(cache.read_text())
    global _whisper
    try:
        import soundfile as sf
        from faster_whisper import WhisperModel

        if _whisper is None:
            _whisper = WhisperModel(os.environ.get("WHISPER_MODEL", "base.en"), device="cpu", compute_type="int8")
        audio, sr = sf.read(wav, dtype="float32")
        if sr != 16000:
            import numpy as np

            audio = np.interp(np.arange(0, len(audio), sr / 16000), np.arange(len(audio)), audio).astype("float32")
        segs, _ = _whisper.transcribe(audio, word_timestamps=True, initial_prompt=text)
        words = [
            {"text": w.word.strip(), "start": round(w.start * FPS), "end": round(w.end * FPS)}
            for seg in segs
            for w in (seg.words or [])
            if w.word.strip()
        ]
        if not words:
            raise ValueError("no words")
    except Exception as e:  # noqa: BLE001
        print(f"  (word timing estimated: {e})")
        words = word_timing(text, frames)
    cache.write_text(json.dumps(words))
    return words


# ---------------- TTS ----------------

_kokoro = None


def kokoro():
    global _kokoro
    if _kokoro is None:
        from kokoro_onnx import Kokoro

        onnx = MODELS / "kokoro-v1.0.onnx"
        voices = MODELS / "voices-v1.0.bin"
        if not onnx.exists():
            sys.exit(f"Kokoro model missing: run `bash scripts/setup.sh` (expects {onnx})")
        _kokoro = Kokoro(str(onnx), str(voices))
    return _kokoro


def speakable(text: str) -> str:
    t = text.replace("%", " percent").replace("&", " and ").replace("→", " to ")
    t = re.sub(r"\$(\d[\d,]*)", lambda m: m.group(1) + " dollars", t)
    return t


def tts(text: str, voice: str) -> tuple[str, float]:
    import soundfile as sf

    key = hashlib.sha1(f"{voice}|{SPEED}|{text}".encode()).hexdigest()[:16]
    rel = f"gen/tts/{key}.wav"
    path = PUBLIC / rel
    if not path.exists():
        path.parent.mkdir(parents=True, exist_ok=True)
        audio, sr = kokoro().create(speakable(text), voice=voice, speed=SPEED, lang="en-us")
        sf.write(path, audio, sr)
    info = sf.info(path)
    return rel, info.frames / info.samplerate


def word_timing(text: str, frames: int) -> list[dict]:
    words = text.split()
    if not words:
        return []
    weights = [len(re.sub(r"\W", "", w)) + 2 + (4 if re.search(r"[.,!?;:]$", w) else 0) for w in words]
    total = sum(weights)
    out, acc = [], 0.0
    for w, wt in zip(words, weights):
        start = acc / total * frames
        acc += wt
        out.append({"text": w, "start": round(start), "end": round(acc / total * frames)})
    return out


# ---------------- audio assets ----------------


def music_file(mood: str) -> str:
    import soundfile as sf

    sys.path.insert(0, str(Path(__file__).parent))
    import audio_synth

    rel = f"gen/music/{mood}.wav"
    path = PUBLIC / rel
    if not path.exists():
        path.parent.mkdir(parents=True, exist_ok=True)
        print(f"  composing {mood} music ...")
        sf.write(path, audio_synth.music(mood, 150, seed=len(mood)), audio_synth.SR)
    return rel


def sfx_file(name: str) -> str:
    import soundfile as sf

    sys.path.insert(0, str(Path(__file__).parent))
    import audio_synth

    rel = f"gen/sfx/{name}.wav"
    path = PUBLIC / rel
    if not path.exists():
        path.parent.mkdir(parents=True, exist_ok=True)
        sf.write(path, audio_synth.sfx(name), audio_synth.SR)
    return rel


def pick_sfx(shot: dict) -> str | None:
    if shot.get("sfx"):
        return shot["sfx"] if shot["sfx"] != "none" else None
    stat = shot.get("stat") or {}
    if (shot.get("monster") or {}).get("anim") == "scream":
        return "scream"
    if shot.get("lightning"):
        return "thunder"
    if shot.get("popup"):
        return "glitch"
    if stat.get("delta", 0) > 0:
        return "levelup" if any(c.get("glow") for c in shot.get("chars", [])) else "ding"
    if stat.get("delta", 0) < 0:
        return "down"
    if shot.get("banner", {}).get("style") == "stamp":
        return "impact"
    if shot.get("phone"):
        return "cash" if shot["phone"].get("app") == "bank" else "notify"
    if shot.get("transition") == "whip":
        return "whoosh"
    if shot.get("transition") == "flash" or shot.get("camera") in ("punch", "shake"):
        return "hit"
    return None


# ---------------- build ----------------


def build_part(story: dict, part: dict, stat_value: float | None, pad: int = 0) -> tuple[dict, float | None]:
    start_value = stat_value
    narrator = story.get("narrator", "am_michael")
    cast = story["cast"]
    shots = []
    frame = 0
    timeline = []
    if stat_value is not None:
        timeline.append({"frame": 0, "value": round(stat_value, 4)})
    for s in part["shots"]:
        shot = {k: v for k, v in s.items()}
        who = s.get("who", "narrator")
        voice = narrator if who == "narrator" else cast[who].get("voice", narrator)
        vo_frames = 0
        if s.get("vo"):
            rel, secs = tts(s["vo"], voice)
            vo_frames = math.ceil(secs * FPS)
            shot["audio"] = rel
            shot["voFrames"] = vo_frames
            if story.get("style") == "brick":
                shot["words"] = whisper_words(PUBLIC / rel, s["vo"], vo_frames)
            elif story.get("captions"):
                shot["words"] = word_timing(s["vo"], vo_frames)
        dur = VO_OFFSET + vo_frames + 6 + pad
        if s.get("hold"):
            dur = max(dur, round(s["hold"] * FPS))
        if s.get("phone"):
            dur = max(dur, 40 + 22 * len(s["phone"].get("messages", [])))
        dur = max(dur, 30)
        shot["from"] = frame
        shot["dur"] = dur
        st = s.get("stat")
        if st and stat_value is not None:
            stat_value = st["set"] if "set" in st else stat_value + st.get("delta", 0)
            timeline.append({"frame": frame + 2, "value": round(stat_value, 4)})
        name = pick_sfx(s)
        if name:
            shot["sfxFile"] = sfx_file(name)
        shots.append(shot)
        frame += dur
    # room for the end card
    shots[-1]["dur"] += END_CARD
    frame += END_CARD
    min_frames = round(story.get("minSeconds", MIN_SECONDS) * FPS)
    if frame < min_frames and pad == 0:
        # too short to be monetised: spread a little extra air over every line and rebuild
        extra = math.ceil((min_frames - frame) / len(part["shots"]))
        print(f"  part {part['part']} is {frame / FPS:.1f}s, adding {extra / FPS:.2f}s per shot to reach {min_frames / FPS:.0f}s")
        return build_part(story, part, start_value, pad=extra)
    meta = {k: v for k, v in story.items() if k != "parts"}
    props = {
        "story": meta,
        "part": part["part"],
        "totalParts": len(story["parts"]),
        "shots": shots,
        "music": None,  # mixed in afterwards by mix(), so it can be swapped without re-rendering
        "durationInFrames": frame,
        "statTimeline": timeline,
    }
    return props, stat_value


def render(props_path: Path, stem_path: Path, preview: bool = False, composition: str = "Episode") -> None:
    """Render picture + voices + sound effects (no music) to a stem file."""
    stem_path.parent.mkdir(parents=True, exist_ok=True)
    cmd = ["npx", "remotion", "render", "src/index.ts", composition, str(stem_path), f"--props={props_path}", "--log=error"]
    if preview:
        cmd += ["--scale=0.5"]
    subprocess.run(cmd, cwd=ROOT, check=True)


def resolve_music(choice: str | None) -> Path | None:
    """A mood name (trend, phonk, curious, ...), a file path, or none."""
    if not choice or choice == "none":
        return None
    p = Path(choice)
    if p.suffix and p.exists():
        return p.resolve()
    if p.suffix and (PUBLIC / "music" / p.name).exists():
        return PUBLIC / "music" / p.name
    return PUBLIC / music_file(choice)


def mix(stem: Path, music: Path | None, out: Path, volume: float) -> None:
    """Lay music under the stem, duck it whenever someone speaks, normalise to -14 LUFS."""
    out.parent.mkdir(parents=True, exist_ok=True)
    dur = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(stem)],
                               capture_output=True, text=True, check=True).stdout.strip())
    norm = "loudnorm=I=-14:TP=-1.5:LRA=11"
    if music is None:
        cmd = ["ffmpeg", "-v", "error", "-y", "-i", str(stem), "-c:v", "copy", "-af", norm]
    else:
        fc = (
            f"[1:a]aformat=sample_rates=48000:channel_layouts=stereo,volume={volume},afade=t=in:d=0.6[m];"
            "[0:a]aformat=sample_rates=48000:channel_layouts=stereo,asplit=2[v][sc];"
            "[m][sc]sidechaincompress=threshold=0.015:ratio=5:attack=20:release=450[md];"
            f"[v][md]amix=inputs=2:normalize=0:duration=first,afade=t=out:st={max(0, dur - 1.2):.2f}:d=1.2,{norm}[a]"
        )
        cmd = ["ffmpeg", "-v", "error", "-y", "-i", str(stem), "-stream_loop", "-1", "-i", str(music),
               "-filter_complex", fc, "-map", "0:v", "-map", "[a]", "-c:v", "copy", "-t", f"{dur:.3f}"]
    cmd += ["-c:a", "aac", "-b:a", "192k", "-ar", "48000", "-movflags", "+faststart", str(out)]
    subprocess.run(cmd, check=True)


def cmd_build(args) -> None:
    story = json.loads(Path(args.story).read_text())
    errs = validate(story)
    if errs:
        sys.exit("Story has problems:\n  " + "\n  ".join(errs))
    wanted = {int(x) for x in args.parts.split(",")} if args.parts else None
    stat = story.get("stat", {}).get("start") if story.get("stat") else None
    for part in story["parts"]:
        props, stat = build_part(story, part, stat)
        n = part["part"]
        if wanted and n not in wanted:
            continue
        pdir = BUILD / story["id"]
        pdir.mkdir(parents=True, exist_ok=True)
        props_path = pdir / f"part-{n:02d}.props.json"
        props_path.write_text(json.dumps(props, ensure_ascii=False))
        secs = props["durationInFrames"] / FPS
        print(f"[{story['id']}] part {n}/{len(story['parts'])}: {len(props['shots'])} shots, {secs:.1f}s")
        if args.no_render:
            continue
        stem = pdir / f"part-{n:02d}.stem.mp4"
        render(props_path, stem, preview=args.preview, composition="BrickEpisode" if story.get("style") == "brick" else "Episode")
        out = OUT / story["id"] / f"{story['id']}-part-{n:02d}.mp4"
        mix(stem, resolve_music(args.music or story.get("music") or story.get("mood", "trend")), out, story.get("musicVolume", 0.19))
        print(f"  -> {out.relative_to(ROOT)}")


def cmd_remix(args) -> None:
    story = json.loads(Path(args.story).read_text())
    music = resolve_music(args.music or story.get("music") or story.get("mood", "trend"))
    vol = args.volume if args.volume is not None else story.get("musicVolume", 0.19)
    stems = sorted((BUILD / story["id"]).glob("part-*.stem.mp4"))
    if not stems:
        sys.exit("No stems yet - run `build` first.")
    for stem in stems:
        n = int(stem.name.split("-")[1].split(".")[0])
        out = OUT / story["id"] / f"{story['id']}-part-{n:02d}.mp4"
        mix(stem, music, out, vol)
        print(f"  -> {out.relative_to(ROOT)} ({music.name if music else 'no music'})")


def cmd_check(args) -> None:
    bad = False
    for f in args.stories:
        story = json.loads(Path(f).read_text())
        errs = validate(story)
        words = sum(len(s.get("vo", "").split()) for p in story["parts"] for s in p["shots"])
        print(f"{f}: {len(story['parts'])} parts, ~{words / 2.7 / 60:.1f} min narration, {'OK' if not errs else 'ERRORS'}")
        for e in errs:
            print("   ", e)
        bad |= bool(errs)
    sys.exit(1 if bad else 0)


def cmd_new(args) -> None:
    sys.path.insert(0, str(Path(__file__).parent))
    from writer import write_story

    story = write_story(args.premise, args.parts, model=args.model)
    path = ROOT / "stories" / f"{story['id']}.json"
    path.write_text(json.dumps(story, indent=2, ensure_ascii=False))
    errs = validate(story)
    print(f"wrote {path.relative_to(ROOT)} ({len(story['parts'])} parts)")
    for e in errs:
        print("  warning:", e)


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = ap.add_subparsers(required=True)
    b = sub.add_parser("build", help="render a story")
    b.add_argument("story")
    b.add_argument("--parts", help="comma separated part numbers")
    b.add_argument("--no-render", action="store_true", help="only write props JSON (for remotion studio)")
    b.add_argument("--preview", action="store_true", help="half resolution, faster")
    b.add_argument("--music", help="mood (trend, phonk, curious, emotional, tense, triumphant, mystery), a file, or none")
    b.set_defaults(fn=cmd_build)
    r = sub.add_parser("remix", help="swap the music on rendered parts in seconds (no re-render)")
    r.add_argument("story")
    r.add_argument("--music", help="mood, audio file, or none (for adding a trending sound in the TikTok app)")
    r.add_argument("--volume", type=float, help="music level, default 0.19")
    r.set_defaults(fn=cmd_remix)
    c = sub.add_parser("check", help="validate story files")
    c.add_argument("stories", nargs="+")
    c.set_defaults(fn=cmd_check)
    n = sub.add_parser("new", help="write a new story with Claude")
    n.add_argument("premise")
    n.add_argument("--parts", type=int, default=5)
    n.add_argument("--model", default=os.environ.get("STORY_MODEL", "claude-opus-5-5"))
    n.set_defaults(fn=cmd_new)
    args = ap.parse_args()
    args.fn(args)


if __name__ == "__main__":
    main()
