"""Procedural background music and sound effects.

Everything is synthesised here, so the output is original and free to use on any
platform (no licensing, no Content ID claims). Drop your own tracks into
public/music/ and pass --music to use those instead.
"""

from __future__ import annotations

import numpy as np

SR = 44100
rng = np.random.default_rng(7)

NOTE = {"C": 0, "C#": 1, "Db": 1, "D": 2, "D#": 3, "Eb": 3, "E": 4, "F": 5, "F#": 6, "Gb": 6, "G": 7, "G#": 8, "Ab": 8, "A": 9, "A#": 10, "Bb": 10, "B": 11}


def hz(midi: float) -> float:
    return 440.0 * 2 ** ((midi - 69) / 12)


def chord(name: str, octave: int = 4) -> list[int]:
    minor = name.endswith("m")
    root = NOTE[name[:-1] if minor else name]
    base = 12 * (octave + 1) + root
    return [base, base + (3 if minor else 4), base + 7]


def env(n: int, attack: float, decay: float) -> np.ndarray:
    t = np.arange(n) / SR
    a = np.clip(t / max(attack, 1e-4), 0, 1)
    return a * np.exp(-t / decay)


def tone(freq: float, dur: float, harmonics: list[tuple[float, float, float]], attack=0.005, detune=0.0) -> np.ndarray:
    """harmonics: (multiple, amplitude, decay seconds)."""
    n = int(dur * SR)
    t = np.arange(n) / SR
    out = np.zeros(n)
    for mult, amp, dec in harmonics:
        f = freq * mult
        if f > SR / 2.2:
            continue
        out += amp * np.sin(2 * np.pi * f * t + rng.uniform(0, 6.28)) * env(n, attack, dec)
        if detune:
            out += amp * 0.5 * np.sin(2 * np.pi * f * (1 + detune) * t) * env(n, attack, dec)
    return out


def piano(freq, dur):
    return tone(freq, dur, [(1, 1.0, 1.1), (2, 0.45, 0.6), (3, 0.22, 0.35), (4, 0.12, 0.25), (5, 0.06, 0.18)], attack=0.004)


def pluck(freq, dur):
    return tone(freq, dur, [(1, 1.0, 0.22), (2, 0.5, 0.12), (3, 0.25, 0.08), (4, 0.1, 0.05)], attack=0.002)


def marimba(freq, dur):
    return tone(freq, dur, [(1, 1.0, 0.35), (3.9, 0.35, 0.07), (9.8, 0.12, 0.03)], attack=0.002)


def bell(freq, dur):
    return tone(freq, dur, [(1, 1.0, 1.4), (2.76, 0.4, 0.6), (5.4, 0.2, 0.3)], attack=0.003)


def pad(freqs, dur):
    n = int(dur * SR)
    t = np.arange(n) / SR
    out = np.zeros(n)
    for f in freqs:
        for k in range(1, 6):
            out += (0.5 / k) * (np.sin(2 * np.pi * f * k * t) + np.sin(2 * np.pi * f * k * 1.004 * t + 1.3))
    a = np.clip(t / 0.6, 0, 1) * np.clip((dur - t) / 0.6, 0, 1)
    return out * a * 0.08


def bass(freq, dur):
    return tone(freq, dur, [(1, 1.0, 0.5), (2, 0.3, 0.3)], attack=0.01)


def kick(dur=0.35):
    n = int(dur * SR)
    t = np.arange(n) / SR
    f = 45 + 90 * np.exp(-t * 28)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 9)


def hat(dur=0.06):
    n = int(dur * SR)
    x = np.diff(rng.standard_normal(n + 1))
    return x * np.exp(-np.arange(n) / SR * 60) * 0.25


def snap(dur=0.15):
    n = int(dur * SR)
    x = rng.standard_normal(n)
    x = x - np.convolve(x, np.ones(8) / 8, mode="same")
    return x * np.exp(-np.arange(n) / SR * 30) * 0.5


