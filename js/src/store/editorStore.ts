import { create } from "zustand";
import { readFile, writeFile } from "../lib/nextcloudApi";
import { indexFile } from "../lib/vaultIndexer";
import { cacheContent } from "../hooks/useBacklinks";

interface EditorState {
  activeFilePath: string | null;
  content: string;
  isDirty: boolean;
  saveTimer: ReturnType<typeof setTimeout> | null;

  openFile: (path: string) => Promise<void>;
  setContent: (content: string) => void;
  saveFile: () => Promise<void>;
  closeFile: () => void;
}

export const useEditorStore = create<EditorState>()((set, get) => ({
  activeFilePath: null,
  content: "",
  isDirty: false,
  saveTimer: null,

  openFile: async (path) => {
    const { saveTimer, isDirty, saveFile } = get();
    if (isDirty) await saveFile();
    if (saveTimer) clearTimeout(saveTimer);

    const content = await readFile(path);
    cacheContent(path, content);
    set({ activeFilePath: path, content, isDirty: false, saveTimer: null });
  },

  setContent: (content) => {
    const { saveTimer, activeFilePath } = get();
    if (saveTimer) clearTimeout(saveTimer);

    if (activeFilePath) cacheContent(activeFilePath, content);

    const timer = setTimeout(() => {
      get().saveFile();
    }, 500);

    set({ content, isDirty: true, saveTimer: timer });
  },

  saveFile: async () => {
    const { activeFilePath, content, saveTimer } = get();
    if (!activeFilePath) return;
    if (saveTimer) clearTimeout(saveTimer);

    await writeFile(activeFilePath, content);
    indexFile(activeFilePath, content);
    set({ isDirty: false, saveTimer: null });
  },

  closeFile: () => {
    const { saveTimer } = get();
    if (saveTimer) clearTimeout(saveTimer);
    set({ activeFilePath: null, content: "", isDirty: false, saveTimer: null });
  },
}));
