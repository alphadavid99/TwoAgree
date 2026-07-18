import { defineConfig } from "vitest/config";

// Security-rules tests only. Kept in its own config because these need the RTDB
// emulator running, so they are excluded from the default `npm test` (see
// vite.config.ts). Run via `npm run test:rules`, which starts an emulator, or
// point vitest here directly if you already have one up.
export default defineConfig({
  test: {
    include: ["src/lib/rules.test.ts"],
  },
});
