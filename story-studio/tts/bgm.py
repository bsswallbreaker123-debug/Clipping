# usage (inside the ACE-Step venv): bgm.py OUTDIR NAME SECONDS [SEED]  -> instrumental background track (ACE-Step 1.5 turbo, DiT only, CPU)
import os, sys, time, shutil
os.environ.setdefault("TQDM_DISABLE", "1")
import torch
torch.set_num_threads(4)
from acestep.handler import AceStepHandler
from acestep.inference import GenerationParams, GenerationConfig, generate_music

STYLES = {
    # the reference video: ~140 bpm, A harmonic minor, melodic mid-range, very little percussion
    "mystery": "mysterious playful pizzicato strings and celesta with soft piano, curious sneaky detective storytelling background music, light finger snaps, bouncy, instrumental, no vocals",
    "dark": "eerie music box melody with soft piano and low string drone, dark mysterious horror storytelling background, subtle ticking percussion, instrumental, no vocals",
    "tense": "suspenseful cinematic pizzicato and piano ostinato with pulsing low strings, tense thriller storytelling background, light drums, instrumental, no vocals",
}
out, name, secs = sys.argv[1], sys.argv[2], float(sys.argv[3])
root = os.path.join(os.path.dirname(os.path.abspath(__file__)), "acestep")  # clone of github.com/ace-step/ACE-Step-1.5 with checkpoints/
t = time.time()
dit = AceStepHandler()
print(dit.initialize_service(project_root=root, config_path="acestep-v15-turbo", device="cpu"), flush=True)
print(f"loaded {time.time()-t:.0f}s", flush=True)
params = GenerationParams(caption=STYLES[name], lyrics="[Instrumental]", instrumental=True, bpm=140, keyscale="A minor",
                          timesignature="4", duration=secs, inference_steps=8, seed=int(sys.argv[4]) if len(sys.argv) > 4 else 7, thinking=False)
config = GenerationConfig(batch_size=1, audio_format="wav")
t = time.time()
res = generate_music(dit, None, params, config, save_dir=out)
print(f"generated {secs}s in {time.time()-t:.0f}s ok={res.success} err={getattr(res,'error',None)}", flush=True)
for a in res.audios:
    dst = os.path.join(out, f"bgm-{name}.wav")
    shutil.copy(a["path"], dst)
    print(dst)
