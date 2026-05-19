// Cross-browser replay matrix.
//
// Drives a capture JSONL through N Playwright browser engines
// (chromium / firefox / webkit) and reports per-engine pass/fail.
// The browser runner is injected so tests can substitute a deterministic
// mock; production wires it to a real `playwright` import.
//
// Programmatic API:
//   runMatrix(entries, { browsers, runner, url }) -> {
//     browsers: [{ name, attempted, found, total, durationMs, error }],
//     summary: { passed: number, failed: number, total: number },
//   }
//   renderReport(matrix) -> string  (markdown table; one row per browser)
//   playwrightRunner()   -> runner usable with the real playwright module
//
// The runner contract:
//   await runner.launch(browserName) -> { newPage(): Page, close(): void }
//   Each Page must implement: goto(url), locate(selector) -> { count() }.
//
// The replay loop walks each entry's CSS selector (the round-1 #2 chain
// is intentionally simplified here: this matrix exercises the engine
// dimension, not the selector-fallback dimension — those compose).

const DEFAULT_BROWSERS = ["chromium", "firefox", "webkit"];

const replayOnPage = async (page, entries) => {
  let found = 0;
  for (const entry of entries) {
    const selector = entry?.selectors?.css;
    if (!selector) continue;
    try {
      const locator = await page.locate(selector);
      const count = await locator.count();
      if (count >= 1) found += 1;
    } catch {
      // Selector resolution failure counts as miss for this engine.
    }
  }
  return found;
};

export const runMatrix = async (entries, options = {}) => {
  const browsers = options.browsers ?? DEFAULT_BROWSERS;
  const runner = options.runner;
  const url = options.url ?? "about:blank";
  if (!runner || typeof runner.launch !== "function") {
    throw new Error("runMatrix: options.runner with launch(name) is required");
  }

  const total = entries.length;
  const rows = [];
  for (const name of browsers) {
    const startedAt = Date.now();
    let row = {
      name,
      attempted: true,
      found: 0,
      total,
      durationMs: 0,
      error: null,
    };
    let browser = null;
    try {
      browser = await runner.launch(name);
      const page = await browser.newPage();
      await page.goto(url);
      row.found = await replayOnPage(page, entries);
    } catch (err) {
      row.error = err?.message ?? String(err);
    } finally {
      if (browser && typeof browser.close === "function") {
        try {
          await browser.close();
        } catch {
          // Swallow close errors — the engine result is already recorded.
        }
      }
      row.durationMs = Date.now() - startedAt;
    }
    rows.push(row);
  }

  const passed = rows.filter((r) => !r.error && r.found === r.total).length;
  return {
    browsers: rows,
    summary: { passed, failed: rows.length - passed, total: rows.length },
  };
};

export const renderReport = (matrix) => {
  const lines = [];
  lines.push("# Cross-browser replay matrix");
  lines.push("");
  lines.push(`Engines: ${matrix.summary.total}  ·  Passed: ${matrix.summary.passed}  ·  Failed: ${matrix.summary.failed}`);
  lines.push("");
  lines.push("| Browser | Result | Found / Total | Duration (ms) | Error |");
  lines.push("|---------|--------|---------------|---------------|-------|");
  for (const row of matrix.browsers) {
    const ok = !row.error && row.found === row.total;
    const result = ok ? "pass" : "fail";
    const err = row.error ? row.error.replace(/\|/g, "\\|") : "";
    lines.push(
      `| ${row.name} | ${result} | ${row.found} / ${row.total} | ${row.durationMs} | ${err} |`,
    );
  }
  lines.push("");
  return lines.join("\n");
};

export const playwrightRunner = (playwrightModule) => ({
  async launch(name) {
    const engine = playwrightModule[name];
    if (!engine) throw new Error(`playwright runner: unknown engine "${name}"`);
    const browser = await engine.launch({ headless: true });
    return {
      async newPage() {
        const page = await browser.newPage();
        return {
          goto: (url) => page.goto(url),
          locate: (selector) => {
            const loc = page.locator(selector);
            return { count: () => loc.count() };
          },
        };
      },
      close: () => browser.close(),
    };
  },
});

export const parseCaptureJsonl = (raw) =>
  raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => JSON.parse(line));
