import sys, time, torch, torchaudio
from chatterbox.tts_turbo import ChatterboxTurboTTS
torch.set_num_threads(4)
m = ChatterboxTurboTTS.from_pretrained(device="cpu")
ref, out, text = sys.argv[1], sys.argv[2], sys.argv[3]
t = time.time()
wav = m.generate(text, audio_prompt_path=ref)
torchaudio.save(out, wav, m.sr)
print(f"{time.time()-t:.1f}s for {wav.shape[1]/m.sr:.1f}s audio")
