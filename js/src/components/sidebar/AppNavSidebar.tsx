import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { Info, Settings } from "lucide-react";
import { FileTree } from "./FileTree";
import { CreateNoteDialog } from "./CreateNoteDialog";
import { CreateFolderDialog } from "./CreateFolderDialog";
import { AboutModal } from "../settings/AboutModal";
import { useVaultStore } from "../../store/vaultStore";
import { useSettingsStore } from "../../store/settingsStore";
import { basename } from "../../lib/nextcloudApi";

/**
 * Sidebar rendered into Nextcloud's #app-navigation via React portal.
 *
 * The dropdown and dialogs use createPortal(content, document.body) to
 * escape #app-navigation's backdrop-filter stacking context, which would
 * otherwise clip fixed-position descendants to the nav rail.
 */
export function AppNavSidebar() {
  const vaultPath = useVaultStore((s) => s.vaultPath);
  const refreshFiles = useVaultStore((s) => s.refreshFiles);
  const openSettings = useSettingsStore((s) => s.open);

  const [showAbout, setShowAbout] = useState(false);
  const [showPlusMenu, setShowPlusMenu] = useState(false);
  const [menuPos, setMenuPos] = useState({ x: 0, y: 0 });
  const [creatingNote, setCreatingNote] = useState(false);
  const [creatingFolder, setCreatingFolder] = useState(false);

  const plusRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const openPlusMenu = useCallback(() => {
    if (!plusRef.current || !vaultPath) return;
    const rect = plusRef.current.getBoundingClientRect();
    setMenuPos({ x: rect.right + 4, y: rect.top });
    setShowPlusMenu(true);
  }, [vaultPath]);

  // Close dropdown on click outside
  useEffect(() => {
    if (!showPlusMenu) return;
    const handler = (e: MouseEvent) => {
      const t = e.target as Node;
      if (!plusRef.current?.contains(t) && !menuRef.current?.contains(t)) {
        setShowPlusMenu(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showPlusMenu]);

  const vaultName = vaultPath ? basename(vaultPath) : "No vault";
  const hasVault = Boolean(vaultPath);

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>

      {/* Header: vault name + + button */}
      <div className="app-navigation-new" style={{ padding: "8px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span
            style={{
              flex: 1,
              fontSize: "13px",
              fontWeight: 600,
              color: "var(--color-main-text)",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              paddingLeft: "6px",
            }}
            title={vaultPath ?? ""}
          >
            {vaultName}
          </span>

          <button
            ref={plusRef}
            title={hasVault ? "New note or folder" : "Open a vault first"}
            onClick={openPlusMenu}
            disabled={!hasVault}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 32,
              height: 32,
              border: "none",
              borderRadius: "var(--border-radius, 4px)",
              background: "transparent",
              color: hasVault ? "var(--color-main-text)" : "var(--color-text-maxcontrast)",
              cursor: hasVault ? "pointer" : "not-allowed",
              fontSize: "20px",
              lineHeight: 1,
              flexShrink: 0,
              opacity: hasVault ? 1 : 0.4,
            }}
            onMouseOver={(e) => {
              if (hasVault) e.currentTarget.style.background = "var(--color-background-hover)";
            }}
            onMouseOut={(e) => { e.currentTarget.style.background = "transparent"; }}
          >
            +
          </button>
        </div>
      </div>

      {/* File tree */}
      <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden" }}>
        {vaultPath ? (
          <FileTree />
        ) : (
          <p style={{ padding: "16px", fontSize: "13px", color: "var(--color-text-maxcontrast)" }}>
            No vault open
          </p>
        )}
      </div>

      {/* Bottom settings */}
      <div
        id="app-settings"
        style={{ borderTop: "1px solid var(--color-border)", padding: "4px 8px" }}
      >
        <div style={{ display: "flex", gap: "4px" }}>
          <button
            onClick={() => setShowAbout(true)}
            style={sidebarActionStyle}
            onMouseOver={(e) => (e.currentTarget.style.background = "var(--color-background-hover)")}
            onMouseOut={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <Info size={16} />
            Info
          </button>
          <button
            onClick={() => openSettings("vault")}
            style={sidebarActionStyle}
            onMouseOver={(e) => (e.currentTarget.style.background = "var(--color-background-hover)")}
            onMouseOut={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <Settings size={16} />
            Settings
          </button>
        </div>
      </div>

      {/* Dropdown — portaled to body to escape #app-navigation's stacking context */}
      {showPlusMenu && createPortal(
        <div
          ref={menuRef}
          style={{
            position: "fixed",
            left: menuPos.x,
            top: menuPos.y,
            zIndex: 2000,
            background: "var(--color-main-background)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--border-radius-large, 8px)",
            boxShadow: "0 4px 16px rgba(0,0,0,0.18)",
            padding: "4px 0",
            minWidth: 160,
          }}
        >
          <button
            style={menuItemStyle}
            onMouseOver={(e) => (e.currentTarget.style.background = "var(--color-background-hover)")}
            onMouseOut={(e) => (e.currentTarget.style.background = "transparent")}
            onClick={() => { setCreatingNote(true); setShowPlusMenu(false); }}
          >
            New note
          </button>
          <button
            style={menuItemStyle}
            onMouseOver={(e) => (e.currentTarget.style.background = "var(--color-background-hover)")}
            onMouseOut={(e) => (e.currentTarget.style.background = "transparent")}
            onClick={() => { setCreatingFolder(true); setShowPlusMenu(false); }}
          >
            New folder
          </button>
        </div>,
        document.body
      )}

      {/* AboutModal — portaled to body to escape sidebar stacking context */}
      {showAbout && createPortal(
        <AboutModal onClose={() => setShowAbout(false)} />,
        document.body
      )}

      {/* Dialogs — portaled to body for the same reason */}
      {creatingNote && vaultPath && createPortal(
        <CreateNoteDialog
          targetDir={vaultPath}
          onClose={() => setCreatingNote(false)}
          onCreated={refreshFiles}
        />,
        document.body
      )}
      {creatingFolder && vaultPath && createPortal(
        <CreateFolderDialog
          targetDir={vaultPath}
          onClose={() => setCreatingFolder(false)}
          onCreated={refreshFiles}
        />,
        document.body
      )}
    </div>
  );
}

const menuItemStyle: React.CSSProperties = {
  display: "block",
  width: "100%",
  padding: "8px 16px",
  border: "none",
  background: "transparent",
  color: "var(--color-main-text)",
  cursor: "pointer",
  fontSize: "13px",
  textAlign: "left",
};

const sidebarActionStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "6px",
  flex: 1,
  padding: "8px 6px",
  border: "none",
  borderRadius: "var(--border-radius, 4px)",
  background: "transparent",
  color: "var(--color-main-text)",
  cursor: "pointer",
  fontSize: "13px",
};
