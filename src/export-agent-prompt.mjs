// Send-to-Agent prompt + protocol builders.
//
// Two artifacts, one doctrine:
//   • buildAgentPromptJsonl — the JSONL clipboard payload copied when the
//     user clicks "Send to Agent". Nine dense lines: header, instruction,
//     idempotent bash bootstrap, mandatory full-read file list, bundle
//     tree, orchestration phases, conditional stock-DESIGN warning,
//     recapture verification, done-criteria.
//   • buildAgentProtocolMd — AGENT-PROTOCOL.md inside every bundle: the
//     full expansion of the same doctrine, so a lost clipboard degrades to
//     "extract the archive and read AGENT-PROTOCOL.md".
//
// Hydration conventions (mirrored in the docs):
//   • values baked in at export time come from the options object
//     (workspace, bundleId, archive path, export timestamp, tar entries);
//   • <ANGLE_TOKENS> are left verbatim for the RECEIVING agent to infer
//     (<PROJECT_ROOT>, <APP_URL>, <FEEDBACK_UID>, <runId>, <ARCHIVE_PATH>).
//
// Determinism contract: identical inputs → identical output strings. No
// Date.now()/Math.random() in here — the export clock arrives via opts.
// node-testable (no browser APIs); consumed by sidepanel.ts at export time.

/** Persistence root for a workspace, as the receiving agent sees it. */
export const workspaceRoot = (workspace) => `~/.pinchgrab/workspaces/${workspace}`;

/** Extraction dir for a bundle inside the persistence root. */
export const extractDir = (workspace, bundleId) =>
  `${workspaceRoot(workspace)}/bundles/${bundleId}/extracted`;

/**
 * Idempotent bash bootstrap. `archivePath` is the hydrated absolute path of
 * the .tar.zst on the operator's machine; pass the literal token
 * '<ARCHIVE_PATH>' to emit the tokenized copy shipped in AGENT-PROTOCOL.md.
 */
export const buildBootstrapScript = ({workspace, bundleId, archivePath, exportTs}) => [
  '#!/usr/bin/env bash',
  '# PinchGrab bootstrap — idempotent; safe to re-run.',
  'set -euo pipefail',
  `WS='${workspace}'`,
  `BID='${bundleId}'`,
  `SRC='${archivePath}'`,
  '# The clipboard may carry the ~/Downloads form; expand a leading ~.',
  'SRC="${SRC/#\\~/$HOME}"',
  'ROOT="$HOME/.pinchgrab/workspaces/$WS"',
  'DEST="$ROOT/bundles/$BID"',
  'if [ -f "$DEST/.extracted" ] && [ "$(cat "$DEST/.extracted")" = "$BID" ]; then',
  '  echo "already-extracted $DEST/extracted"',
  'else',
  '  mkdir -p "$DEST/extracted" "$ROOT/plans/$BID" "$ROOT/audits/$BID" "$ROOT/recaptures"',
  '  if tar --zstd -xf "$SRC" -C "$DEST/extracted" 2>/dev/null; then :; else',
  '    zstd -dc "$SRC" | tar -x -C "$DEST/extracted"',
  '  fi',
  '  cp -f "$SRC" "$DEST/bundle.tar.zst"',
  '  printf \'%s\' "$BID" > "$DEST/.extracted"',
  '  echo "extracted $DEST/extracted"',
  'fi',
  `[ -f "$ROOT/work-manifest.jsonl" ] || printf '%s\\n' '{"v":1,"type":"work-manifest-header","tool":"pinchgrab","workspace":"${workspace}","created":"${exportTs}"}' > "$ROOT/work-manifest.jsonl"`,
  'echo "workdir $ROOT"',
].join('\n');

/**
 * Render the bundle's tar entry names as an indented tree. Directories with
 * more than `collapseAt` files collapse to one `dir/ (N files)` line so the
 * clipboard stays dense; output is capped at `maxLines` with a `… +N more`
 * tail. Deterministic: entries are sorted.
 */
