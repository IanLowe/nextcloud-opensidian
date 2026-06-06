import { useEffect } from "react";
import { createPortal } from "react-dom";
import { AppShell } from "./components/layout/AppShell";
import { VaultSetupModal } from "./components/onboarding/VaultSetupModal";
import { WelcomeWizard } from "./components/onboarding/WelcomeWizard";
import { AppNavSidebar } from "./components/sidebar/AppNavSidebar";
import { useVaultStore } from "./store/vaultStore";
import { useOnboardingStore } from "./store/onboardingStore";
import { useLLMStore } from "./store/llmStore";
import "./store/themeStore"; // ensures font-size CSS variable is set before first render

export default function App() {
  const vaultPath = useVaultStore((s) => s.vaultPath);
  const isLoading = useVaultStore((s) => s.isLoading);
  const isOpen = useOnboardingStore((s) => s.isOpen);
  const hasSeenOnboarding = useOnboardingStore((s) => s.hasSeenOnboarding);

  useEffect(() => {
    useVaultStore.getState().initFromSettings();
    useLLMStore.getState().initFromSettings();
  }, []);

  useEffect(() => {
    if (vaultPath && !hasSeenOnboarding) {
      useOnboardingStore.getState().open();
    }
  }, [vaultPath, hasSeenOnboarding]);

  // Portal target for the Nextcloud nav sidebar
  const navEl = document.getElementById("opensidian-nav-inner");

  return (
    <>
      {/* Always render the file tree into #app-navigation via portal */}
      {navEl && createPortal(<AppNavSidebar />, navEl)}

      {isLoading ? (
        <div style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--color-text-maxcontrast)",
          fontSize: "13px",
        }}>
          Loading…
        </div>
      ) : !vaultPath ? (
        <VaultSetupModal />
      ) : (
        <>
          <AppShell />
          {isOpen && <WelcomeWizard />}
        </>
      )}
    </>
  );
}
