"""Cinematic music beds, foley and ambience loops for the toon style (all synthesised, royalty free)."""

from __future__ import annotations

import numpy as np

from audio_synth import SR, bell, hz, kick, lowpass, pad, piano, pluck, reverb

rng = np.random.default_rng(11)


def _n(sec: float) -> int:
    return int(sec * SR)


def saw(freq: float, dur: float, detune: float = 0.006) -> np.ndarray:
    t = np.arange(_n(dur)) / SR
    out = np.zeros_like(t)
    for d in (-detune, 0, detune):
        ph = (t * freq * (1 + d)) % 1.0
        out += 2 * ph - 1
    return out / 3


def highpass(x: np.ndarray, cutoff: float) -> np.ndarray:
    return x - lowpass(x, cutoff)


def place(buf: np.ndarray, x: np.ndarray, at: float, gain: float = 1.0) -> None:
    i = _n(at)
    if i >= len(buf):
        return
    j = min(len(buf), i + len(x))
    buf[i:j] += x[: j - i] * gain


def fade(x: np.ndarray, a: float = 0.01, r: float = 0.05) -> np.ndarray:
    n = len(x)
    e = np.ones(n)
    na, nr = min(n, _n(a)), min(n, _n(r))
    if na:
        e[:na] = np.linspace(0, 1, na)
    if nr:
        e[-nr:] *= np.linspace(1, 0, nr)
    return x * e


def stereo(x: np.ndarray, width: float = 0.0) -> np.ndarray:
    if width <= 0:
        return np.stack([x, x]).T
    d = _n(0.012 * width)
    r = np.concatenate([np.zeros(d), x[:-d]]) if d else x
    return np.stack([x, r]).T


# ---------------------------------------------------------------- music beds