export const renderBundleTree = (entryNames, {collapseAt = 8, maxLines = 120} = {}) => {
  // Build a nested {dirs: Map, files: []} structure.
  const rootNode = {dirs: new Map(), files: []};
  for (const name of [...entryNames].sort()) {
    const parts = name.split('/');
    let node = rootNode;
    for (const dir of parts.slice(0, -1)) {
      if (!node.dirs.has(dir)) node.dirs.set(dir, {dirs: new Map(), files: []});
      node = node.dirs.get(dir);
    }
    node.files.push(parts[parts.length - 1]);
  }
  const countFiles = (node) => node.files.length + [...node.dirs.values()].reduce((a, d) => a + countFiles(d), 0);
  const lines = [];
  const emit = (node, depth) => {
    const pad = '  '.repeat(depth);
    for (const [dir, child] of [...node.dirs.entries()].sort(([a], [b]) => (a < b ? -1 : 1))) {
      const total = countFiles(child);
      if (total > collapseAt) {
        lines.push(`${pad}${dir}/ (${total} files)`);
      } else {
        lines.push(`${pad}${dir}/`);
        emit(child, depth + 1);
      }
    }
    for (const f of node.files) lines.push(`${pad}${f}`);
  };
  emit(rootNode, 0);
  if (lines.length > maxLines) {
    const dropped = lines.length - maxLines;
    return [...lines.slice(0, maxLines), `… +${dropped} more`].join('\n');
  }
  return lines.join('\n');
};

// Bundle files whose presence gates a mandatory-read path / prompt line.
const PINCHGRAB_SKILL_PATH = '.agents/skills/PinchGrab/SKILL.md';
const PFD_SKILL_PATH = 'perception-first-design/skills/pfd/SKILL.md';
const SKILLS_INDEX_PATH = 'skills-index.json';

const orchestrationText = ({workspace, bundleId, jsonlName}) =>
  `PHASE map: for EVERY comment row in ${jsonlName}, decide which bundled skills apply and append one comment row to ~/.pinchgrab/workspaces/${workspace}/work-manifest.jsonl carrying a mapped_skills field whose entries are locators — paths relative to the extraction root (e.g. .agents/skills/impeccable/reference/<file>.md, ${PFD_SKILL_PATH}, ${PINCHGRAB_SKILL_PATH}; the full index is ${SKILLS_INDEX_PATH}). The export pre-seeds heuristic suggestedSkills on each feedback row; verify and correct them, do not trust them blindly. ` +
  `PHASE plan: fan out one background atomic subagent per comment; pass each subagent a standalone JSONL subinstruction (template in AGENT-PROTOCOL.md) containing the full comment row, its parent selector row, the bundle manifest line, and the FULL TEXT of every mapped skill prompt; each subagent uses your /plan (planning) capability for its phase and returns a plan, saved to plans/${bundleId}/<FEEDBACK_UID>.plan.md; each subagent also polishes its plan with /perception-first-design:all. ` +
  `PHASE implement: YOU — the foreground agent the operator pasted this prompt into — do all implementation, test development, testing, and iteration in <PROJECT_ROOT>; subagents only plan. Polish the implemented result with /perception-first-design:all. ` +
  `PHASE audit: send the combined plans + implementation for a blind atomic 'roast' peer review of BOTH plan and implementation, using whatever other-agent peer-review skills exist in YOUR OWN environment; write it to audits/${bundleId}/<runId>-roast.md and address every blocker. ` +
  `PHASE verify: see the 'verify' line. ` +
  `DEGRADATION RULE: if you cannot spawn subagents, or lack a /plan, /perception-first-design, or roast capability, perform the same phases yourself SERIALLY in this exact order — never skip a phase. ` +
  `SKILLS RULE: the bundled skills are for this job only — read them from the extraction directory; there is NO need to install them permanently, and you must NOT overwrite your own persistent skills, agent config, or dotfiles.`;

const verifyText = ({workspace, xDir, jsonlName}) =>
  `Final verification pass, only after implementation and audit: start the product locally, then run: npx -y pinchgrab recapture ${xDir}/${jsonlName} <APP_URL> --workspace-dir ~/.pinchgrab/workspaces/${workspace} (use bunx if npx is unavailable). This re-locates every commented selector with PinchGrab's own CSS->XPath->a11y chain, screenshots each element, and writes an append-only run under recaptures/<runId>/. Read each recaptured PNG next to its original in ${xDir}/screenshots/ and confirm every comment is visibly resolved; then update the matching work-manifest.jsonl rows to status done, or blocked with a reason.`;

