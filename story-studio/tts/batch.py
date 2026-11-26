import os
os.environ["TQDM_DISABLE"] = "1"
# usage: batch.py jobs.json  -> jobs: [{"ref":..., "out":..., "text":...}]
import json, sys, time, torch, torchaudio
from chatterbox.tts_turbo import ChatterboxTurboTTS
torch.set_num_threads(int(__import__("os").environ.get("TTS_THREADS", "4")))
m = ChatterboxTurboTTS.from_pretrained(device="cpu")
jobs = json.load(open(sys.argv[1]))
last = None
for j in jobs:
    t = time.time()
    if j["ref"] != last:
        m.prepare_conditionals(j["ref"]); last = j["ref"]
    wav = m.generate(j["text"])
    torchaudio.save(j["out"], wav, m.sr)
    print(f"{time.time()-t:5.1f}s {wav.shape[1]/m.sr:5.1f}s  {j['out']}", flush=True)
