#!/usr/bin/env node
import net from "node:net";

function argValue(name, fallback) {
  const prefix = `--${name}=`;
  const found = process.argv.slice(2).find((arg) => arg.startsWith(prefix));
  return found ? found.slice(prefix.length) : fallback;
}

const listenHost = argValue("listen-host", "127.0.0.1");
const listenPort = Number(argValue("listen-port", "9222"));
const targetHost = argValue("target-host", "");
const targetPort = Number(argValue("target-port", String(listenPort)));

if (!targetHost || !Number.isInteger(listenPort) || !Number.isInteger(targetPort)) {
  console.error("usage: edge-cdp-wsl-proxy.mjs --target-host=<host> [--listen-port=9222] [--target-port=9222]");
  process.exit(2);
}

const server = net.createServer((client) => {
  const upstream = net.createConnection({ host: targetHost, port: targetPort });

  client.on("error", () => upstream.destroy());
  upstream.on("error", () => client.destroy());
  client.pipe(upstream);
  upstream.pipe(client);
});

server.on("error", (error) => {
  console.error(`edge-cdp proxy failed: ${error.message}`);
  process.exit(error.code === "EADDRINUSE" ? 0 : 1);
});

server.listen(listenPort, listenHost, () => {
  console.error(`edge-cdp proxy ${listenHost}:${listenPort} -> ${targetHost}:${targetPort}`);
});