const doneText = ({bundleId}) =>
  `You are finished when every comment has a work-manifest.jsonl row with status done or blocked, plans/${bundleId}/ holds one plan per comment, audits/${bundleId}/ holds at least one roast, and the latest recapture run locates every commented selector. work-manifest.jsonl is append-only: add rows, never rewrite history.`;

const warningText =
  'The bundled DESIGN.md is PinchGrab\'s bare stock template — the operator did not customize it. Do NOT treat it as product canon. Prefer a more applicable canonical design source if one exists for this product (search <PROJECT_ROOT> for DESIGN.md, docs/design*, brand/ or style-guide files) and use the bundled template only as a generic checklist.';

/**
 * The nine-line Send-to-Agent clipboard payload.
 *
 * @param {object} opts
 * @param {string} opts.workspace
 * @param {string} opts.bundleId       16-hex content hash
 * @param {string} opts.archivePath    absolute path of the saved .tar.zst
 * @param {string} opts.exportTs       ISO timestamp (the export clock)
 * @param {string} opts.jsonlName      the bundle's JSONL entry name
 * @param {{comments: number, selectors: number, pages: number, screenshots: number}} opts.counts
 * @param {string[]} opts.entryNames   every tar entry name in the bundle
 * @param {boolean} opts.designIsTemplate
 * @returns {string} newline-joined JSONL (no trailing newline)
 */
export const buildAgentPromptJsonl = (opts) => {
  const {workspace, bundleId, archivePath, exportTs, jsonlName, counts, entryNames, designIsTemplate} = opts;
  const xDir = extractDir(workspace, bundleId);
  const has = (name) => entryNames.includes(name);
  const lines = [];

  lines.push({
    v: 1, type: 'pinchgrab-send-to-agent', tool: 'pinchgrab',
    workspace, bundleId, archive: archivePath, generated: exportTs,
    counts: {comments: counts.comments, selectors: counts.selectors, pages: counts.pages, screenshots: counts.screenshots},
    designIsStockTemplate: designIsTemplate,
  });

  lines.push({
    type: 'instruction',
    text: `You have been handed a PinchGrab feedback bundle: ${counts.comments} operator comments pinned to live UI elements of the product built from <PROJECT_ROOT> (infer <PROJECT_ROOT> from your current working directory; if ambiguous, ask before editing). Do this now, in order: (1) execute the bash script in the next 'bootstrap' line exactly as written (its 'script' field is a JSON-escaped plain bash script; if the archive path is a Windows path and you run inside WSL, translate C:\\ to /mnt/c/ first); (2) read EVERY file listed in the 'files' line fully into context; (3) follow AGENT-PROTOCOL.md to map, plan, implement, test, audit, and verify a fix for every comment.`,
  });

  lines.push({
    type: 'bootstrap', lang: 'bash', idempotent: true,
    script: buildBootstrapScript({workspace, bundleId, archivePath, exportTs}),
  });

  const paths = [
    `@${xDir}/AGENT-PROTOCOL.md`,
    `@${xDir}/README.md`,
    `@${xDir}/repair-index.md`,
    `@${xDir}/${jsonlName}`,
  ];
  if (has('DESIGN.md')) paths.push(`@${xDir}/DESIGN.md`);
  if (has(PINCHGRAB_SKILL_PATH)) paths.push(`@${xDir}/${PINCHGRAB_SKILL_PATH}`);
  if (has(PFD_SKILL_PATH)) paths.push(`@${xDir}/${PFD_SKILL_PATH}`);
  lines.push({
    type: 'files', readFully: true, noGrep: true,
    rule: 'Read each path below END-TO-END with your file-reading tool. This is NON-OPTIONAL. Do NOT grep them, do NOT head/tail them, do NOT sample line ranges — full contents into context. Screenshots and the impeccable reference files are read per-comment later, as AGENT-PROTOCOL.md directs.',
    paths,
  });

  lines.push({
    type: 'tree', root: xDir, entries: entryNames.length,
    text: renderBundleTree(entryNames),
  });

  lines.push({
    type: 'orchestration',
    phases: ['map', 'plan', 'implement', 'audit', 'verify'],
    text: orchestrationText({workspace, bundleId, jsonlName}),
  });

  if (designIsTemplate) {
    lines.push({type: 'warning', code: 'DESIGN_MD_IS_STOCK_TEMPLATE', text: warningText});
  }

  lines.push({type: 'verify', text: verifyText({workspace, xDir, jsonlName})});
  lines.push({type: 'done', text: doneText({bundleId})});

  return lines.map((l) => JSON.stringify(l)).join('\n');
};

