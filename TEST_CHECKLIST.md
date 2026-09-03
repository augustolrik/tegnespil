# Testcheckliste for TegneSpil

Brug listen ved en ny udgivelse. Sæt kryds, når hvert punkt er prøvet.

## Før testen

- [ ] Åbn den offentlige side: <https://augustolrik.github.io/tegnespil>.
- [ ] Hav to browsere eller to computere klar til testen af online gemning.
- [ ] Brug en testklasse, et testnavn og en test-PIN. Brug ikke en rigtig elevs PIN.
- [ ] Åbn et inkognito-/privat vindue for at teste den første åbning uden en tidligere kladde.

## Første åbning og spil

- [ ] Åbn spillet i et privat vindue. **Toturial_ny** skal åbne som standard med syv levels.
- [ ] Luk siden og åbn den igen efter at have arbejdet i et level. Den lokale kladde skal fortsætte, hvor den slap.
- [ ] Brug piletasterne til at flytte figuren på gå-felter.
- [ ] Forsøg at gå på et blok-felt. Figuren må ikke flytte sig.
- [ ] Saml en genstand og kontroller, at pointtallet ændrer sig korrekt.
- [ ] Saml en krystal og kontroller, at den vises i statusfeltet.
- [ ] Mød et monster. Monsteret skal flytte efter figuren og spillet skal registrere tab ved kontakt.
- [ ] Placér og brug to portaler. Figuren skal komme ud af den anden portal.
- [ ] Gennemfør et level med det valgte måltal og alle monstre fjernet. Næste level skal åbne automatisk.
- [ ] Klik **Nulstil** under spil. Figur, point, krystaller, monstre og animation skal starte forfra på samme level.
- [ ] Kontroller, at spilstatus viser levelnummer, point, monstre og aktuelt felt.

## Redaktør og levels

- [ ] Skift til **Redaktør** og tilbage til **Spil**. Det redigerede indhold skal blive bevaret.
- [ ] Kontroller, at den eneste måltype er **Point + monster + portaler**.
- [ ] Tilføj et level med **+ level**. Det nye level skal kunne vælges i listen.
- [ ] Skift mellem levels og kontroller, at hvert level beholder sin egen baggrund, figur og rute.
- [ ] Slet det aktive level med **Slet level**, bekræft, og kontroller at det næste eller forrige level åbner.
- [ ] Kontroller, at det sidste tilbageværende level ikke kan slettes.
- [ ] Vælg **Gå**, **Blok** og **Start** og tegn på gitteret. Kontroller resultatet i Spil-tilstand.
- [ ] Vælg **Genstand**, **Krystal**, **Monster** og **Portal**. Placér dem, og kontroller at de virker i Spil-tilstand.
- [ ] Ændr krystalværdi, monstertal og monsterfart. Kontroller at ændringen påvirker spillet.
- [ ] Ændr gitterets rækker og kolonner med **Skaler gitter**. Rute og indhold skal blive flyttet inden for det nye gitter.
- [ ] Slå **Vis gitter** til og fra.
- [ ] Ændr gitterfarve, gitterstyrke, gå-feltfarve og gå-feltstyrke.

## Billeder og musik

- [ ] Vælg **Indlæs baggrund** og vælg et JPG, PNG, WebP eller GIF fra computeren.
- [ ] Vælg **Indlæs figur** og vælg et billede fra computeren.
- [ ] Kontroller, at baggrund og figur kan ses både i Redaktør og Spil.
- [ ] Åbn **Importér billede fra nettet**, indsæt en offentlig HTTPS-billedadresse og brug billedet som baggrund.
- [ ] Gentag webimport som figur, billede til spor og Pro-ramme.
- [ ] Kontroller, at PhotoDrop ikke vises som et valg i importmenuen.
- [ ] Forsøg at importere en ugyldig adresse eller en ikke-billedfil. Spillet skal vise en fejl og beholde det gamle billede.
- [ ] Kontroller, at kun **Indlæs MP3** vises, før en musikfil vælges.
- [ ] Vælg **Indlæs MP3**. Den kompakte musikknap skal åbne med filnavn, Skift MP3, Afspil/Pause, Stop og lydstyrke.

