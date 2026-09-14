---
name: chatterbox-api-skill
description: "LLM-agnostic productivity and task automation skill that instructs any AI model (Claude, GPT-4o, Gemini, Cursor) to work with Chatterbox TTS API — local endpoint reference. Use when working with chatterbox tts api."
---

# Chatterbox TTS API — local endpoint reference

Chatterbox runs as a FastAPI server on `http://localhost:4123` after
`scripts/bootstrap.sh` completes. The skill's `voiceover.py` wraps the main
endpoint; this doc is for when you need to call it directly or debug.

## Health check
```
GET http://localhost:4123/health
```

## Generate speech (OpenAI-compatible)
```
POST http://localhost:4123/v1/audio/speech
Content-Type: application/json

{
  "input":        "<text to speak>",
  "voice":        "<voice name from library, or path to voice sample>",
  "exaggeration": 0.5,    // 0.2 = flat, 0.9 = theatrical. Default 0.5.
  "cfg_weight":   0.5,    // Classifier-free guidance. 0.5 is neutral.
  "temperature":  0.8,    // Higher = more variation. Keep 0.7–0.9.
  "response_format": "wav" // wav | mp3
}
```

Response: audio bytes (WAV by default).

## Voice library
Voices in `~/{{COMPANY_NAME}}-video-studio/chatterbox-tts-api/voices/` (or under a
`VOICE_LIBRARY_DIR` override). Drop a 10–20s clean WAV in there to register
a new cloned voice. Reference by filename stem.

## {{COMPANY_NAME}} voice presets
| Preset | Exaggeration | CFG | Temperature | Use case |
|---|---|---|---|---|
| {{COMPANY_NAME}}-confident-exec | 0.35 | 0.55 | 0.70 | CEO quotes, thought leadership |
| {{COMPANY_NAME}}-warm-brand | 0.50 | 0.50 | 0.80 | Default brand voice |
| {{COMPANY_NAME}}-upbeat-rep | 0.70 | 0.50 | 0.85 | Social, event promos |
| {{COMPANY_NAME}}-neutral-narrator | 0.40 | 0.55 | 0.75 | Product demos, explainers |

## Long text (> 3000 chars)
Use `POST /v1/audio/speech/long` which returns a job ID; poll `GET /v1/audio/speech/long/{id}`
until status is `completed`, then `GET /v1/audio/speech/long/{id}/download`.

## Docs UI
Swagger UI at http://localhost:4123/docs — useful for troubleshooting.

## Frontend
Chatterbox ships a React frontend at http://localhost:4123/ (when enabled) —
the user can test voices there before committing them to a video.
