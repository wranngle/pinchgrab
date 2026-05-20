// One-shot GC pass invoked by cron via scripts/bin/composio-gc-daemon.sh.
// Exits non-zero only on unexpected errors so cron can flag failures via the
// ECS log; "no work to do" is a normal exit 0.
import { gcStaleConnections } from '../src/gcStaleConnections.js';
import { logError, logInfo } from '../src/logging.js';

async function main(): Promise<void> {
  const maxAgeMinutes = Number.parseInt(process.env.COMPOSIO_GC_MAX_AGE_MINUTES ?? '30', 10);
  const result = await gcStaleConnections(Number.isFinite(maxAgeMinutes) ? maxAgeMinutes : 30);
  logInfo('composio.gc.cron-finished', {
    deletedCount: result.deleted.length,
    locallyExpiredCount: result.locallyExpired.length,
  });
  process.stdout.write(JSON.stringify(result) + '\n');
}

main().catch((err: unknown) => {
  const message = err instanceof Error ? err.message : String(err);
  logError('composio.gc.cron-failed', message);
  process.exit(1);
});