def lowpass(x: np.ndarray, cutoff: float) -> np.ndarray:
    """Windowed-sinc FIR low-pass."""
    taps = 255
    m = np.arange(taps) - (taps - 1) / 2
    h = np.sinc(2 * cutoff / SR * m) * np.hamming(taps)
    h /= h.sum()
    return np.convolve(x, h, mode="same")


def reverb(x: np.ndarray, seconds=1.6, wet=0.22) -> np.ndarray:
    n = int(seconds * SR)
    ir = rng.standard_normal(n) * np.exp(-np.arange(n) / SR * (6.9 / seconds))
    ir = np.convolve(ir, np.ones(30) / 30, mode="same")
    ir /= np.sqrt((ir**2).sum())
    size = 1 << int(np.ceil(np.log2(len(x) + n)))
    y = np.fft.irfft(np.fft.rfft(x, size) * np.fft.rfft(ir, size), size)[: len(x)]
    return x * (1 - wet) + y * wet * 2.2


MOODS = {
    # bpm, progression, lead instrument, arp octave, drums, pad
    "curious": dict(bpm=104, prog=["C", "Am", "F", "G"], lead=pluck, arp=marimba, drums="light", pad=True),
    "emotional": dict(bpm=72, prog=["Am", "F", "C", "G"], lead=piano, arp=piano, drums=None, pad=True),
    "tense": dict(bpm=92, prog=["Dm", "Bb", "Gm", "A"], lead=bell, arp=pluck, drums="pulse", pad=True),
    "triumphant": dict(bpm=112, prog=["C", "G", "Am", "F"], lead=marimba, arp=pluck, drums="full", pad=True),
    "mystery": dict(bpm=84, prog=["Em", "C", "Am", "B"], lead=bell, arp=marimba, drums="light", pad=True),
}


