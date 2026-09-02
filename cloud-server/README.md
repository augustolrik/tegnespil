# TegneSpil cloud-server (forberedelse – ikke i drift endnu)

Denne mappe er den nye, separate server til online gemning. Den ændrer **ikke** GitHub Pages-siden og må først forbindes med spillet, når den er testet med den rigtige Cloudflare-konto.

## Hvad den første version gør

- Gemmer og åbner `.dgm`-spil for `4A`–`4D`.
- Elevens navn/initialer sammen med en personlig 4-cifret kode beskytter spillet. Koden gemmes kun som saltet SHA-256-hash.
- Stopper efter fem forkerte PIN-forsøg fra samme klient i ti minutter.
- Accepterer kun valideret JSON-spilindhold op til 1,8 MB. Data-URL'er, SVG og scripts afvises. Elever kan derfor ikke lægge programmer eller vilkårlige filer på lærerens computer.
- Returnerer tomme lister for baner og figurer i første version. Lærer-godkendte billeder kommer senere via separat R2-lagring og lærerlogin.

## Klargøring på Cloudflare (først når læreren er klar)

1. Opret eller log ind på en Cloudflare-konto.
2. Installer Node.js LTS på lærerens computer, hvis den mangler.
3. Åbn en terminal i denne mappe og kør `npm install` og derefter `npx wrangler login`.
4. Kør `npx wrangler d1 create tegnespil` og kopiér det returnerede database-id til en lokal kopi af `wrangler.toml.example` med navnet `wrangler.toml`.
5. Kør `npx wrangler d1 execute tegnespil --remote --file=schema.sql`.
6. Kør `npx wrangler secret put RATE_LIMIT_SECRET`, og vælg en lang tilfældig hemmelighed. Den må aldrig ind i Git eller sendes til elever.
7. Kør `npm run deploy`. Gem Worker-URL'en, men ændr ikke den offentlige GitHub-side endnu.
8. Test `/api/health`, klasseliste, første gemning, forkert PIN, rigtig PIN og spil på en anden computer.

Når alt virker, kobles den offentlige side på med én bevidst ændring af dens API-adresse. Den nuværende side forbliver tilgængelig hele tiden.

## Lokale kontroller

Efter Node.js er installeret: `npm install`, `npm run check`, `npm test`.

Cloudflare D1 har en grænse på 2 MB pr. række; 1,8 MB-grænsen giver plads til databaseformatet. Se [D1 limits](https://developers.cloudflare.com/d1/platform/limits/).
