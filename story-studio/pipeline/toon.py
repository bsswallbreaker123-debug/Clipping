"""Toon style: full-frame 2D story parts from a .story script.

    uv run pipeline/toon.py build stories/birch-sticks.story --parts 1
    uv run pipeline/toon.py check stories/*.story
    uv run pipeline/toon.py still stories/birch-sticks.story --part 1 --shot 4

Script format (one shot per line):  scene | narration or `who> dialogue` | directives
  directives: @id:x[:expr[:pose]][+item][+flip][+size=1.2][+to=.8][+y=40][+look=up][+dim][+fade=in]
              !creature:x[:pose][+size=..][+flip][+to=..][+y=..][+dim]
              close=id,id  prop=type:a:b:c  cam=push  t=flash  fx=snow,dark  tag=TEXT  rule=TEXT
              card=Title:sub:level  cross  check  sfx=name  win=horned  hold=1.5
  narration markup: *word* accent colour, ^word^ red, [whispering] / [gasp] ... delivery tags (spoken, not shown)
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

import numpy as np
import soundfile as sf

sys.path.insert(0, str(Path(__file__).parent))
import studio  # noqa: E402
from studio import BUILD, FPS, OUT, PUBLIC, ROOT, mix  # noqa: E402

VO_OFFSET = 3
END_CARD = 45
TTS_DIR = ROOT / "tts"
TTS_PY = TTS_DIR / ".venv" / "bin" / "python"
MIN_SECONDS = float(os.environ.get("MIN_SECONDS", "62"))

EXPRS = {"neutral", "smile", "grin", "sad", "crying", "scared", "terrified", "shocked", "angry", "determined", "suspicious", "creepy", "blank", "sleep", "pain", "relief", "smug", "worried"}
POSES = {"idle", "talk", "walk", "run", "point", "hush", "cover", "phone", "crouch", "reach", "torch", "lookup", "wave", "hug", "hold", "knock", "back", "sit", "lie", "carry", "arms", "fists", "hide", "shrug", "hands-up", "write", "think"}
ITEMS = {"candle", "phone", "torch", "lantern", "letter", "map", "box", "bag", "cash", "key", "teddy", "cup", "bells"}
CREATURES = {"horned", "wendigo", "ghost", "shade", "owl", "hollow"}
CPOSES = {"idle", "step", "reach", "scream", "lurk", "peek", "frozen", "turn", "crawl"}


# ---------------------------------------------------------------- parsing


def num(v: str) -> float | str:
    try:
        return float(v)
    except ValueError:
        return v


def parse_cast(line: str) -> dict:
    parts = [p.strip() for p in line.split("|")]
    c: dict = {"name": parts[0]}
    for p in parts[1:]:
        for tok in p.split():
            if tok in ("kid", "teen", "adult", "old"):
                c["age"] = tok
            elif tok in ("glasses", "wrinkles"):
                c[tok] = True
            elif "=" in tok:
                k, v = tok.split("=", 1)
                if k == "hair":
                    style, _, col = v.partition(":")
                    c["hair"] = style
                    if col:
                        c["hairColor"] = col
                elif k == "top":
                    col, _, style = v.partition(":")
                    c["top"] = col
                    if style:
                        c["topStyle"] = style
                elif k in ("height", "build"):
                    c[k] = float(v)
                else:
                    c[{"top2": "top2"}.get(k, k)] = v
    c.setdefault("top", "#555b66")
    return c


def parse_scene(line: str) -> dict:
    segs = [s.strip() for s in line.split("|")]
    head = segs[0].split()
    d: dict = {"kind": head[0], "items": []}
    for tok in head[1:]:
        if "=" in tok:
            k, v = tok.split("=", 1)
            if k in ("wall", "floor"):
                col, _, typ = v.partition(":")
                d[k] = col
                if typ:
                    d[k + "Type"] = typ
            else:
                d[k] = num(v)
        else:
            d[tok] = True
    for seg in segs[1:]:
        toks = seg.split()
        it: dict = {"t": toks[0], "x": float(toks[1]) if len(toks) > 1 else 0.5}
        for tok in toks[2:]:
            if "=" in tok:
                k, v = tok.split("=", 1)
                it[k] = num(v) if k in ("s", "y") else v
            else:
                it[tok] = True
        d["items"].append(it)
    return d


def parse_char(tok: str) -> dict:
    main, *mods = tok[1:].split("+")
    bits = main.split(":")
    c: dict = {"id": bits[0], "x": float(bits[1]) if len(bits) > 1 and bits[1] else 0.5}
    if len(bits) > 2 and bits[2]:
        c["expr"] = bits[2]
    if len(bits) > 3 and bits[3]:
        c["pose"] = bits[3]
    for m in mods:
        if "=" in m:
            k, v = m.split("=", 1)
            c[k] = num(v) if k in ("size", "to", "y") else v
        elif m in ITEMS:
            c["item"] = m
        else:
            c[m] = True
    return c


def parse_creature(tok: str) -> dict:
    main, *mods = tok[1:].split("+")
    bits = main.split(":")
    c: dict = {"type": bits[0], "x": float(bits[1]) if len(bits) > 1 and bits[1] else 0.5}
    if len(bits) > 2 and bits[2]:
        c["pose"] = bits[2]
    for m in mods:
        if "=" in m:
            k, v = m.split("=", 1)
            c[k] = num(v)
        else:
            c[m] = True
    return c


def parse_shot(line: str) -> dict:
    segs = [s.strip() for s in line.split("|")]
    shot: dict = {"scene": segs[0]}
    vo = segs[1] if len(segs) > 1 else ""
    m = re.match(r"^(\w+)>\s*(.*)$", vo)
    if m:
        shot["who"] = m.group(1)
        vo = m.group(2)
    if vo:
        shot["vo"] = vo
    for tok in (segs[2] if len(segs) > 2 else "").split():
        if tok.startswith("@"):
            shot.setdefault("chars", []).append(parse_char(tok))
        elif tok.startswith("!"):
            shot["creature"] = parse_creature(tok)
        elif tok in ("cross", "check"):
            shot[tok] = True
        elif "=" in tok:
            k, v = tok.split("=", 1)
            if k == "close":
                shot["close"] = v.split(",")
            elif k == "fx":
                shot["fx"] = v.split(",")
            elif k == "prop":
                p = v.split(":")
                shot["prop"] = {"type": p[0], **{kk: vv for kk, vv in zip("abc", p[1:])}}
            elif k == "card":
                p = v.split(":")
                shot["card"] = {"title": p[0].replace("_", " "), "sub": p[1].replace("_", " ") if len(p) > 1 else None, "level": int(p[2]) if len(p) > 2 else 5}
            elif k in ("tag", "rule"):
                shot[k] = v.replace("_", " ")
            elif k == "hold":
                shot["hold"] = float(v)
            else:
                shot[k] = v
    return shot


def parse_story(path: Path) -> dict:
    story: dict = {"style": "toon", "cast": {}, "scenes": {}, "parts": []}
    section = None
    for raw in path.read_text().splitlines():
        line = raw.rstrip()
        if not line.strip() or line.strip().startswith("#"):
            continue
        if line.startswith("=="):
            section = "part"
            story["parts"].append({"part": int(line.strip("= ").split()[0]), "shots": []})
            continue
        if section == "part":
            story["parts"][-1]["shots"].append(parse_shot(line.strip()))
            continue
        if re.match(r"^(cast|scenes):\s*$", line):
            section = line.split(":")[0]
            continue
        if line.startswith((" ", "\t")) and section in ("cast", "scenes"):
            key, _, rest = line.strip().partition(":")
            if section == "cast":
                story["cast"][key.strip()] = parse_cast(rest.strip())
            else:
                story["scenes"][key.strip()] = parse_scene(rest.strip())
            continue
        key, _, val = line.partition(":")
        story[key.strip()] = val.strip()
        section = None
    return story


KIT_SRC = ROOT / "src" / "toon" / "Kit.tsx"


def known_items() -> set[str]:
    return set(re.findall(r'case "([a-z0-9-]+)":', KIT_SRC.read_text()))


def validate(story: dict) -> list[str]:
    errs = []
    items = known_items()
    for name, sc in story["scenes"].items():
        for it in sc.get("items", []):
            if it["t"] not in items:
                errs.append(f"scene {name}: item {it['t']!r} is not drawn by Kit.tsx")
    for p in story["parts"]:
        for i, s in enumerate(p["shots"]):
            w = f"part {p['part']} shot {i + 1}"
            if s["scene"] not in story["scenes"]:
                errs.append(f"{w}: unknown scene {s['scene']!r}")
            if not s.get("vo") and not s.get("hold"):
                errs.append(f"{w}: needs narration or hold=")
            if s.get("who") and s["who"] not in story["cast"]:
                errs.append(f"{w}: speaker {s['who']!r} not in cast")
            for c in s.get("chars", []):
                if c["id"] not in story["cast"]:
                    errs.append(f"{w}: {c['id']!r} not in cast")
                if c.get("expr", "neutral") not in EXPRS:
                    errs.append(f"{w}: unknown expression {c.get('expr')!r}")
                if c.get("pose", "idle") not in POSES:
                    errs.append(f"{w}: unknown pose {c.get('pose')!r}")
            if s.get("creature") and s["creature"]["type"] not in CREATURES:
                errs.append(f"{w}: unknown creature {s['creature']['type']!r}")
            for cid in s.get("close", []):
                if cid not in story["cast"] and cid not in ("creature", "monster"):
                    errs.append(f"{w}: close-up on unknown {cid!r}")
                if cid in ("creature", "monster") and not s.get("creature"):
                    errs.append(f"{w}: close-up on the creature but no !creature in the shot")
    return errs


# ---------------------------------------------------------------- narration text


TAG = re.compile(r"\[[a-z ]+\]")


def spoken(vo: str) -> str:
    """What the TTS reads: markup removed, delivery tags kept."""
    return re.sub(r"[*^]", "", vo).strip()


def shown(vo: str) -> tuple[str, list[int]]:
    """Caption words (no tags) and per-word highlight (0, 1 accent, 2 red)."""
    text = TAG.sub("", vo)
    words, hls = [], []
    mode = 0
    for tok in text.split():
        start_mode = mode
        if tok.startswith("*"):
            start_mode = mode = 1
        elif tok.startswith("^"):
            start_mode = mode = 2
        clean = tok.replace("*", "").replace("^", "")
        if clean:
            words.append(clean)
            hls.append(start_mode or mode)
        if tok.rstrip(".,!?;:…'\"").endswith(("*", "^")):
            mode = 0
    return " ".join(words), hls


# ---------------------------------------------------------------- TTS (Chatterbox Turbo, local)


def voice_ref(voice: str) -> Path:
    """Reference clip for voice cloning, made locally from a Kokoro voice (no real person's voice)."""
    ref = TTS_DIR / "ref" / f"{voice}.wav"
    if ref.exists():
        return ref
    ref.parent.mkdir(parents=True, exist_ok=True)
    name, _, shift = voice.partition("+")
    k = studio.kokoro()
    text = "I remember that night better than any other. The snow was falling, the house was quiet, and nobody knew what was coming up the mountain."
    audio, sr = k.create(text, voice=name, speed=1.0, lang="en-us" if not name.startswith("b") else "en-gb")
    tmp = ref.with_suffix(".raw.wav")
    sf.write(tmp, audio, sr)
    if shift:
        semis = float(shift)
        rate = 2 ** (semis / 12)
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(tmp), "-af", f"asetrate={sr * rate:.0f},aresample={sr},atempo={1 / rate:.4f}", str(ref)], check=True)
        tmp.unlink()
    else:
        tmp.rename(ref)
    return ref


