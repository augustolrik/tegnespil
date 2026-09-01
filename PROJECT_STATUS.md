# Project Status

- Purpose: Public TegneSpil browser game with a separate, local teacher server for class folders and student save files.
- Run/open: Public demo at `https://augustolrik.github.io/tegnespil`; local class portal via `npm run start:teacher-server` and `http://localhost:8787/online`.
- Current state: Initial public GitHub Pages source with a safe default demo, online class controls, and validated local `.dgm` save API.
- Blockers: GitHub Pages must be enabled for the `main` branch after the first push. A public GitHub Pages site cannot safely write directly to a teacher's local computer; use the local class portal for saves.
- Next useful step: Create class folders under `Klasser/` and test a student save from another computer on the same network.
