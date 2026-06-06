import { create } from "zustand";

// ── Theme detection ───────────────────────────────────────────────────────────
// Reads PHP-authored body[data-themes] — the authoritative NC user preference,
// set server-side before any JS runs. Falls back to OS preference if unset.
export function resolveIsDark(): boolean {
  const themes = document.body?.getAttribute("data-themes") ?? "";
  if (themes.includes("light")) return false;
  if (themes.includes("dark")) return true;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

// Sets CSS tokens as inline styles on <html> — highest CSS specificity,
// overrides any [data-theme-*] rule regardless of cascade order.
function applyOpensidianTheme() {
  const s = document.documentElement.style;
  if (resolveIsDark()) {
    s.setProperty("--color-base",    "#171717");
    s.setProperty("--color-surface", "#1f1f1f");
    s.setProperty("--color-text",    "#e0e0e0");
    s.setProperty("--color-muted",   "#a0a0a0");
    s.setProperty("--color-border",  "#444444");
  } else {
    s.setProperty("--color-base",    "#ffffff");
    s.setProperty("--color-surface", "#ededed");
    s.setProperty("--color-text",    "#222222");
    s.setProperty("--color-muted",   "#6b6b6b");
    s.setProperty("--color-border",  "#d0d0d0");
  }
}
applyOpensidianTheme(); // synchronous — runs before first React render

// ── Font size ─────────────────────────────────────────────────────────────────
interface ThemeStore {
  fontSize: number;
  setFontSize: (size: number) => void;
}

function applyFontSize(size: number) {
  document.documentElement.style.setProperty("--font-size", `${size}px`);
}

function loadFontSize(): number {
  try { return Number(localStorage.getItem("opensidian_fontSize")) || 16; }
  catch { return 16; }
}

const initialFontSize = loadFontSize();
applyFontSize(initialFontSize);

export const useThemeStore = create<ThemeStore>((set) => ({
  fontSize: initialFontSize,

  setFontSize: (size) => {
    applyFontSize(size);
    try { localStorage.setItem("opensidian_fontSize", String(size)); } catch { /* ignore */ }
    set({ fontSize: size });
  },
}));
