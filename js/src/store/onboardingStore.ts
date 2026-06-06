import { create } from "zustand";

const LS_KEY = "opensidian_hasSeenOnboarding";

interface OnboardingStore {
  hasSeenOnboarding: boolean;
  isOpen: boolean;
  open: () => void;
  complete: () => void;
  resetAll: () => void;
}

export const useOnboardingStore = create<OnboardingStore>((set) => ({
  hasSeenOnboarding: localStorage.getItem(LS_KEY) === "true",
  isOpen: false,

  open: () => set({ isOpen: true }),

  complete: () => {
    try { localStorage.setItem(LS_KEY, "true"); } catch { /* ignore */ }
    set({ hasSeenOnboarding: true, isOpen: false });
  },

  resetAll: () => {
    try { localStorage.removeItem(LS_KEY); } catch { /* ignore */ }
    set({ hasSeenOnboarding: false, isOpen: false });
  },
}));
