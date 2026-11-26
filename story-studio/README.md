# Story Studio

Animierte „What If…?“-Geschichten als Serie (5 oder 10–15 Teile) für TikTok, Reels und Shorts.
Flacher 2D-Cartoon-Stil, Erzählerstimme plus Figuren-Dialoge, leise Hintergrundmusik, Soundeffekte,
Statuszähler, Pop-ups, Handy-Screens, Teil-Badge und „Part X →“-End-Card.

Alles läuft lokal und ohne Lizenzprobleme:

| Teil | Werkzeug | Lizenz |
|---|---|---|
| Animation & Rendering | [Remotion](https://remotion.dev) (React → MP4) | frei für Einzelpersonen/Teams ≤ 3 Personen, darüber Firmenlizenz |
| Stimmen | [Kokoro-82M](https://huggingface.co/hexgrad/Kokoro-82M) über `kokoro-onnx` | Apache 2.0 |
| Musik & SFX | selbst erzeugt (`pipeline/audio_synth.py`) | gehört dir, kein Content ID |
| Schriften | Inter, Montserrat (`@fontsource`) | SIL OFL |

## Setup

Voraussetzungen: Node 20+, [uv](https://docs.astral.sh/uv/), ffmpeg.

```bash
cd story-studio
bash scripts/setup.sh        # npm install, uv sync, Kokoro-Modell (~350 MB)
```

## Video bauen

```bash
uv run pipeline/studio.py build stories/lies-come-true.json             # alle Teile
uv run pipeline/studio.py build stories/lies-come-true.json --parts 1,2 # nur bestimmte Teile
uv run pipeline/studio.py build stories/lies-come-true.json --preview   # halbe Auflösung, schneller
```

Ergebnis: `out/<story-id>/<story-id>-part-01.mp4` usw. (1080×1920, 30 fps, H.264,
Lautheit auf −14 LUFS normalisiert, also so laut wie TikTok/Reels/Shorts abspielen).
Rendern dauert etwa 2–3 Minuten pro Teil auf 4 CPU-Kernen.

Live-Vorschau mit Zeitleiste: zuerst `studio.py build … --no-render`, dann
`npx remotion studio` und dort die Props-Datei aus `build/<story>/` laden.

## Neue Geschichte schreiben lassen

```bash
export ANTHROPIC_API_KEY=...
uv run pipeline/studio.py new "What if you could hear everyone's thoughts about you for 24 hours" --parts 10
uv run pipeline/studio.py build stories/<neue-id>.json
```

Claude schreibt zuerst eine Gliederung (Hook, Eskalation, Cliffhanger pro Teil, Twist am Ende),
dann jeden Teil einzeln im Skriptformat. `studio.py check stories/*.json` prüft jede Datei.

## Skriptformat (`stories/*.json`)

Das vollständige Format steht in `src/types.ts`. Kurzfassung:

```jsonc
{
  "id": "lies-come-true",
  "title": "What If Every Lie You Told Instantly Came True?",  // Box oben
  "mood": "trend",            // Musik: trend | phonk | curious | emotional | tense | triumphant | mystery
  "narrator": "am_michael",   // Kokoro-Stimme des Erzählers
  "stat": { "name": "Lies", "start": 0, "decimals": 0 },       // Zähler unten rechts
  "cast": { "leo": { "name": "Leo", "voice": "am_puck", "hair": "slick", "shirt": "#ff8c42", "shirtStyle": "hoodie" } },
  "parts": [{ "part": 1, "shots": [
    { "bg": "hallway", "label": "SCHOOL", "crowd": 5, "camera": { "focus": "leo" },
      "who": "leo", "vo": "Sorry man. I'm a black belt in karate.",
      "stat": { "delta": 1 },
      "popup": { "title": "SKILL INSTALLED", "lines": ["KARATE: BLACK BELT"], "style": "success" },
      "chars": [{ "id": "leo", "x": 0.42, "expr": "smug", "facing": "right" }] }
  ]}]
}
```

Ein Shot entspricht einer gesprochenen Zeile. Seine Länge richtet sich automatisch nach der Stimme.

- **Hintergründe:** bedroom, classroom, cafeteria, hallway, street, park, office, gym, party, livingroom,
  store, rooftop, void, stage, school, hospital (+ `time`: day/evening/night)
- **Gesichter:** neutral, happy, grin, smug, sad, crying, shocked, angry, nervous, confused, love, sleepy, determined, cringe
- **Aktionen:** idle, talk, walk, run, jump, shake, wave, point, celebrate, facepalm, shrug, phone, sit, fall,
  enter-left/right, exit-left/right
- **Effekte an Figuren:** sweat, tears, blush, anger, sparkle, hearts, question, exclaim, zzz, stars, `glow`, `fade` (unsichtbar werden)
- **Kamera:** wide, slowzoom, zoomout, panleft, panright, punch, shake, `{ "focus": "<id>", "zoom": 2 }`
- **Overlays:** `popup` (System-Meldung), `phone` (chat, dating, social, notification, bank, search),
  `banner` (ad, news, chapter, stamp), `emoji`
- **Übergänge:** cut, fade, whip, flash. Soundeffekte werden automatisch passend gewählt (`sfx` überschreibt).

Haare: none, spiky, beanie, cap, curly, afro, long, bun, ponytail, bob, mohawk, slick.
Accessoires: glasses, sunglasses, headphones, earrings, crown, bow, chain, tie.

## Musik

Standard ist `trend`: ein selbst erzeugter Trap/Lo-Fi-Storytelling-Beat (128 BPM Half-Time, D-Moll,
E-Piano-Akkorde, 808, Claps, Hi-Hat-Rolls, Vinyl-Knistern). Das ist der Sound, den die großen
„What if“-Kanäle unter ihre Erzählungen legen. Alternative: `phonk` (Cowbell, verzerrte 808).
Die Musik wird erst nach dem Rendern dazugemischt und automatisch abgesenkt, sobald jemand spricht.
Deshalb lässt sie sich in Sekunden austauschen, ohne neu zu rendern:

```bash
uv run pipeline/studio.py remix stories/lies-come-true.json --music phonk
uv run pipeline/studio.py remix stories/lies-come-true.json --music public/music/mein-track.mp3 --volume 0.15
uv run pipeline/studio.py remix stories/lies-come-true.json --music none   # nur Stimme + SFX
```

**Echte Trend-Sounds** (aktuelle Charts-Songs) sind urheberrechtlich geschützt. Wer sie selbst ins
Video mischt, riskiert Stummschaltung oder Sperrung. Der richtige Weg: mit `--music none` exportieren und
den Trend-Sound beim Hochladen in der TikTok-App unter „Sounds“ hinzufügen, dort auf ca. 10–15 %
Lautstärke stellen. Das ist lizenziert, und das Video wird zusätzlich über die Sound-Seite gefunden.

## Stellschrauben

| Was | Wo |
|---|---|
| Musiklautstärke | `"musicVolume": 0.19` im Story-JSON oder `remix --volume` |
| Eigene Musik | `"music": "public/music/x.mp3"` im Story-JSON oder `--music <datei>` |
| Sprechtempo | `VOICE_SPEED=1.1 uv run pipeline/studio.py build …` |
| Untertitel einblenden | `"captions": true` im Story-JSON |
| Render-Kerne | `RENDER_CONCURRENCY=8` |

Hinweis zur Länge: Für das TikTok-Creator-Rewards-Programm müssen Videos über 1 Minute lang sein.
Mit 16–18 Shots pro Teil landet man bei ca. 60–70 Sekunden.
