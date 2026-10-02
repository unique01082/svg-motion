# Minions test environment

Configure **Products → product → Test environment**:

| Setting                         | Value                                                                           |
| ------------------------------- | ------------------------------------------------------------------------------- |
| Repository                      | `unique01082/svg-motion`                                                        |
| Compose file                    | `svg-motion/.minions/compose.yml` (repository-relative: `.minions/compose.yml`) |
| Preview service                 | `web`                                                                           |
| Port                            | `80`                                                                            |
| Page                            | `/`                                                                             |
| Automatic                       | On                                                                              |
| Environment variables / secrets | None                                                                            |
| Test login                      | None; public docs and playground                                                |

The existing Dockerfile builds the docs application and serves it with nginx.
Bundled SVG specimens supply example data. No API, database, storage, migrations,
or seed job is needed. All bundled assets load from the preview origin.
The docs application intentionally uses the published `@baolq/svg-motion@0.1.0`;
this preview does not exercise edits to the root library source. Run
`pnpm docs:candidate:verify` for library candidate validation.

## Verification (2026-10-02)

- `docker compose -f .minions/compose.yml config --quiet` passed.
- Built and started with `docker compose -p svg-motion-minions-prep -f .minions/compose.yml up -d --build --wait`; web became healthy.
- A separate container on the Compose network fetched `http://web:80/` and `/healthz` successfully.
- Removed the stack with `down -v`, started again with `up -d --wait`, and confirmed healthy status.
- Playwright opened `/`, `/playground`, and `/docs/0.1/getting-started` against the built image via a temporary localhost port. No failed requests, HTTP errors, or page exceptions were detected. The playground screenshot was visually inspected and showed the bundled specimen list and SVG preview.
- Compose uses only a repository-local build context, an exposed container port, and a healthcheck; no prohibited host access or external networks.

Minions runtime commands were not available in this developer session. After the
PR is merged into the configured product base branch, press **Check** in the
Test environment page to validate with Minions itself.
