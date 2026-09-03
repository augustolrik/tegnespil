# TegneSpil cloud-server (forberedelse – ikke i drift endnu)

Denne mappe er den nye, separate server til online gemning. Den ændrer **ikke** GitHub Pages-siden og må først forbindes med spillet, når den er testet med den rigtige Cloudflare-konto.

## Hvad den første version gør

- Gemmer og åbner `.dgm`-spil for `4A`–`4D`.
- Elevens navn/initialer sammen med en personlig 4-cifret kode beskytter spillet. Koden gemmes kun som saltet SHA-256-hash.
- Stopper efter fem forkerte PIN-forsøg fra samme klient i ti minutter.
- Accepterer kun valideret JSON-spilindhold op til 1,8 MB. Data-URL'er, SVG og scripts afvises. Elever kan derfor ikke lægge programmer eller vilkårlige filer på lærerens computer.
- Importerer billeder fra PhotoDrop, filvalg og nettet gennem én pipeline: validering, WebP-behandling, R2 og en permanent `assetId`-reference i spillet. Den oprindelige webadresse bruges kun som dokumentation.
- Stopper nye billeduploads, når TegneSpils egne R2-assets når 9,6 GB. Det ligger under Cloudflare R2 Standard free tier på 10 GB-month, og aktuelt forbrug kan læses på `/api/assets/usage`.

## Klargøring på Cloudflare (først når læreren er klar)

1. Opret eller log ind på en Cloudflare-konto.
2. Installer Node.js LTS på lærerens computer, hvis den mangler.
3. Åbn en terminal i denne mappe og kør `npm install` og derefter `npx wrangler login`.
4. Opret et R2-bucket med navnet `tegnespil-assets`. Bind det som `ASSETS` samt Cloudflare Images som `IMAGES`, som vist i `wrangler.toml.example`.
5. Kør `npx wrangler d1 create tegnespil` og kopiér det returnerede database-id til en lokal kopi af `wrangler.toml.example` med navnet `wrangler.toml`.
6. Kør `npx wrangler d1 execute tegnespil --remote --file=schema.sql`. For den eksisterende database skal du også én gang køre `npx wrangler d1 execute tegnespil --remote --file=migrations/0002_assets.sql`.
7. Kør `npx wrangler secret put RATE_LIMIT_SECRET`, og vælg en lang tilfældig hemmelighed. Den må aldrig ind i Git eller sendes til elever.
8. Kør `npm run deploy`. Gem Worker-URL'en, men ændr ikke den offentlige GitHub-side endnu.
9. Kør `npm run upload:class-assets` for at tage eksisterende billeder fra `Klasser/<klasse>/Baner`, `Figurer` og den ældre `Figure`-mappe med til R2. Scriptet registrerer dem i klassens online-bibliotek.
10. Test `/api/health`, klasseliste, upload af JPG/PNG/WebP, webimport, første gemning, forkert PIN, rigtig PIN og spil på en anden computer efter at den oprindelige webadresse er utilgængelig.

Når alt virker, kobles den offentlige side på med én bevidst ændring af dens API-adresse. Den nuværende side forbliver tilgængelig hele tiden.

## Lokale kontroller

Efter Node.js er installeret: `npm install`, `npm run check`, `npm test`.

Cloudflare D1 har en grænse på 2 MB pr. række; 1,8 MB-grænsen giver plads til databaseformatet. Se [D1 limits](https://developers.cloudflare.com/d1/platform/limits/).
