import { create } from "zustand";
import { saveSettings, getSettings } from "../lib/nextcloudApi";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export interface LLMSettings {
  url: string;
  model: string;
  token: string;
  systemPrompt: string;
  userPrompt: string;
}

const LS_TOKEN_KEY = "opensidian_llm_token";

function loadTokenFromLocalStorage(): string {
  try { return localStorage.getItem(LS_TOKEN_KEY) ?? ""; } catch { return ""; }
}

interface LLMState {
  messages: ChatMessage[];
  settings: LLMSettings;
  isLoading: boolean;

  initFromSettings: () => Promise<void>;
  addMessage: (msg: Omit<ChatMessage, "id">) => void;
  clearChat: () => void;
  setLoading: (v: boolean) => void;
  updateSettings: (s: LLMSettings) => void;
}

export const useLLMStore = create<LLMState>()((set, get) => ({
  messages: [],
  settings: {
    url: "", model: "", token: loadTokenFromLocalStorage(),
    systemPrompt: "", userPrompt: "",
  },
  isLoading: false,

  initFromSettings: async () => {
    try {
      const settings = await getSettings();
      const { url, model, systemPrompt, userPrompt } = settings.llmSettings;
      set((state) => ({
        settings: {
          ...state.settings,
          url, model, systemPrompt, userPrompt,
          token: loadTokenFromLocalStorage(),
        },
      }));
    } catch { /* ignore */ }
  },

  addMessage: (msg) =>
    set((state) => ({
      messages: [...state.messages, { ...msg, id: `${Date.now()}-${Math.random()}` }],
    })),

  clearChat: () => set({ messages: [] }),

  setLoading: (v) => set({ isLoading: v }),

  updateSettings: (s) => {
    set({ settings: s });
    // Token stays in localStorage only
    try { localStorage.setItem(LS_TOKEN_KEY, s.token); } catch { /* ignore */ }
    // Persist the rest to server
    saveSettings({
      llmSettings: {
        url: s.url,
        model: s.model,
        systemPrompt: s.systemPrompt,
        userPrompt: s.userPrompt,
      },
    }).catch(console.error);
  },
}));
