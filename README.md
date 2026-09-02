# TegneSpil

Spil online på <https://augustolrik.github.io/tegnespil>.

Den offentlige hjemmeside starter med den færdige **Toturial** og lader
eleverne åbne redaktøren og lave deres egne spil direkte i browseren.

## Gem elevspil i lærerens mapper

For at gemme elevspil på lærerens computer bruges den indbyggede lokale
klassesserver. Den gemmer kun `.dgm`-spildata og tager ikke imod filer eller
programmer fra eleverne.

1. Dobbeltklik på **Start klasse server.cmd** i denne mappe. Lad det sorte
   vindue være åbent, mens eleverne spiller. Du kan stadig bruge
   `npm run start:teacher-server` i en terminal, hvis du foretrækker det.
2. Opret én klassemappe pr. klasse, f.eks. `Klasser\4A`. Her kan du lægge
   fælles billedfiler i `Baner` og `Figurer`, også i undermapper som
   `Klasser\4A\Baner\Eventyr`. JPG, PNG, WebP og GIF vises for eleverne.
3. Elever på samme netværk åbner den aktuelle klasseadresse, f.eks.
   `http://172.22.193.4:8787/online`.
   På den offentlige TegneSpil-side kan de i stedet trykke **Spil med
   klassen**, så de ikke skal skrive adressen selv.
4. Eleven vælger klasse, skriver navn eller initialer og kan vælge en bane
   eller figur enten lokalt på sin computer eller fra klassens servermapper.
   Klik derefter **Gem på server**. Spillet ligger i `Klasser\4A\Spil`.

Knappen **Gem som fil** henter altid en fil til elevens Downloads. Den sender
aldrig noget til lærermaskinen.

Klasseserveren starter med den færdige **Toturial**. Et elevspil åbnes kun
fra serveren, når eleven vælger klasse/elev og klikker **Hent spil fra
server**.

Elever har kun læseadgang til `Baner` og `Figurer` gennem serveren. De kan
ikke uploade, overskrive eller slette filer i mapperne fra hjemmesiden.

Brug ikke den lokale klassesserver direkte på internettet. Den offentlige
GitHub-side er selve spillet; klassegemning foregår kun i lærerens lokale
mappe.
