# Project Status

- Purpose: Public TegneSpil browser game with a separate, local teacher server for class folders and student save files.
- Run/open: Public demo at `https://augustolrik.github.io/tegnespil`; start the local class portal by double-clicking `Start klasse server.cmd`, then open `http://localhost:8787/online`.
- Current state: The public `main` branch starts with the released Toturial. The local class portal has validated `.dgm` saves plus read-only, per-class `Baner` and `Figurer` libraries with nested folders.
- Blockers: None for the public game. A public GitHub Pages site cannot safely write directly to a teacher's local computer; use the local class portal for saves.
- Next useful step: Create `Klasser/<klasse>/Baner` and `Klasser/<klasse>/Figurer` folders, add a few image files, and test selection from another computer on the same network.