def vox_path(voice: str, text: str, tempo: float) -> Path:
    key = hashlib.sha1(f"cbt|{voice}|{tempo}|{text}".encode()).hexdigest()[:16]
    return PUBLIC / "gen" / "vox" / f"{key}.wav"


def synth_lines(lines: list[tuple[str, str]], tempo: float) -> None:
    todo = []
    for voice, text in lines:
        out = vox_path(voice, text, tempo)
        if not out.exists():
            todo.append({"ref": str(voice_ref(voice)), "out": str(out.with_suffix(".raw.wav")), "text": text, "final": str(out)})
    if not todo:
        return
    # unique jobs, grouped by voice so conditioning is computed once per voice
    seen, jobs = set(), []
    for j in sorted(todo, key=lambda j: j["ref"]):
        if j["out"] not in seen:
            seen.add(j["out"])
            jobs.append(j)
    (PUBLIC / "gen" / "vox").mkdir(parents=True, exist_ok=True)
    jf = BUILD / f"tts-jobs-{os.getpid()}.json"
    jf.parent.mkdir(parents=True, exist_ok=True)
    jf.write_text(json.dumps(jobs))
    print(f"  voicing {len(jobs)} lines ...", flush=True)
    subprocess.run([str(TTS_PY), str(TTS_DIR / "batch.py"), str(jf)], check=True, cwd=TTS_DIR)
    for j in jobs:
        raw = Path(j["out"])
        # trim silence, a touch faster, consistent level
        af = (
            "silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.05,"
            "areverse,silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.08,areverse,"
            f"atempo={tempo},loudnorm=I=-16:TP=-1.5:LRA=9,aresample=48000"
        )
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(raw), "-af", af, "-ac", "1", j["final"]], check=True)
        raw.unlink(missing_ok=True)


