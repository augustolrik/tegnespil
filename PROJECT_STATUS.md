# Project Status

- Purpose: Public TegneSpil browser game with a local teacher portal and a staged cloud-save server.
- Run/open: Public demo at `https://augustolrik.github.io/tegnespil`; the old local portal is `Start klasse server.cmd` then `http://localhost:8787/online`. The staged cloud Worker is in `cloud-server/` and is not deployed yet.
- Current state: GitHub Pages is unchanged and still starts with the Toturial. `cloud-server/` contains an isolated Cloudflare Worker + D1 API for 4A–4D, student name/initials plus a 4-digit PIN, strict game validation, CORS allow-list and failed-PIN rate limiting. The online panel remains hidden from the public page until a Cloudflare deployment has been tested.
- Blockers: Node.js and a Cloudflare account are required to create the D1 database, set the rate-limit secret and deploy the Worker. Local teacher-server access remains blocked by the school firewall policy.
- Next useful step: Follow `cloud-server/README.md` to provision and test the Worker, then connect the public page only after tests from a student computer pass.
