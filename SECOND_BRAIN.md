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

## Sådan bygges nye spil og store funktioner

Brug denne arbejdsgang, når et nyt spil, en ny spiltype eller en større funktion skal laves. Små, tydelige rettelser behøver ikke hele processen.

1. **Forstå først.** Læs `AGENTS.md`, denne fil og `PROJECT_STATUS.md`. Undersøg den relevante kode; gæt aldrig på, hvordan et eksisterende system virker.
2. **Plan før kode.** Før større implementering beskrives mål, berørte systemer, dataformat, ejerskab, afhængigheder, risici og målbare acceptkriterier. Hold appen kørende under arbejdet.
3. **Del sikkert op.** Fundamentet kommer før afhængige dele: data/model, rendering og input → gameplay/editor/gemning → UI, animationer og indhold. Hver agent ejer et tydeligt område; kun integratoren ændrer fælles kernefiler.
4. **Byg med testvejen klar.** Hver vigtig del skal kunne afprøves alene, fx `?showcase=movement`, `?showcase=editor` eller `?showcase=save`. Gemning testes altid som: opret → gem → genindlæs → spil videre.
5. **Tre færdiggørelsesporte.** En funktion er først færdig, når alle tre består:
   - *Funktion:* den nye ting virker i rigtig brug.
   - *Regression:* gamle baner, Toturial og eksisterende gemninger virker stadig.
   - *Oplevelse:* den ser forståelig og færdig ud på relevante skærmstørrelser, uden konsolfejl eller tydelige UI-problemer.
6. **Adskil bygger og kritiker.** Byggeren implementerer. En anden agent eller en frisk gennemgang finder konkrete fejl, ufærdige detaljer og svage brugeroplevelser, men retter ikke sine egne fund. Ret derefter de vigtigste fund først.
7. **Bevis resultatet.** Kør automatiske tests, tjek konsollen, prøv den gamle funktionalitet, prøv den nye funktion og inspicér visuelt med skærmbilleder, når det er en visuel eller interaktiv ændring. "Implementeret" er ikke det samme som "færdig".
8. **Bevar viden.** Opdater `PROJECT_STATUS.md` med det verificerede resultat, kendte fejl, test og næste vigtigste opgave. Arbejd videre fra det højeste uløste problem, ikke den mest spændende nye idé.
9. **Git kun gode tilstande.** Commit og push kendte, verificerede milepæle. Læg ikke store eksperimenter oven på en utestet tilstand.

Rutinevalg træffes selv. Spørg kun før arbejde, når tvivlen vil ændre arkitektur, gameplay, pris, sikkerhed, sletning eller brugeroplevelse væsentligt.

## Aktuel status

- GitHub Pages er live og uændret.
- Cloud-server-koden er pushed, men ikke deployet til Cloudflare endnu.
- Deployment skal ske på en computer med Node.js og adgang til ejerens Cloudflare-konto.
- Når Worker-URL'en er testet, skal en separat, bevidst ændring forbinde den offentlige side til API'et.
