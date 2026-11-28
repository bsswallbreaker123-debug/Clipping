# usage: design.py OUTDIR  -> one test clip per designed voice (VoxCPM2 voice design, no reference audio)
import os, sys, time
os.environ["TQDM_DISABLE"] = "1"
import torch, soundfile as sf
torch.set_num_threads(4)
from voxcpm import VoxCPM

TEXT = ("Every year on December fifth, the parents in my village lock their doors. "
        "Not because of burglars. Because of him. "
        "Last December, my little sister broke the first rule... and that night, I heard the bells.")
VOICES = {
    "A_deep_us_storyteller": "A deep, warm, slightly raspy American man in his forties, calm late-night storyteller, slow and suspenseful",
    "B_british_narrator": "A deep British man in his fifties, mysterious documentary narrator, calm, grave and captivating",
    "C_soft_female": "A young American woman, soft and breathy, intimate and a little scared, telling a horror story at night",
    "D_hype_us_male": "An energetic young American man, dramatic and gripping social media storyteller, quick pace, lots of emotion",
}
out = sys.argv[1]
t = time.time()
m = VoxCPM.from_pretrained("openbmb/VoxCPM2", load_denoiser=False, optimize=False, device="cpu")
print(f"loaded in {time.time()-t:.0f}s", flush=True)
sr = getattr(m.tts_model, "sample_rate", 48000)
for name, desc in VOICES.items():
    for take in (1,):
        t = time.time()
        wav = m.generate(text=f"({desc}){TEXT}", cfg_value=2.0, inference_timesteps=10)
        f = f"{out}/{name}_{take}.wav"
        sf.write(f, wav, sr)
        print(f"{name} take {take}: {time.time()-t:.0f}s for {len(wav)/sr:.1f}s audio -> {f}", flush=True)