def music(mood: str = "curious", seconds: float = 150.0, seed: int = 1) -> np.ndarray:
    global rng
    rng = np.random.default_rng(seed)
    m = MOODS.get(mood, MOODS["curious"])
    beat = 60 / m["bpm"]
    bar = beat * 4
    n = int(seconds * SR) + SR * 3
    L = np.zeros(n)
    R = np.zeros(n)

    def put(sig, start, pan=0.0, gain=1.0):
        i = int(start * SR)
        if i >= n:
            return
        sig = sig[: n - i] * gain
        L[i : i + len(sig)] += sig * (1 - max(0, pan))
        R[i : i + len(sig)] += sig * (1 + min(0, pan))

    bars = int(seconds / bar) + 1
    # a few melodic motifs (scale degrees over the chord) reused with variation
    motifs = [[0, 2, 1, 2, 0, -1, 0, None], [2, 1, 0, 1, 2, None, 2, 1], [0, None, 1, 2, 3, 2, 1, None]]
    for b in range(bars):
        name = m["prog"][b % len(m["prog"])]
        notes = chord(name, 4)
        t0 = b * bar
        section = (b // 8) % 4  # 0 intro, 1 groove, 2 lift, 3 breakdown
        if m["pad"]:
            put(pad([hz(x - 12) for x in notes], bar + 0.3), t0, gain=0.9)
        put(bass(hz(notes[0] - 24), bar * 0.9), t0, gain=0.55)
        if m["bpm"] >= 90 and section in (1, 2):
            put(bass(hz(notes[0] - 24), beat * 0.9), t0 + beat * 2.5, gain=0.35)
        # arpeggio in 8ths
        for k in range(8):
            if section == 3 and k % 2:
                continue
            note = notes[[0, 1, 2, 1, 0, 2, 1, 2][k]] + (12 if k in (2, 5) else 0)
            put(m["arp"](hz(note), beat * 1.2), t0 + k * beat / 2, pan=-0.35 if k % 2 else 0.35, gain=0.22)
        # lead motif from section 1 on
        if section in (1, 2):
            motif = motifs[(b // 2) % len(motifs)]
            scale = [notes[0], notes[0] + 2, notes[1], notes[0] + 5, notes[2], notes[2] + 2]
            for k, deg in enumerate(motif):
                if deg is None:
                    continue
                note = scale[(deg + len(scale)) % len(scale)] + 12
                put(m["lead"](hz(note), beat * 1.5), t0 + k * beat / 2, pan=0.1, gain=0.28 if section == 2 else 0.2)
        # drums
        d = m["drums"]
        if d and section != 0:
            for k in range(4):
                if d in ("light", "full", "pulse") and k in (0, 2):
                    put(kick(), t0 + k * beat, gain=0.5 if d != "pulse" else 0.6)
                if d in ("light", "full") and k in (1, 3):
                    put(snap(), t0 + k * beat, gain=0.35, pan=0.1)
                for h in range(2):
                    put(hat(), t0 + k * beat + h * beat / 2, gain=0.5 if h else 0.3, pan=-0.2)
    mix = np.stack([L, R])
    mix = np.stack([reverb(mix[0]), reverb(mix[1])])
    mix = mix[:, : int(seconds * SR)]
    # gentle tone: roll off harshness
    mix = np.stack([lowpass(c, 6000) for c in mix])
    # fade loop edges so `loop` in the renderer stays smooth
    f = int(1.5 * SR)
    ramp = np.linspace(0, 1, f)
    mix[:, :f] *= ramp
    mix[:, -f:] *= ramp[::-1]
    mix /= np.max(np.abs(mix)) + 1e-9
    return (mix * 0.89).T


# ---------------- sound effects ----------------


def sfx(name: str) -> np.ndarray:
    global rng
    rng = np.random.default_rng(abs(hash(name)) % 1000)
    if name == "ding":
        x = bell(hz(88), 0.9) * 0.5 + np.pad(bell(hz(95), 0.81), (int(0.09 * SR), 0))[: int(0.9 * SR)] * 0.5
    elif name == "down":
        t = np.arange(int(0.55 * SR)) / SR
        f = 620 * np.exp(-t * 2.6)
        x = np.sign(np.sin(2 * np.pi * np.cumsum(f) / SR)) * 0.3 * np.exp(-t * 3)
        x = lowpass(x, 2500)
    elif name == "glitch":
        parts = []
        for _ in range(6):
            seg = int(rng.uniform(0.015, 0.05) * SR)
            f = rng.uniform(300, 2400)
            t = np.arange(seg) / SR
            parts.append(np.round(np.sin(2 * np.pi * f * t) * 3) / 3 * 0.5)
            parts.append(np.zeros(int(rng.uniform(0.005, 0.02) * SR)))
        x = np.concatenate(parts)
    elif name == "notify":
        x = np.concatenate([marimba(hz(84), 0.12), marimba(hz(91), 0.5)]) * 0.8
    elif name == "whoosh":
        n = int(0.5 * SR)
        noise = rng.standard_normal(n)
        k = np.hanning(n)
        x = np.convolve(noise, np.ones(20) / 20, mode="same") * k * 1.5
    elif name in ("impact", "slam", "hit"):
        x = kick(0.6) * 1.0
        nz = rng.standard_normal(int(0.25 * SR)) * np.exp(-np.arange(int(0.25 * SR)) / SR * 18) * 0.4
        x[: len(nz)] += nz
    elif name == "pop":
        t = np.arange(int(0.12 * SR)) / SR
        x = np.sin(2 * np.pi * (500 + 900 * t / 0.12) * t) * np.exp(-t * 30)
    elif name == "levelup":
        x = np.concatenate([marimba(hz(n), 0.11) for n in (72, 76, 79)] + [bell(hz(84), 0.9)]) * 0.7
    elif name == "cash":
        x = np.concatenate([bell(hz(96), 0.08), bell(hz(100), 0.6)]) * 0.6
    elif name == "heartbeat":
        x = np.concatenate([kick(0.18), np.zeros(int(0.08 * SR)), kick(0.3) * 0.7])
    else:
        x = np.zeros(int(0.1 * SR))
    x = x / (np.max(np.abs(x)) + 1e-9) * 0.8
    return np.stack([x, x]).T
