# TegneSpil

Spil online på <https://augustolrik.github.io/tegnespil>.

Den offentlige hjemmeside starter med den færdige **Toturial** og lader
eleverne åbne redaktøren og lave deres egne spil direkte i browseren.

## Gem elevspil i lærerens mapper

For at gemme elevspil på lærerens computer bruges den indbyggede lokale
klassesserver. Den gemmer kun `.dgm`-spildata og tager ikke imod filer eller
programmer fra eleverne.

1. Åbn en terminal i denne mappe og kør `npm run start:teacher-server`.
2. Opret f.eks. `Klasser\4A\Baggrunde`. Læg JPG, PNG eller WebP-baggrunde
   heri.
3. Elever på samme netværk åbner `http://<lærerens-ip>:8787/online`.
4. Eleven vælger klasse, skriver navn eller initialer, vælger baggrund og
   klikker **Gem online**. Spillet ligger derefter i `Klasser\4A\Spil`.

Brug ikke den lokale klassesserver direkte på internettet. Den offentlige
GitHub-side er selve spillet; klassegemning foregår kun i lærerens lokale
mappe.
