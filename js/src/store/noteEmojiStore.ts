import { create } from "zustand";
import { BUILTIN_EMOJI_COLORS } from "./colorStore";

interface NoteEmojiState {
  emojiByPath: Record<string, string>;
  previewByPath: Record<string, string[]>;
  setEmoji: (path: string, emoji: string | null) => void;
  setPreview: (path: string, lines: string[]) => void;
  reset: () => void;
}

export const useNoteEmojiStore = create<NoteEmojiState>()((set) => ({
  emojiByPath: {},
  previewByPath: {},

  setEmoji: (path, emoji) =>
    set((state) => {
      const next = { ...state.emojiByPath };
      if (emoji) next[path] = emoji;
      else delete next[path];
      return { emojiByPath: next };
    }),

  setPreview: (path, lines) =>
    set((state) => ({
      previewByPath: { ...state.previewByPath, [path]: lines },
    })),

  reset: () => set({ emojiByPath: {}, previewByPath: {} }),
}));

export function extractHeadingPreview(content: string): string[] {
  return content
    .split("\n")
    .filter((line) => /^#{1,2}\s+\S/.test(line))
    .map((line) => line.replace(/^#{1,2}\s+/, "").trim())
    .slice(0, 3);
}

export function extractNoteEmoji(content: string): string | null {
  const firstLine = content.split("\n")[0] ?? "";
  for (const emoji of Object.keys(BUILTIN_EMOJI_COLORS)) {
    if (firstLine.includes(emoji)) return emoji;
  }
  const match = firstLine.match(
    /[\u{1F300}-\u{1FAFF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{1F000}-\u{1FFFF}]/u
  );
  return match ? match[0] : null;
}
