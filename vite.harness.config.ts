// Isolated Vite config for the screenshot harness (design review). It serves
// harness.html and swaps every Firebase-touching module for an inert stub via a
// resolveId plugin, so all screens render offline with no backend. This file is
// dev-only tooling and never part of a production build.
import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

const stub = (rel: string) =>
  fileURLToPath(new URL(`./src/harness/stubs/${rel}`, import.meta.url));

// Redirect module specifiers to harness stubs. Matches on the specifier so it
// works regardless of the importer's depth (../firebase vs ./firebase).
function stubFirebase(): Plugin {
  const map: { test: (s: string) => boolean; to: string }[] = [
    { test: (s) => /(^|\/)firebase$/.test(s), to: stub("firebase.ts") },
    { test: (s) => s === "firebase/database", to: stub("firebase-database.ts") },
    { test: (s) => s === "firebase/auth", to: stub("firebase-auth.ts") },
    { test: (s) => /\/hooks\/useProfile$/.test(s), to: stub("useProfile.ts") },
    { test: (s) => /\/hooks\/useAuth$/.test(s), to: stub("useAuth.ts") },
    { test: (s) => /\/hooks\/useSession$/.test(s), to: stub("useSession.ts") },
    { test: (s) => /\/lib\/functions$/.test(s), to: stub("functions.ts") },
  ];
  return {
    name: "harness-stub-firebase",
    enforce: "pre",
    resolveId(source, importer) {
      // Never remap the stub files themselves.
      if (importer && importer.includes("/harness/stubs/")) return null;
      for (const m of map) if (m.test(source)) return m.to;
      return null;
    },
  };
}

const BUILD_STAMP =
  new Date().toISOString().slice(0, 16).replace("T", " ") + " UTC (harness)";

export default defineConfig({
  plugins: [stubFirebase(), react()],
  define: {
    __BUILD_STAMP__: JSON.stringify(BUILD_STAMP),
    "import.meta.env.VITE_PATH_ENABLED": JSON.stringify("true"),
  },
  server: { port: 5199, strictPort: true },
});
