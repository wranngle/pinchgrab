# Third-party notices

PinchGrab itself is MIT-licensed (see [LICENSE](LICENSE)). The repository
additionally vendors the third-party content below, verbatim and unmodified,
under `third_party/`. The build copies it into the extension package
(`extension/skills/`) and the extension inlines it into exported `.tar.zst`
bundles so consuming agents can read the skills straight from an export.
Each source keeps its own upstream license, which travels with the content
in the repo, in the extension package, and inside every export.

Update path: `bun run sync:skills` re-fetches each source at a pinned commit
and rewrites `third_party/<name>/UPSTREAM.lock` (repo, ref, sha, per-file
sha256). The lock diff is the review artifact;
`tests/bundled-skills.test.mjs` fails CI when the vendored tree drifts from
its lock.

## impeccable (reference subset)

- **What:** the 32 reference guides from `.agents/skills/impeccable/reference/`,
  plus upstream `LICENSE` and `NOTICE.md`. The rest of the plugin (agents,
  scripts, orchestration) is intentionally not vendored.
- **Where:** `third_party/impeccable/` → packaged at
  `extension/skills/impeccable/` → exported at
  `.agents/skills/impeccable/` inside bundles.
- **Upstream:** <https://github.com/pbakaus/impeccable> (see
  `third_party/impeccable/UPSTREAM.lock` for the pinned commit).
- **License:** Apache License 2.0. Per §4, the upstream `LICENSE` and
  `NOTICE.md` files accompany the redistributed subset everywhere it ships.
- **Modifications:** none.

## perception-first-design (whole tracked tree)

- **What:** the complete tracked source of the Perception-First Design
  framework — the `pfd` skill (`skills/pfd/SKILL.md`), its references,
  corpus, framework documents, and commands — because the skill cites its
  sibling files by relative path.
- **Where:** `third_party/perception-first-design/` → packaged at
  `extension/skills/perception-first-design/` → exported at
  `perception-first-design/` inside bundles.
- **Upstream:** <https://github.com/skovalik/perception-first-design> (see
  `third_party/perception-first-design/UPSTREAM.lock` for the pinned commit).
- **License:** Creative Commons Attribution-ShareAlike 4.0 International
  (CC BY-SA 4.0). This is verbatim redistribution ("Share") with
  attribution; PinchGrab does not adapt the framework text, so ShareAlike
  does not attach to PinchGrab's own MIT-licensed code. The upstream
  `LICENSE` and `NOTICE` files travel with the tree.
- **Trademark:** "Perception-First Design" and "PFD" are trademarks of
  Stefan Kovalik (U.S. Serial No. 99686343). The names are used here for
  attribution and identification only; no endorsement is implied.
- **Practice exemption:** per the upstream license notice, *applying* the
  framework in your own work is not a derivative of the framework text —
  outputs produced by agents that consult these files are unencumbered.
- **Modifications:** none.
