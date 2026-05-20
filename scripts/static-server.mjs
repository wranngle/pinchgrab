import { createReadStream } from "node:fs";
import { access } from "node:fs/promises";
import { createServer } from "node:http";
import { extname, resolve } from "node:path";
import { cwd, env } from "node:process";

const root = resolve(env.STATIC_ROOT || cwd());
const port = Number(process.env.PORT || 4173);
const url = new URL(`http://127.0.0.1:${port}`);

const mimeByExt = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml; charset=utf-8",
  ".md": "text/markdown; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
};

const isInRoot = (candidate) => {
  const abs = resolve(candidate);
  const marker = root.endsWith("\\") || root.endsWith("/") ? root : root + "\\";
  return abs === root || abs.startsWith(marker);
};

const toFilePath = (requestPath) => {
  const pathname = decodeURIComponent((new URL(requestPath, url)).pathname);
  const safe = pathname === "/" ? "/index.html" : pathname;
  return resolve(root, `.${safe}`);
};

const server = createServer(async (req, res) => {
  if (!req.url) {
    res.writeHead(400);
    res.end("Bad Request");
    return;
  }

  try {
    const filePath = toFilePath(req.url);
    if (!isInRoot(filePath)) {
      res.writeHead(403);
      res.end("Forbidden");
      return;
    }

    await access(filePath);
    const extension = extname(filePath);
    res.writeHead(200, { "Content-Type": mimeByExt[extension] || "text/plain" });
    createReadStream(filePath).pipe(res);
  } catch {
    res.writeHead(404);
    res.end("Not Found");
  }
});

server.listen(port, "127.0.0.1", () => {
  process.stdout.write(`selector-capture demo server: http://127.0.0.1:${port}\n`);
  process.stdout.write(`serving ${root}\n`);
});

process.on("SIGINT", () => server.close(() => process.exit(0)));