/**
 * AGENT-PROTOCOL.md — the in-bundle expansion of the clipboard doctrine.
 * skillsIndex is the parsed skills-index.json (or null when skills weren't
 * bundled); used to hydrate the skill inventory table.
 */
export const buildAgentProtocolMd = (opts) => {
  const {workspace, bundleId, exportTs, jsonlName, counts, entryNames, designIsTemplate, skillsIndex} = opts;
  const xDir = extractDir(workspace, bundleId);
  const root = workspaceRoot(workspace);
  const has = (name) => entryNames.includes(name);
  const out = [];

  out.push('# AGENT-PROTOCOL.md');
  out.push('');
  out.push(`Workspace: \`${workspace}\` · Bundle: \`${bundleId}\` · Generated: ${exportTs}`);
  out.push(`Counts: **${counts.comments}** comments · **${counts.selectors}** selectors · **${counts.pages}** pages · **${counts.screenshots}** screenshots`);
  out.push('');
  out.push('This file is the full working doctrine for the coding agent handed this');
  out.push('bundle. The operator\'s clipboard prompt (JSONL) is a compact bootstrap of');
  out.push('the same content — if you only have this archive, everything you need is');
  out.push('here. Tokens in `<ANGLE_BRACKETS>` are yours to infer: `<PROJECT_ROOT>` is');
  out.push('the product\'s repository (usually your working directory), `<APP_URL>` is');
  out.push('the locally running product, `<FEEDBACK_UID>`/`<runId>` are per-item ids.');
  out.push('');
  out.push('## 0 · Bootstrap (idempotent)');
  out.push('');
  out.push('If `' + xDir + '` does not exist yet, run the script below with');
  out.push('`<ARCHIVE_PATH>` replaced by the absolute path of this bundle\'s `.tar.zst`');
  out.push('(when you are reading this from the extracted archive, that step already');
  out.push('happened — re-running is a safe no-op).');
  out.push('');
  out.push('```bash');
  out.push(buildBootstrapScript({workspace, bundleId, archivePath: '<ARCHIVE_PATH>', exportTs}));
  out.push('```');
  out.push('');
  out.push('## 1 · Persistent workspace layout');
  out.push('');
  out.push('All PinchGrab work state lives under the persistence root — keep your');
  out.push('planning artifacts there and keep the work manifest updated:');
  out.push('');
  out.push('```');
  out.push(`${root}/`);
  out.push('  work-manifest.jsonl              # append-only agent state ledger');
  out.push('  bundles/');
  out.push(`    ${bundleId}/`);
  out.push('      bundle.tar.zst               # copy of the original archive');
  out.push('      .extracted                   # guard marker (contains the bundleId)');
  out.push('      extracted/                   # tar output — treat as IMMUTABLE input');
  out.push('  plans/');
  out.push(`    ${bundleId}/<FEEDBACK_UID>.plan.md`);
  out.push('  audits/');
  out.push(`    ${bundleId}/<runId>-roast.md`);
  out.push('  recaptures/');
  out.push('    <runId>/                       # append-only; never reuse a runId');
  out.push('      recapture-manifest.jsonl');
  out.push('      screenshots/<uid>.png');
  out.push('```');
  out.push('');
  out.push('`work-manifest.jsonl` rows (append-only; reducers group by');
  out.push('`(bundleId, feedbackUid)` and the LAST row wins — accrete, never rewrite):');
  out.push('');
  out.push('```jsonc');
  out.push('// written once by the bootstrap');
  out.push(`{"v":1,"type":"work-manifest-header","tool":"pinchgrab","workspace":"${workspace}","created":"${exportTs}"}`);
  out.push('// one per comment, appended each time its state advances');
  out.push(`{"v":1,"type":"comment","bundleId":"${bundleId}","feedbackUid":"<FEEDBACK_UID>","parentUid":"<selector uid>","selector":"<css>","mapped_skills":[{"skill":"<id from skills-index.json>","locator":"<path relative to extraction root>"}],"status":"mapped|planned|in-progress|done|blocked","plan":"plans/${bundleId}/<FEEDBACK_UID>.plan.md","notes":"<short>","ts":"<ISO>"}`);
  out.push('// appended by `pinchgrab recapture` runs');
  out.push(`{"v":1,"type":"recapture-run","runId":"<runId>","ts":"<ISO>","bundleId":"${bundleId}","located":0,"total":0}`);
  out.push('```');
  out.push('');
  out.push('## 2 · Read order (non-optional, full reads, no grep)');
  out.push('');
  out.push('Read each of these END-TO-END before any other action. Do not grep, head,');
  out.push('tail, or sample line ranges — full contents into context:');
  out.push('');
  out.push(`1. \`${xDir}/AGENT-PROTOCOL.md\` (this file)`);
  out.push(`2. \`${xDir}/README.md\``);
  out.push(`3. \`${xDir}/repair-index.md\``);
  out.push(`4. \`${xDir}/${jsonlName}\``);
  if (has('DESIGN.md')) out.push(`5. \`${xDir}/DESIGN.md\``);
  if (has(PINCHGRAB_SKILL_PATH)) out.push(`6. \`${xDir}/${PINCHGRAB_SKILL_PATH}\``);
  if (has(PFD_SKILL_PATH)) out.push(`7. \`${xDir}/${PFD_SKILL_PATH}\``);
  out.push('');
  out.push('Screenshots (`screenshots/`, indexed by `screenshots.json`) and the');
  out.push('impeccable reference files are read per-comment during the phases below.');
  out.push('');
  if (designIsTemplate) {
    out.push('> **WARNING — DESIGN_MD_IS_STOCK_TEMPLATE.** ' + warningText);
    out.push('');
  }
  out.push('## 3 · Bundled skills');
  out.push('');
  out.push('The bundled skills are for this job only: read them from the extraction');
  out.push('directory. There is NO need to install them permanently, and you must');
  out.push('NOT overwrite your own persistent skills, agent config, or dotfiles.');
  out.push('');
  if (skillsIndex && Array.isArray(skillsIndex.skills) && skillsIndex.skills.length) {
    // Table-cell sanitizer for semi-trusted index strings (purposes come
    // from vendored upstream frontmatter): escape the escape character
    // FIRST, then the cell delimiter, and flatten newlines — otherwise a
    // crafted purpose could break out of its cell and inject rows into a
    // document agents treat as doctrine (CodeQL js/incomplete-sanitization).
    const cell = (v) => String(v ?? '').replace(/\\/g, '\\\\').replace(/\|/g, '\\|').replace(/\r?\n/g, ' ');
    out.push('| id | locator (relative to extraction root) | purpose |');
    out.push('| --- | --- | --- |');
    for (const s of skillsIndex.skills) {
      const invoke = s.invoke ? ` Invoke: \`${cell(s.invoke)}\`.` : '';
      out.push(`| \`${cell(s.id)}\` | \`${cell(s.path)}\` | ${cell(s.purpose)}${invoke} |`);
    }
    out.push('');
    out.push('Provenance (upstream repo + pinned commit + license) for every vendored');
    out.push(`skill is recorded in \`${SKILLS_INDEX_PATH}\` at the archive root.`);
  } else {
    out.push('_This bundle was exported without the vendored skill set (the operator');
    out.push('disabled "Bundle design skills"). Map comments against whatever design');
    out.push('skills exist in YOUR OWN environment instead, and note that in the');
    out.push('work manifest._');
  }
  out.push('');
  out.push('## 4 · Phases');
  out.push('');
  out.push('Run the five phases in order. **Degradation rule:** if you cannot spawn');
  out.push('subagents, or lack a `/plan`, `/perception-first-design`, or roast');
  out.push('capability, perform the same phases yourself SERIALLY in this exact order');
  out.push('— never skip a phase.');
  out.push('');
  out.push('### map');
  out.push('');
  out.push(`For EVERY comment row in \`${jsonlName}\`, decide which bundled skills apply`);
  out.push('and append one `comment` row to `work-manifest.jsonl` carrying a');
  out.push('`mapped_skills` field whose entries are locators (see §3). The export');
  out.push('pre-seeds heuristic `suggestedSkills` on each feedback row; verify and');
  out.push('correct them, do not trust them blindly.');
  out.push('');
  out.push('### plan');
  out.push('');
  out.push('Fan out ONE background atomic subagent per comment. Pass each subagent a');
  out.push('standalone JSONL subinstruction containing the full comment row, its');
  out.push('parent selector row, the bundle manifest line, and the FULL TEXT of every');
  out.push('mapped skill prompt. Each subagent uses your `/plan` (planning) capability');
  out.push(`for its phase, polishes its plan with \`/perception-first-design:all\`, and`);
  out.push(`returns a plan you save to \`plans/${bundleId}/<FEEDBACK_UID>.plan.md\`.`);
  out.push('');
  out.push('Subagent subinstruction template (one JSONL document per subagent; hydrate');
  out.push('every `<...>` before dispatch):');
  out.push('');
  out.push('```jsonc');
  out.push(`{"v":1,"type":"pinchgrab-subagent-plan","bundleId":"${bundleId}","feedbackUid":"<FEEDBACK_UID>"}`);
  out.push('{"type":"instruction","text":"You are a planning subagent for ONE user complaint about a live UI element. Use your /plan capability. Produce an implementation plan ONLY — do not edit files. Deliver: root-cause hypothesis, exact files/selectors to change in <PROJECT_ROOT>, step-by-step edits, test plan, and how the fix will be visually verified against the original screenshot. Polish the plan with /perception-first-design:all before returning it."}');
  out.push('{"type":"comment","row":<full feedback row from the bundle JSONL>}');
  out.push('{"type":"target","row":<full parent selector row from the bundle JSONL>}');
  out.push('{"type":"manifest","row":<the bundle manifest line>}');
  out.push(`{"type":"screenshot","path":"${xDir}/screenshots/<file>.png"}`);
  out.push('{"type":"skill","id":"<mapped skill id>","text":"<FULL TEXT of the mapped skill file>"}');
  out.push('```');
  out.push('');
  out.push('### implement');
  out.push('');
  out.push('YOU — the foreground agent the operator pasted the prompt into — do all');
  out.push('implementation, test development, testing, and iteration in');
  out.push('`<PROJECT_ROOT>`. Subagents only plan. Work one comment at a time, update');
  out.push('its work-manifest row to `in-progress` then `done`/`blocked`, and polish');
  out.push('the implemented result with `/perception-first-design:all`.');
  out.push('');
  out.push('### audit');
  out.push('');
  out.push('Send the combined plans + implementation for a blind atomic \'roast\' peer');
  out.push('review of BOTH plan and implementation, using whatever other-agent');
  out.push(`peer-review skills exist in YOUR OWN environment. Write it to`);
  out.push(`\`audits/${bundleId}/<runId>-roast.md\` and address every blocker it raises.`);
  out.push('');
  out.push('### verify');
  out.push('');
  out.push('Only after implementation and audit: start the product locally, then run');
  out.push('');
  out.push('```bash');
  out.push(`npx -y pinchgrab recapture ${xDir}/${jsonlName} <APP_URL> --workspace-dir ${root}`);
  out.push('# bunx works too; add --auth-state <storageState.json> for logged-in pages');
  out.push('```');
  out.push('');
  out.push('This re-locates every commented selector with PinchGrab\'s own');
  out.push('CSS→XPath→a11y chain, screenshots each element, and writes an append-only');
  out.push(`run under \`recaptures/<runId>/\` (plus a \`recapture-run\` ledger row). It`);
  out.push('exits 0 only when every commented selector still resolves. Read each');
  out.push(`recaptured PNG next to its original in \`${xDir}/screenshots/\` and confirm`);
  out.push('every comment is visibly resolved; then update the matching');
  out.push('work-manifest rows to `done`, or `blocked` with a reason.');
  out.push('');
  out.push('## 5 · Done criteria');
  out.push('');
  out.push(doneText({bundleId}));
  out.push('');
  return out.join('\n');
};