def mouth_track(wav: Path, frames: int) -> str:
    audio, sr = sf.read(wav, dtype="float32")
    if audio.ndim > 1:
        audio = audio.mean(axis=1)
    hop = sr / FPS
    env = np.array([np.sqrt(np.mean(audio[int(i * hop): int((i + 1) * hop)] ** 2) + 1e-12) for i in range(frames)])
    ref = np.percentile(env, 92) + 1e-6
    v = np.clip(env / ref, 0, 1)
    v = np.where(v < 0.12, 0, v)
    # a little smoothing, then quantise
    v = np.convolve(v, [0.25, 0.5, 0.25], mode="same")
    return "".join(str(int(round(x * 9))) for x in v)


# ---------------------------------------------------------------- audio assets


def ensure_music(style: str) -> Path:
    import cine_audio

    p = PUBLIC / "gen" / "music" / f"cine-{style}.wav"
    if not p.exists():
        p.parent.mkdir(parents=True, exist_ok=True)
        print(f"  composing {style} music ...", flush=True)
        sf.write(p, cine_audio.cine_music(style, 150), cine_audio.SR)
    return p


def ensure_sfx(name: str) -> str | None:
    import cine_audio

    rel = f"gen/sfx/{name}.wav"
    p = PUBLIC / rel
    if p.exists():
        return rel
    x = cine_audio.foley(name)
    if x is None:
        return studio.sfx_file(name)
    p.parent.mkdir(parents=True, exist_ok=True)
    sf.write(p, x, cine_audio.SR)
    return rel


