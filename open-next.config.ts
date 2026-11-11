// OpenNext Cloudflare adapter configuration.
// See https://opennext.js.org/cloudflare/caching
import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import r2IncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache";
import doQueue from "@opennextjs/cloudflare/overrides/queue/do-queue";
import doShardedTagCache from "@opennextjs/cloudflare/overrides/tag-cache/do-sharded-tag-cache";

export default defineCloudflareConfig({
  incrementalCache: r2IncrementalCache,
  // Without a queue, time-based ISR (`revalidate = 86400`) never regenerates.
  queue: doQueue,
  // Without a tag cache, `revalidatePath()` from the update-rates cron is a
  // no-op and every page stays frozen at its first-cached rate.
  tagCache: doShardedTagCache({ baseShardSize: 4 }),
});
