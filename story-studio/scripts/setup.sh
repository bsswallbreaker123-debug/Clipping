#!/usr/bin/env bash
# One-time setup: JS deps, Python deps, Kokoro voice model (~350 MB).
set -euo pipefail
cd "$(dirname "$0")/.."
npm install
uv sync
mkdir -p models
base=https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0
for f in kokoro-v1.0.onnx voices-v1.0.bin; do
  [ -f "models/$f" ] || curl -fL -o "models/$f" "$base/$f"
done
echo "Ready. Try: uv run pipeline/studio.py build stories/lies-come-true.json --parts 1"
