# TegneSpil – Second Brain

Dette er den delte projekt-hukommelse for agenter, der arbejder fra GitHub-klonen.

## Formål

TegneSpil er et offentligt browser-spil for elever. Den offentlige side er:

`https://augustolrik.github.io/tegnespil/`

Elever skal senere kunne gemme deres egne spil online fra skiftende skolecomputere. De bruger klasse, navn/initialer og en selvvalgt 4-cifret kode.

## Vigtige regler

- Den nuværende GitHub Pages-side skal altid blive online, mens ny serverfunktion bygges og testes.
- Slå ikke online-funktionen til på den offentlige side, før Cloudflare-API'et er udgivet og testet fra en elevcomputer.
- Commit/push aldrig `wrangler.toml`, `.wrangler/`, `node_modules/` eller hemmeligheder.
- `Klasser/` er lærer-/elevdata og må aldrig committes.
- Bevar eksisterende, urelaterede lokale ændringer.

## Cloud-server

Den staged server ligger i `cloud-server/`.

- Teknologi: Cloudflare Worker + D1.
- API: klasser, PIN-beskyttet hent/gem af `.dgm`-spil og tomme materialelister i første fase.
- Sikkerhed: CORS allow-list, saltet PIN-hash, rate limit for forkerte koder og validering af JSON-spilformatet.
- Størrelse: højst 1,8 MB pr. gemt spil; elev-uploadede billeder/data-URL'er accepteres ikke i første fase.
- Opsætning: læs `cloud-server/README.md` og den fulde overdragelse i `cloud-server/OTHER_COMPUTER_PROMPT.md`.

## Aktuel status

- GitHub Pages er live og uændret.
- Cloud-server-koden er pushed, men ikke deployet til Cloudflare endnu.
- Deployment skal ske på en computer med Node.js og adgang til ejerens Cloudflare-konto.
- Når Worker-URL'en er testet, skal en separat, bevidst ændring forbinde den offentlige side til API'et.