def ensure_amb(name: str) -> str:
    import cine_audio

    rel = f"gen/amb/{name}.wav"
    p = PUBLIC / rel
    if not p.exists():
        p.parent.mkdir(parents=True, exist_ok=True)
        sf.write(p, cine_audio.ambience(name), cine_audio.SR)
    return rel


def auto_sfx(s: dict) -> str | None:
    if s.get("sfx"):
        return None if s["sfx"] == "none" else s["sfx"]
    if s.get("card"):
        return "stinger"
    cr = s.get("creature") or {}
    if cr.get("pose") == "scream":
        return "stinger"
    p = (s.get("prop") or {}).get("type")
    if p in ("note", "letter", "book", "news", "calendar", "photo", "map", "poster"):
        return "page"
    if p == "phone":
        return "buzz"
    if s.get("t") == "whip":
        return "whoosh"
    if s.get("t") == "flash":
        return "sub"
    if s.get("cross"):
        return "sub"
    return None


def scene_amb(scene: dict) -> str | None:
    if scene.get("amb"):
        return None if scene["amb"] == "none" else scene["amb"]
    kinds = {i["t"] for i in scene.get("items", [])}
    if scene["kind"] == "outside":
        if scene.get("weather") == "rain":
            return "rain"
        if scene.get("ground") == "snow" or scene.get("weather") == "snow":
            return "wind"
        if scene.get("far") in ("pines", "forest"):
            return "forest"
        if scene.get("far") == "city":
            return "city"
        return "night"
    if kinds & {"stove", "fireplace", "campfire"}:
        return "fire"
    return "room"