def cine_music(style: str, seconds: float = 150.0) -> np.ndarray:
    global rng
    rng = np.random.default_rng(abs(hash(style)) % 997)
    n = _n(seconds)
    out = np.zeros(n)
    if style == "eerie":
        bpm = 70
        beat = 60 / bpm
        # drone
        for f, g in ((hz(38), 0.22), (hz(45), 0.14), (hz(50), 0.06)):
            d = lowpass(saw(f, seconds, 0.004), 380) * g
            lfo = 0.7 + 0.3 * np.sin(np.arange(n) / SR * 2 * np.pi * 0.05 + f)
            out += d * lfo
        # music-box motif (minor, sparse, original)
        motif = [74, 77, 81, 80, 77, 74, 73, 74, 77, 76, 74, 69]
        t = 8.0
        i = 0
        while t < seconds - 2:
            note = motif[i % len(motif)]
            place(out, bell(hz(note + 12), 2.4) * 0.11, t)
            t += beat * (1 if i % 4 != 3 else 3)
            i += 1
        # heartbeat pulse in the middle section
        for k in range(int(seconds / beat)):
            tt = k * beat
            if 24 < tt < seconds - 6:
                g = 0.22 + 0.12 * min(1, (tt - 24) / 60)
                place(out, kick(0.25) * g, tt)
                place(out, kick(0.2) * g * 0.6, tt + 0.22)
        # tremolo strings swell
        trem = lowpass(saw(hz(62), seconds, 0.01), 2200) * (0.5 + 0.5 * np.sign(np.sin(np.arange(n) / SR * 2 * np.pi * 9)))
        env = np.clip((np.arange(n) / SR - 60) / 30, 0, 1) * 0.05
        out += trem * env
        # reversed swells every 16 beats
        for k in range(1, int(seconds / (beat * 16))):
            sw = lowpass(rng.standard_normal(_n(2.5)), 1800) * np.linspace(0, 1, _n(2.5)) ** 2 * 0.12
            place(out, sw, k * beat * 16 - 2.5)
        out = reverb(out, 3.0, 0.35)
    elif style == "tension":
        bpm = 128
        s16 = 60 / bpm / 4
        prog = [38, 34, 41, 36]  # D Bb F C (low)
        steps = int(seconds / s16)
        for k in range(steps):
            root = prog[(k // 64) % 4]
            if k % 16 in (0, 3, 6, 8, 11, 14) or k > steps * 0.35:
                note = saw(hz(root), s16 * 0.9, 0.01)
                note = lowpass(note, 900 + 600 * (k % 4 == 0)) * np.exp(-np.arange(len(note)) / SR * 9)
                place(out, note * 0.28, k * s16)
            if k % 16 == 0:
                place(out, kick(0.9) * 0.5, k * s16)
                tk = lowpass(rng.standard_normal(_n(0.6)), 300) * np.exp(-np.arange(_n(0.6)) / SR * 7) * 0.4
                place(out, tk, k * s16)
            if k % 2 == 0:
                tick = highpass(rng.standard_normal(_n(0.02)), 6000) * 0.05
                place(out, tick, k * s16)
        for k in range(int(seconds / (s16 * 64))):
            place(out, pad([hz(prog[k % 4] + 24), hz(prog[k % 4] + 31)], s16 * 64) * 0.7, k * s16 * 64)
        out = reverb(out, 1.4, 0.2)
    elif style == "emotional":
        bpm = 68
        beat = 60 / bpm
        prog = [("A", "m"), ("F", ""), ("C", ""), ("G", "")]
        roots = {"A": 57, "F": 53, "C": 48, "G": 55}
        bars = int(seconds / (beat * 4))
        for b in range(bars):
            r, q = prog[b % 4]
            root = roots[r]
            third = 3 if q == "m" else 4
            chord = [root, root + third, root + 7, root + 12]
            place(out, pad([hz(root - 12), hz(root + third), hz(root + 7)], beat * 4) * 0.9, b * beat * 4)
            for i in range(8):
                place(out, piano(hz(chord[[0, 1, 2, 3, 2, 1, 2, 3][i]] + 12), beat * 1.6) * 0.09, b * beat * 4 + i * beat / 2)
            if b % 2 == 1:
                place(out, piano(hz(root + 24 + [0, 3, 7, 5][b % 4]), beat * 3) * 0.08, b * beat * 4 + beat * 2)
        out = reverb(out, 2.6, 0.3)
    elif style == "synth80s":
        bpm = 112
        s16 = 60 / bpm / 4
        prog = [45, 41, 48, 43]  # Am F C G
        steps = int(seconds / s16)
        for k in range(steps):
            root = prog[(k // 32) % 4]
            arp = [0, 7, 12, 15, 12, 7, 3, 7][k % 8]
            note = saw(hz(root + 12 + arp), s16 * 0.9, 0.004)
            note = lowpass(note, 2600) * np.exp(-np.arange(len(note)) / SR * 6)
            place(out, note * 0.12, k * s16)
            if k % 8 == 0:
                place(out, lowpass(saw(hz(root - 12), s16 * 7, 0.002), 500) * 0.25, k * s16)
            if k % 16 == 8:
                sn = rng.standard_normal(_n(0.25)) * np.exp(-np.arange(_n(0.25)) / SR * 14) * 0.2
                place(out, reverb(sn, 1.0, 0.5), k * s16)
            if k % 8 == 0:
                place(out, kick(0.3) * 0.35, k * s16)
        for k in range(int(seconds / (s16 * 32))):
            r = prog[k % 4]
            place(out, pad([hz(r + 12), hz(r + 15), hz(r + 19)], s16 * 32) * 1.0, k * s16 * 32)
        out = reverb(out, 2.0, 0.3)
    elif style == "heist":
        bpm = 96
        s16 = 60 / bpm / 4
        line = [38, 0, 38, 41, 0, 43, 0, 38, 36, 0, 36, 0, 41, 0, 40, 0]
        steps = int(seconds / s16)
        for k in range(steps):
            m = line[k % 16]
            if m:
                b = lowpass(saw(hz(m), s16 * 1.6, 0.003), 600) * np.exp(-np.arange(_n(s16 * 1.6)) / SR * 5)
                place(out, b * 0.35, k * s16)
            if k % 4 == 2:
                rim = highpass(rng.standard_normal(_n(0.05)), 2500) * np.exp(-np.arange(_n(0.05)) / SR * 60) * 0.25
                place(out, rim, k * s16)
            if k % 8 == 0:
                place(out, kick(0.3) * 0.4, k * s16)
            if k % 2 == 1:
                place(out, highpass(rng.standard_normal(_n(0.03)), 7000) * 0.04, k * s16)
            if k % 32 in (4, 6, 20, 22):
                place(out, pluck(hz(62 + (k % 3)), 0.3) * 0.12, k * s16)
        out = reverb(out, 1.2, 0.15)
    elif style == "festive":
        # mischievous holiday caper: pizzicato + glockenspiel (original melody)
        bpm = 132
        s8 = 60 / bpm / 2
        mel = [72, 0, 74, 76, 79, 0, 76, 74, 72, 0, 67, 0, 69, 71, 72, 0, 74, 0, 76, 77, 79, 81, 79, 0, 77, 76, 74, 72, 71, 0, 67, 0]
        bassl = [48, 55, 52, 55, 53, 60, 55, 59]
        steps = int(seconds / s8)
        for k in range(steps):
            m = mel[k % len(mel)]
            if m:
                place(out, bell(hz(m + 12), 0.7) * 0.07, k * s8)
                place(out, pluck(hz(m), 0.25) * 0.12, k * s8)
            if k % 2 == 0:
                place(out, pluck(hz(bassl[(k // 2) % 8] - 12), 0.4) * 0.3, k * s8)
            if k % 4 == 2:
                place(out, highpass(rng.standard_normal(_n(0.08)), 5000) * np.exp(-np.arange(_n(0.08)) / SR * 30) * 0.08, k * s8)
        out = reverb(out, 1.6, 0.25)
    else:
        return cine_music("eerie", seconds)
    out = out / (np.max(np.abs(out)) + 1e-9) * 0.8
    return stereo(out, 1.0)


# ---------------------------------------------------------------- foley


def foley(name: str) -> np.ndarray | None:
    global rng
    rng = np.random.default_rng(abs(hash(name)) % 1009)
    if name == "knock":
        hit = lowpass(rng.standard_normal(_n(0.12)), 900) * np.exp(-np.arange(_n(0.12)) / SR * 40)
        body = np.sin(2 * np.pi * 140 * np.arange(_n(0.12)) / SR) * np.exp(-np.arange(_n(0.12)) / SR * 30) * 0.6
        k1 = hit + body
        x = np.zeros(_n(1.6))
        for i, at in enumerate((0.0, 0.5, 1.0)):
            place(x, k1, at)
        x = reverb(x, 0.6, 0.15)
    elif name == "bells":
        x = np.zeros(_n(2.6))
        for i in range(26):
            at = rng.uniform(0, 2.2)
            f = rng.uniform(2400, 4200)
            j = np.sin(2 * np.pi * f * np.arange(_n(0.25)) / SR) * np.exp(-np.arange(_n(0.25)) / SR * 18)
            j += highpass(rng.standard_normal(_n(0.25)), 5000) * np.exp(-np.arange(_n(0.25)) / SR * 40) * 0.3
            place(x, j, at, 0.5)
        x = reverb(lowpass(x, 6000), 1.6, 0.4)
    elif name == "chains":
        x = np.zeros(_n(2.0))
        for i in range(30):
            at = rng.uniform(0, 1.7)
            f = rng.uniform(1800, 3600)
            c = np.sin(2 * np.pi * f * np.arange(_n(0.12)) / SR) * np.exp(-np.arange(_n(0.12)) / SR * 35)
            c += np.sin(2 * np.pi * f * 1.41 * np.arange(_n(0.12)) / SR) * np.exp(-np.arange(_n(0.12)) / SR * 45) * 0.5
            place(x, c, at, 0.4)
        x = reverb(x, 1.0, 0.25)
    elif name == "creak":
        t = np.arange(_n(1.4)) / SR
        f = 90 + 40 * np.sin(2 * np.pi * 0.7 * t) + 15 * np.sin(2 * np.pi * 13 * t)
        ph = np.cumsum(f) / SR
        x = ((ph * 7) % 1 < 0.08).astype(float) - 0.08
        x = lowpass(x, 2500) * np.sin(np.pi * t / 1.4)
        x = reverb(x, 0.8, 0.2)
    elif name in ("door", "slam"):
        x = kick(0.7) * 0.9
        nz = lowpass(rng.standard_normal(_n(0.3)), 1500) * np.exp(-np.arange(_n(0.3)) / SR * 14)
        place(x, nz, 0)
        x = reverb(x, 1.0, 0.3)
    elif name == "steps":
        x = np.zeros(_n(2.2))
        for i in range(5):
            cr = lowpass(rng.standard_normal(_n(0.22)), 2600) * np.exp(-np.arange(_n(0.22)) / SR * 14)
            cr *= 1 + 0.6 * (rng.random(_n(0.22)) > 0.85)
            place(x, cr, i * 0.42, 0.7)
    elif name == "stinger":
        x = kick(1.6) * 0.9
        t = np.arange(_n(1.6)) / SR
        sc = np.zeros_like(t)
        for f in (1310, 1388, 1470, 1960):
            sc += np.sin(2 * np.pi * f * t + rng.uniform(0, 6))
        sc *= np.clip(t / 0.03, 0, 1) * np.exp(-t * 2.2) * 0.12
        x = x + sc + lowpass(rng.standard_normal(len(t)), 600) * np.exp(-t * 3) * 0.4
        x = reverb(x, 2.4, 0.4)
    elif name == "riser":
        t = np.arange(_n(2.5)) / SR
        nz = rng.standard_normal(len(t))
        x = np.zeros_like(t)
        for i, c in enumerate(np.linspace(400, 6000, 10)):
            seg = slice(int(i * len(t) / 10), int((i + 1) * len(t) / 10))
            x[seg] = lowpass(nz, c)[seg]
        f = 200 * 2 ** (t / 0.8)
        x = x * 0.5 + np.sin(2 * np.pi * np.cumsum(f) / SR) * 0.15
        x *= (t / t[-1]) ** 2
    elif name == "sub":
        t = np.arange(_n(1.8)) / SR
        f = 70 * np.exp(-t * 1.6) + 28
        x = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 1.5)
    elif name == "whisper":
        x = np.zeros(_n(1.8))
        for i in range(5):
            b = highpass(lowpass(rng.standard_normal(_n(0.3)), 5000), 1500) * np.hanning(_n(0.3))
            place(x, b, i * 0.33, 0.4)
        x = reverb(x, 1.4, 0.4)
    elif name == "page":
        x = highpass(rng.standard_normal(_n(0.4)), 2000) * np.hanning(_n(0.4)) * 0.4
    elif name == "buzz":
        t = np.arange(_n(0.9)) / SR
        x = np.sign(np.sin(2 * np.pi * 180 * t)) * 0.3 * (np.sin(2 * np.pi * 2.5 * t) > 0)
        x = lowpass(x, 800)
    elif name == "churchbell":
        x = np.zeros(_n(4.0))
        for k in range(2):
            place(x, bell(hz(50), 3.0) + bell(hz(62), 3.0) * 0.4, k * 1.6, 0.7)
        x = reverb(x, 3.0, 0.4)
    elif name == "gust":
        t = np.arange(_n(3.0)) / SR
        x = lowpass(rng.standard_normal(len(t)), 700) * np.sin(np.pi * t / 3.0) ** 2 * 1.2
    elif name == "glass":
        x = np.zeros(_n(1.4))
        for i in range(40):
            f = rng.uniform(2500, 7000)
            g = np.sin(2 * np.pi * f * np.arange(_n(0.3)) / SR) * np.exp(-np.arange(_n(0.3)) / SR * rng.uniform(10, 30))
            place(x, g, rng.uniform(0, 0.4) ** 2, 0.3)
        place(x, kick(0.3), 0, 0.5)
    elif name == "tick":
        x = np.zeros(_n(2.0))
        for i in range(4):
            place(x, highpass(rng.standard_normal(_n(0.015)), 3000) * 0.6, i * 0.5)
    elif name == "siren":
        t = np.arange(_n(2.5)) / SR
        f = 700 + 250 * np.sin(2 * np.pi * 0.8 * t)
        x = np.sin(2 * np.pi * np.cumsum(f) / SR) * 0.4
        x = reverb(lowpass(x, 3000), 1.5, 0.4)
    elif name == "beep":
        t = np.arange(_n(0.6)) / SR
        x = np.sin(2 * np.pi * 1000 * t) * ((t % 0.3) < 0.15) * 0.5
    elif name == "alarm":
        t = np.arange(_n(2.0)) / SR
        x = np.sign(np.sin(2 * np.pi * (600 + 300 * ((t * 2) % 1)) * t)) * 0.25
        x = lowpass(x, 3000)
    else:
        return None
    x = x / (np.max(np.abs(x)) + 1e-9) * 0.85
    return stereo(x, 0.5)


# ---------------------------------------------------------------- ambience loops (10 s, seamless)


def ambience(name: str, seconds: float = 10.0) -> np.ndarray:
    global rng
    rng = np.random.default_rng(abs(hash(name)) % 1013)
    n = _n(seconds)
    t = np.arange(n) / SR
    if name == "wind":
        x = lowpass(rng.standard_normal(n), 500) * (0.6 + 0.4 * np.sin(2 * np.pi * t / seconds * 2) ** 2)
        x += highpass(lowpass(rng.standard_normal(n), 2500), 900) * 0.15 * (0.5 + 0.5 * np.sin(2 * np.pi * t / seconds * 3))
    elif name == "fire":
        x = lowpass(rng.standard_normal(n), 250) * 0.6
        for _ in range(int(seconds * 14)):
            place(x, highpass(rng.standard_normal(_n(0.01)), 2000) * rng.uniform(0.2, 1.0), rng.uniform(0, seconds - 0.02))
    elif name == "room":
        x = lowpass(rng.standard_normal(n), 300) * 0.25 + np.sin(2 * np.pi * 50 * t) * 0.02
    elif name == "rain":
        x = highpass(lowpass(rng.standard_normal(n), 6000), 600) * 0.6
        for _ in range(int(seconds * 30)):
            place(x, highpass(rng.standard_normal(_n(0.006)), 3000) * rng.uniform(0.2, 0.8), rng.uniform(0, seconds - 0.01))
    elif name == "night":
        x = lowpass(rng.standard_normal(n), 400) * 0.15
        for k in range(int(seconds * 1.5)):
            at = rng.uniform(0, seconds - 0.4)
            ch = np.sin(2 * np.pi * 4300 * np.arange(_n(0.3)) / SR) * (np.sin(2 * np.pi * 40 * np.arange(_n(0.3)) / SR) > 0) * 0.08
            place(x, ch * np.hanning(len(ch)), at)
    elif name == "crowd":
        x = np.zeros(n)
        for v in range(16):
            f0 = rng.uniform(110, 240)
            syl = (np.sin(2 * np.pi * rng.uniform(3, 6) * t + rng.uniform(0, 6)) > 0.2).astype(float)
            syl = np.convolve(syl, np.ones(400) / 400, mode="same")
            x += np.sin(2 * np.pi * f0 * t + 2 * np.sin(2 * np.pi * 0.5 * t)) * syl * 0.05
        x = lowpass(x + rng.standard_normal(n) * 0.05, 1800)
    elif name == "city":
        x = lowpass(rng.standard_normal(n), 200) * 0.5
        for _ in range(3):
            at = rng.uniform(0, seconds - 4)
            car = lowpass(rng.standard_normal(_n(4)), 600) * np.hanning(_n(4)) * 0.5
            place(x, car, at)
    elif name == "forest":
        x = lowpass(rng.standard_normal(n), 600) * 0.4 * (0.6 + 0.4 * np.sin(2 * np.pi * t / seconds) ** 2)
        for _ in range(3):
            at = rng.uniform(0, seconds - 1)
            tw = np.sin(2 * np.pi * np.cumsum(2500 + 800 * np.sin(2 * np.pi * 9 * np.arange(_n(0.4)) / SR)) / SR) * np.hanning(_n(0.4)) * 0.05
            place(x, tw, at)
    else:
        return np.zeros((n, 2))
    # seamless loop: crossfade the tail into the head
    m = _n(1.0)
    head = x[:m].copy()
    x[:m] = head * np.linspace(0, 1, m) + x[-m:] * np.linspace(1, 0, m)
    x = x[: n - m]
    x = x / (np.max(np.abs(x)) + 1e-9) * 0.6
    return stereo(x, 1.0)
