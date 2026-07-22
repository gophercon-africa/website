import { defineCloudflareConfig } from "@opennextjs/cloudflare";

export default {
  ...defineCloudflareConfig(),
  // The Workers runtime can't run Prisma's native query engine, so the
  // Worker build regenerates the client with --no-engine (see build:worker).
  buildCommand: "npm run build:worker",
};