# ---------------------------------------------------------------- build


def build_part(story: dict, part: dict, pad: int = 0) -> dict:
    narrator = story.get("narrator", "bm_george")
    tempo = float(story.get("tempo", 1.06))
    shots, frame = [], 0
    for s in part["shots"]:
        shot = dict(s)
        if s.get("vo"):
            voice = narrator if not s.get("who") else story["cast"][s["who"]].get("voice", narrator)
            wav = vox_path(voice, spoken(s["vo"]), tempo)
            text, hls = shown(s["vo"])
            if not wav.exists() and os.environ.get("TOON_DRY"):
                # layout preview without a voice: estimate the timing
                vo_frames = max(20, round(len(text.split()) * 0.36 * FPS))
                words = studio.word_timing(text, vo_frames)
                shot.update(voFrames=vo_frames, mouth="5" * vo_frames if s.get("who") else None)
            else:
                info = sf.info(wav)
                vo_frames = math.ceil(info.frames / info.samplerate * FPS)
                words = studio.whisper_words(wav, text, vo_frames)
                shot.update(audio=str(wav.relative_to(PUBLIC)), voFrames=vo_frames, mouth=mouth_track(wav, vo_frames) if s.get("who") else None)
            for w, h in zip(words, hls):
                if h:
                    w["hl"] = h
            shot["words"] = words
            dur = VO_OFFSET + vo_frames + 5 + pad
        else:
            dur = 0
        if s.get("hold"):
            dur = max(dur, round(s["hold"] * FPS))
        dur = max(dur, 24)
        shot["from"], shot["dur"] = frame, dur
        name = auto_sfx(s)
        if name:
            shot["sfxFile"] = ensure_sfx(name)
        amb = scene_amb(story["scenes"][s["scene"]])
        if amb:
            shot["amb"] = ensure_amb(amb)
        shots.append(shot)
        frame += dur
    shots[-1]["dur"] += END_CARD
    frame += END_CARD
    if frame < MIN_SECONDS * FPS and pad == 0:
        extra = math.ceil((MIN_SECONDS * FPS - frame) / len(part["shots"]))
        print(f"  part {part['part']} is {frame / FPS:.1f}s, adding {extra / FPS:.2f}s per shot")
        return build_part(story, part, pad=extra)
    meta = {k: story[k] for k in ("id", "title", "cast", "scenes") if k in story}
    meta["accent"] = story.get("accent", "#ffb020")
    return {"story": meta, "part": part["part"], "totalParts": len(story["parts"]), "shots": shots, "durationInFrames": frame}


def all_lines(story: dict, parts: list[dict]) -> list[tuple[str, str]]:
    narrator = story.get("narrator", "bm_george")
    out = []
    for p in parts:
        for s in p["shots"]:
            if s.get("vo"):
                voice = narrator if not s.get("who") else story["cast"][s["who"]].get("voice", narrator)
                out.append((voice, spoken(s["vo"])))
    return out


def load(path: str) -> dict:
    story = parse_story(Path(path))
    errs = validate(story)
    if errs:
        sys.exit("Story has problems:\n  " + "\n  ".join(errs))
    return story


def snapshot_src() -> str:
    """Render from a frozen copy of src/, so editing the code never breaks a render that is running."""
    import shutil

    snap = BUILD / "snap" / f"{os.getpid()}"
    if snap.exists():
        shutil.rmtree(snap)
    shutil.copytree(ROOT / "src", snap / "src")
    return str((snap / "src" / "index.ts").relative_to(ROOT))


