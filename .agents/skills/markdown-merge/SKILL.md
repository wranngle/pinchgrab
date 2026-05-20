---
name: markdown-merge
description: >-
  Use when consolidating, deduplicating, or relocating Markdown documentation while preserving source
  meaning through literal cut-and-paste before contextual refinement.
---

# Markdown Merge Skill

This skill provides a rigorous, line-by-line framework for consolidating and cleaning up markdown files, specifically targeting the reduction of sprawl and the consolidation of rules into canonical sources of truth.

## The Spirit of the Merge

When consolidating documentation, there is a high risk of semantic loss if the AI attempts to summarize, paraphrase, or "rewrite" rules across multiple files simultaneously. To combat this, the `markdown-merge` process relies on a **Literal Cut-and-Paste** methodology followed by a **Contextual Refinement** phase.

## Destination Hierarchy

Every line or concept must have a home in exactly one canonical file. Use this hierarchy to decide where a line belongs:
- **Domain-Specific Guidelines:** Move to the most relevant, singular skill file (`~/.dotfiles/.agents/skills/<skill-name>/SKILL.md`).
- **Universal LLM/Agent Rules:** Move to `~/.dotfiles/.agents/AGENTS.md`.
- **Universal Human Rules:** Move to `README.md` (or `CONTRIBUTING.md`).
- **Frontend / UI Rules:** Move to `~/.dotfiles/DESIGN.md` (or `.agents/DESIGN.md` as appropriate).
- **Public-Facing Boilerplate:** Move to standard conventional `CAPITAL.md` files (e.g., `CODE_OF_CONDUCT.md`, `SECURITY.md`).

## The Merge Process

Execute the merge strictly using the following sequential phases:

### Phase 1: Line-by-Line Semantic Mapping
1. Read the source `.md` files line-by-line.
2. For each line or coherent concept block, decide the target canonical destination file based on the hierarchy above.
3. Identify the most coherent neighboring concept / insertion point within the chosen destination file.

### Phase 2: Literal Cut-and-Paste
1. Programmatically (or using exact literal string replacement) cut the exact line/block from the source file.
2. Paste the exact line/block into the chosen destination file.
3. **CRITICAL:** Do *not* summarize, paraphrase, or rewrite during this phase. Accept that this may introduce temporary duplicates or contradictions. Semantic preservation is paramount here.

### Phase 3: Decommissioning
1. Once every meaningful line has been cut away from a source file, delete the source file.
2. If only irrelevant or outdated ephemeral content remains, delete the file.

### Phase 4: Contextual Refinement
1. After all cuts and pastes are complete, re-read the destination file in its entirety.
2. Refine and correct the wording of the newly pasted lines in the context of their new neighbors.
3. Resolve the temporary duplicates or contradictions introduced in Phase 2. Ensure the final wording aligns with the higher-level spiritual concept and goal of the project.