## PRO-editor og animation

- [ ] Skift til **PRO-editor**. Fælles indhold skal kunne foldes ud, og PRO-værktøjerne skal vises.
- [ ] Tilføj en tom ramme og vælg den i listen over rammer.
- [ ] Tilføj en eller flere billedrammer fra computeren.
- [ ] Indstil rammevarighed og kontroller i Spil-tilstand, at billedrammerne skifter.
- [ ] Tegn PRO **Gå**, **Taber** og **Blok** for den aktive ramme.
- [ ] Kopiér gåmønster til en anden ramme og kontroller, at ruten blev kopieret.
- [ ] Slet en ramme. Den sidste ramme må ikke kunne slettes.
- [ ] Spil et PRO-level, nulstil det, og kontroller at spillet bliver i PRO-spillet og animationen starter fra første ramme.
- [ ] Tilføj eller skift level i PRO-editoren. PRO-ruteværktøjerne skal forblive aktive.

## Gem som fil og åbn fil

- [ ] Klik **Gem som fil** og kontrollér, at en `.dgm`-fil hentes.
- [ ] Klik **Åbn**, vælg den hentede fil og kontrollér, at levels, billeder, ruter og indhold kommer tilbage.
- [ ] Klik **Opret nyt spil**, bekræft og kontrollér at et nyt tomt spil oprettes.

## Klassebibliotek på serveren

- [ ] Læg et JPG, PNG, WebP eller GIF i `Klasser/<klasse>/Baner` eller `Klasser/<klasse>/Figurer` på lærermaskinen.
- [ ] Synkronisér klassebillederne med `npm run upload:class-assets` i `cloud-server`.
- [ ] Åbn **Online gemning**, vælg klassen og kontrollér at billedet vises under **Baggrund fra server** eller **Figur fra server**.
- [ ] Vælg billedet og klik **Indlæs baggrund fra server** eller **Indlæs figur fra server**.
- [ ] Kontrollér at det valgte billede virker i spillet efter genindlæsning af siden.

## Online gemning og spilliste

- [ ] Åbn **Online gemning** og vælg klasse.
- [ ] Indtast testnavn og en firecifret test-PIN, og klik **Gem på server**.
- [ ] Kontrollér at testnavnet vises under **Gemte spil på serveren** med en dato.
- [ ] Vælg spillet i listen. Elevfeltet skal udfyldes, og PIN-feltet skal få fokus.
- [ ] Indtast korrekt PIN og klik **Hent spil fra server**. Det rigtige spil skal åbne.
- [ ] Indtast forkert PIN. Spillet må ikke åbne.
- [ ] Åbn samme side på den anden computer, vælg samme klasse og spil, indtast korrekt PIN og kontrollér at spillet åbner.
- [ ] Gem igen på den anden computer, og kontrollér på den første computer efter opdatering af spillister, at datoen er ændret.
- [ ] Kontrollér at et andet spil i listen ikke kan åbnes uden dets korrekte PIN.

## Permanente billeder i skyen

- [ ] Importér et billede fra nettet som baggrund eller figur og gem spillet online.
- [ ] Luk browseren, åbn spillet igen fra serverlisten og kontroller at billedet vises.
- [ ] Åbn samme spil på en anden computer og kontroller igen at billedet vises.
- [ ] Hvis muligt, gør den oprindelige webadresse utilgængelig. Spillet skal stadig vise billedet fra TegneSpils cloud-lager.
- [ ] Kontrollér at billeder i klassebiblioteket også virker fra en anden computer.

## Automatiske kontroller for udviklere

- [ ] Kør `node --check src/app.js`.
- [ ] Kør `node --check tools/teacher_sync_server.mjs`.
- [ ] Kør `node --test cloud-server/test/*.test.js`. Alle tests skal bestå.
- [ ] Kontrollér `git diff --check` før udgivelse.
