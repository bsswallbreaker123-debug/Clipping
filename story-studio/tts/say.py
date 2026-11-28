import sys, time, torch, torchaudio
from chatterbox.tts import ChatterboxTTS
torch.set_num_threads(4)
m = ChatterboxTTS.from_pretrained(device="cpu")
ref, out, ex, cfg = sys.argv[1], sys.argv[2], float(sys.argv[3]), float(sys.argv[4])
text = sys.argv[5]
t = time.time()
wav = m.generate(text, audio_prompt_path=ref, exaggeration=ex, cfg_weight=cfg)
torchaudio.save(out, wav, m.sr)
print(f"{time.time()-t:.1f}s for {wav.shape[1]/m.sr:.1f}s audio")
