# Prompt til den anden computer / LLM

Kopiér hele teksten herunder til LLM'en på computeren med Node.js:

```text
Du skal sætte en allerede bygget Cloudflare test-server op for TegneSpil. Vær meget forsigtig: den eksisterende offentlige hjemmeside https://augustolrik.github.io/tegnespil/ må IKKE ændres, slukkes eller få nye knapper endnu. Vi skal kun udgive og teste en separat API-server først.

Projektet ligger på GitHub: https://github.com/augustolrik/tegnespil.git

Gør dette i rækkefølge:
1. Clone repoet: git clone https://github.com/augustolrik/tegnespil.git
2. Gå til mappen: tegnespil/cloud-server
3. Læs README.md fuldt ud før ændringer.
4. Kør npm install, npm run check og npm test. Stop og forklar hvis en test fejler.
5. Log ind på den ejerens Cloudflare-konto med npx wrangler login. Lad ejeren selv tage over, hvis login beder om kode eller godkendelse.
6. Opret D1-databasen: npx wrangler d1 create tegnespil. Lav derefter en lokal wrangler.toml ved at kopiere wrangler.toml.example og indsætte det returnerede database-id. wrangler.toml må ALDRIG committes eller pushes.
7. Opret skemaet: npx wrangler d1 execute tegnespil --remote --file=schema.sql
8. Sæt RATE_LIMIT_SECRET med npx wrangler secret put RATE_LIMIT_SECRET. Ejeren skal vælge/indsætte en lang tilfældig hemmelighed. Den må aldrig vises i chat, commit eller GitHub.
9. Udgiv kun Worker-API'et med npm run deploy. Gem den præcise workers.dev-URL.
10. Test API'et med /api/health og test at en CORS-request fra https://augustolrik.github.io virker. Test også førstegemning, forkert 4-cifret PIN, korrekt PIN og åbning fra en anden browser/computer.

Vigtige regler:
- Redigér IKKE index.html, src/app.js eller GitHub Pages-indstillinger endnu.
- Push/commit ikke wrangler.toml, Node-moduler, .wrangler-data eller hemmeligheder.
- Elevernes spil bruger klasse + navn/initialer + selvvalgt 4-cifret PIN. PIN lagres kun som hash.
- Første version accepterer ikke billeder eller andre uploads fra elever; den må kun gemme validerede .dgm-spil under 1,8 MB.
- Når alle API-tests virker, rapportér Worker-URL'en og præcis hvad der blev testet. Stop derefter og vent på godkendelse til at forbinde hjemmesiden.
```
