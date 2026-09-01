# Project Status

- Purpose: Public TegneSpil browser game with a separate, local teacher server for class folders and student save files.
- Run/open: Public demo at `https://augustolrik.github.io/tegnespil`; start the local class portal by double-clicking `Start klasse server.cmd`, then open `http://localhost:8787/online`.
- Current state: The public `main` branch starts with the released Toturial and includes a direct “Spil med klassen” link to the local teacher hostname `PW0FA844`, so it does not depend on a changing IP address. The local class portal also starts with that Toturial, has validated `.dgm` saves, and has read-only, per-class `Baner` and `Figurer` libraries with nested folders. The legacy `Baggrunde` server feature is removed.
- Blockers: None for the public game. A public GitHub Pages site cannot safely write directly to a teacher's local computer; use the local class portal for saves.
- Next useful step: Add images or subfolders to the existing `Klasser/4A`–`4D` `Baner` and `Figurer` folders, then test selection from another computer on the same network.