def render(props: Path, stem: Path, entry: str, preview: bool = False) -> None:
    stem.parent.mkdir(parents=True, exist_ok=True)
    cmd = ["npx", "remotion", "render", entry, "ToonEpisode", str(stem), f"--props={props}", "--log=error", "--concurrency=4"]
    if preview:
        cmd += ["--scale=0.5"]
    subprocess.run(cmd, cwd=ROOT, check=True)


def cmd_build(args) -> None:
    story = load(args.story)
    entry = snapshot_src()
    wanted = {int(x) for x in args.parts.split(",")} if args.parts else None
    parts = [p for p in story["parts"] if not wanted or p["part"] in wanted]
    synth_lines(all_lines(story, parts), float(story.get("tempo", 1.06)))
    music = ensure_music(story.get("music", "eerie"))
    for part in parts:
        props = build_part(story, part)
        n = part["part"]
        pdir = BUILD / story["id"]
        pdir.mkdir(parents=True, exist_ok=True)
        pp = pdir / f"part-{n:02d}.props.json"
        pp.write_text(json.dumps(props, ensure_ascii=False))
        print(f"[{story['id']}] part {n}/{len(story['parts'])}: {len(props['shots'])} shots, {props['durationInFrames'] / FPS:.1f}s", flush=True)
        if args.no_render:
            continue
        stem = pdir / f"part-{n:02d}.stem.mp4"
        render(pp, stem, entry, preview=args.preview)
        out = OUT / story["id"] / f"{story['id']}-part-{n:02d}.mp4"
        mix(stem, music, out, float(story.get("musicVolume", 0.16)))
        print(f"  -> {out.relative_to(ROOT)}", flush=True)


def cmd_still(args) -> None:
    story = load(args.story)
    part = next(p for p in story["parts"] if p["part"] == args.part)
    if not os.environ.get("TOON_DRY"):
        synth_lines(all_lines(story, [part]), float(story.get("tempo", 1.06)))
    props = build_part(story, part)
    pp = BUILD / "stills" / f"{story['id']}-part-{args.part:02d}.props.json"
    pp.parent.mkdir(parents=True, exist_ok=True)
    pp.write_text(json.dumps(props, ensure_ascii=False))
    shots = [int(x) for x in args.shot.split(",")]
    outdir = Path(args.out)
    outdir.mkdir(parents=True, exist_ok=True)
    for sh in shots:
        s = props["shots"][sh - 1]
        fr = s["from"] + min(s["dur"] - 1, int(s["dur"] * args.at))
        out = outdir / f"{story['id']}-p{args.part}-s{sh:02d}.png"
        subprocess.run(["npx", "remotion", "still", "src/index.ts", "ToonEpisode", str(out), f"--props={pp}", f"--frame={fr}", "--log=error", "--scale=0.5"], cwd=ROOT, check=True)
        print(out)


def cmd_check(args) -> None:
    bad = False
    for f in args.stories:
        story = parse_story(Path(f))
        errs = validate(story)
        words = sum(len(shown(s.get("vo", ""))[0].split()) for p in story["parts"] for s in p["shots"])
        print(f"{f}: {len(story['parts'])} parts, {words} words (~{words / max(1, len(story['parts'])) / 2.6:.0f}s narration per part), {'OK' if not errs else 'ERRORS'}")
        for e in errs:
            print("   ", e)
        bad |= bool(errs)
    sys.exit(1 if bad else 0)


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = ap.add_subparsers(required=True)
    b = sub.add_parser("build")
    b.add_argument("story")
    b.add_argument("--parts")
    b.add_argument("--no-render", action="store_true")
    b.add_argument("--preview", action="store_true")
    b.set_defaults(fn=cmd_build)
    s = sub.add_parser("still")
    s.add_argument("story")
    s.add_argument("--part", type=int, default=1)
    s.add_argument("--shot", default="1")
    s.add_argument("--at", type=float, default=0.6)
    s.add_argument("--out", default=str(BUILD / "stills"))
    s.set_defaults(fn=cmd_still)
    c = sub.add_parser("check")
    c.add_argument("stories", nargs="+")
    c.set_defaults(fn=cmd_check)
    args = ap.parse_args()
    args.fn(args)


if __name__ == "__main__":
    main()
