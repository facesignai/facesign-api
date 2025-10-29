# Environment setup for docs/scripts

Create a file named `.env.local` in `facesign-api/docs` with:

```
FACESIGN_DEV_API_URL=https://api.dev.facesign.ai
FACESIGN_DEV_API_KEY=REPLACE_WITH_YOUR_DEV_KEY
```

Notes:
- `.env.local` is ignored by git (see `.gitignore`).
- Runners (e.g., `run-*.mjs`) and scripts under `scripts/` will read these values.
- Do not commit real keys. Use this file only for local runs.
