// Hosted previews can run the page in a sandboxed frame where touching
// localStorage/sessionStorage throws. The app reads them at import time (language,
// "returning" flag, per-user state), so without this the page would not render.
// If storage works this does nothing; if not, it installs an in-memory stand-in.
// Imported first in main.tsx so it runs before any app module is evaluated.
function memoryStorage(): Storage {
  const m = new Map<string, string>()
  return {
    get length() { return m.size },
    clear: () => m.clear(),
    getItem: (k) => m.get(k) ?? null,
    key: (i) => [...m.keys()][i] ?? null,
    removeItem: (k) => void m.delete(k),
    setItem: (k, v) => void m.set(k, String(v)),
  }
}
for (const name of ['localStorage', 'sessionStorage'] as const) {
  try {
    void window[name].length
  } catch {
    Object.defineProperty(window, name, { value: memoryStorage(), configurable: true })
  }
}
