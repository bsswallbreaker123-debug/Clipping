"""Write a new story series with Claude: one outline call, then one call per part.

Needs an Anthropic credential (ANTHROPIC_API_KEY or `ant auth login`).
"""

from __future__ import annotations

import json
import re
from pathlib import Path

import anthropic

ROOT = Path(__file__).resolve().parent.parent
TYPES = (ROOT / "src" / "types.ts").read_text()

STYLE = """You write short animated "What if" story series for TikTok/Reels/Shorts.

Format (the renderer is fixed, you only write the script):
- Flat 2D cartoon: dark round-headed characters, simple sets, a narrator plus character dialogue.
- The title box always shows the story's "What if ...?" question.
- A stat counter in the corner tracks the story's core mechanic (money, lies, luck, rating, days...).
- One spoken line per shot, 6-18 words. Each part has 18-21 shots (about 62-70 seconds; TikTok only pays for videos over one minute).

What makes it work (retention is everything, viewers swipe within 2 seconds):
- Every part has a real plot: a goal, an obstacle, a turn. No filler shots.
- Shot 1 of EVERY part is a cold open on the "void" background with camera "punch": one line that
  states the stakes and teases where this part is going ("One lie almost erased Leo from existence.
  And it all started with homework."). Later parts recap and push forward in the same line.
- Put a twist or reveal in the middle of each part, and plant something that pays off later.
- Escalate every part: the mechanic gets bigger, the cost shows up, a twist recontextualises it.
- Every part except the last ends on a cliffhanger line. The last part pays off with a twist and a
  satisfying ending that ties back to the first line.
- Plain spoken English, short sentences, concrete numbers, no narrator filler, no swearing,
  nothing that targets real people or brands. Keep it suitable for a teen audience.
- Vary the visuals: change camera (close-ups on reactions, punch on shocks, pans on walks),
  use popups for "the system" moments, phones for texts/followers/bank, banners for news or
  big reveals, labels for time jumps, transitions (whip/fade/flash) on scene changes.
- Characters only appear where they are on screen; a camera focus must point at a character in
  that shot. Use x between 0.15 and 0.85, keep two-person dialogue around 0.35 and 0.65.
"""


def _client() -> anthropic.Anthropic:
    return anthropic.Anthropic()


def _ask(client: anthropic.Anthropic, model: str, prompt: str) -> dict:
    with client.beta.messages.stream(
        model=model,
        max_tokens=64000,
        betas=["server-side-fallback-2026-07-01"],
        fallbacks="default",
        thinking={"type": "adaptive"},
        output_config={"effort": "high"},
        system=STYLE + "\n\nThe script format (TypeScript types):\n```ts\n" + TYPES + "\n```",
        messages=[{"role": "user", "content": prompt}],
    ) as stream:
        msg = stream.get_final_message()
    if msg.stop_reason == "refusal":
        raise RuntimeError(f"Claude declined this premise: {getattr(msg.stop_details, 'explanation', '')}")
    if msg.stop_reason == "max_tokens":
        raise RuntimeError("Output was cut off (max_tokens); try fewer parts per run.")
    text = "".join(b.text for b in msg.content if b.type == "text")
    m = re.search(r"\{.*\}", text, re.S)
    if not m:
        raise RuntimeError("No JSON in the reply:\n" + text[:500])
    return json.loads(m.group(0))


def write_story(premise: str, parts: int, model: str = "claude-opus-5-5") -> dict:
    client = _client()
    outline = _ask(
        client,
        model,
        f"""Premise: {premise}
Number of parts: {parts}

Return ONLY a JSON object with: id (kebab-case), title (the "What If ...?" question, max 12 words),
mood (trend|phonk|curious|emotional|tense|triumphant|mystery; trend is the default), narrator (kokoro voice, e.g. am_michael),
stat ({{name, start, decimals, suffix?}}), captions (false), cast (3-6 members, each with a
distinct look and a kokoro voice: am_puck, am_echo, am_fenrir, am_liam, af_bella, af_sarah, af_nicole,
af_sky, bm_george, bf_emma), and outline: an array of {parts} objects
{{part, summary (3-4 sentences), cliffhanger (the last spoken line)}}.""",
    )
    story = {k: v for k, v in outline.items() if k != "outline"}
    story["parts"] = []
    for item in outline["outline"]:
        n = item["part"]
        print(f"  writing part {n}/{parts} ...")
        prev = story["parts"][-1]["shots"][-3:] if story["parts"] else []
        part = _ask(
            client,
            model,
            f"""Story so far (header, cast and full outline):
{json.dumps(outline, ensure_ascii=False)}

Last shots of the previous part: {json.dumps(prev, ensure_ascii=False)}

Write part {n} now: 18-21 shots, starting with the cold open, ending on the line "{item['cliffhanger']}".
Return ONLY a JSON object {{"part": {n}, "shots": [...]}} using exactly the Shot type.""",
        )
        story["parts"].append({"part": n, "shots": part["shots"]})
    return story
