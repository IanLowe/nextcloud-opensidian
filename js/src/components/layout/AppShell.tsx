import { useState, useEffect, useCallback } from "react";
import { PanelGroup, Panel, PanelResizeHandle } from "react-resizable-panels";
import { GitGraph, MessageSquare, FileText } from "lucide-react";
import { EditorPane } from "../editor/EditorPane";
import { BacklinksPanel } from "../backlinks/BacklinksPanel";
import { StatusBar } from "./StatusBar";
import { GraphCanvas } from "../graph/GraphCanvas";
import { ChatPanel } from "../chat/ChatPanel";
import { SettingsModal } from "../settings/SettingsModal";
import { useVaultWatcher } from "../../hooks/useVault";
import { useEditorStore } from "../../store/editorStore";
import { useVaultStore } from "../../store/vaultStore";
import { useSettingsStore } from "../../store/settingsStore";
import { useGraph } from "../../hooks/useGraph";

export function AppShell() {
  const [showGraph, setShowGraph] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const isIndexing = useVaultStore((s) => s.isIndexing);
  const settingsOpen = useSettingsStore((s) => s.isOpen);
  const { nodes, edges } = useGraph();

  useVaultWatcher();

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.ctrlKey || e.metaKey) {
      if (e.key === "s") {
        e.preventDefault();
        useEditorStore.getState().saveFile();
      }
      if (e.key === "g") {
        e.preventDefault();
        setShowGraph((v) => !v);
      }
    }
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 min-h-0">
        <PanelGroup direction="horizontal" autoSaveId="app-shell">
          {/* Left panel — editor OR graph (toggled by Ctrl+G) */}
          <Panel defaultSize={70} minSize={30}>
            {showGraph ? (
              <GraphCanvas
                nodes={nodes}
                edges={edges}
                onClose={() => setShowGraph(false)}
              />
            ) : (
              <div className="h-full relative">
                {isIndexing && (
                  <div className="absolute inset-x-0 top-0 z-10 h-0.5 bg-accent/30 animate-pulse" />
                )}
                <EditorPane />
              </div>
            )}
          </Panel>
          <PanelResizeHandle className="w-px bg-border hover:bg-accent transition-colors cursor-col-resize" />

          {/* Right panel — backlinks / chat */}
          <Panel defaultSize={30} minSize={20} maxSize={45}>
            <div className="h-full flex flex-col bg-base border-l border-border">
              <div className="flex items-center justify-between px-3 py-2 border-b border-border shrink-0">
                <div className="flex items-center gap-1">
                  <button
                    className={`text-xs px-2 py-1 rounded hover:bg-accent/5 ${!showChat ? "text-foreground font-medium" : "text-muted hover:text-accent"}`}
                    onClick={() => setShowChat(false)}
                  >
                    Backlinks
                  </button>
                  <button
                    className={`flex items-center gap-1 text-xs px-2 py-1 rounded hover:bg-accent/5 ${showChat ? "text-accent font-medium" : "text-muted hover:text-accent"}`}
                    onClick={() => setShowChat(true)}
                  >
                    <MessageSquare size={12} /> Chat
                  </button>
                </div>
                {/* Graph / Editor toggle button */}
                <button
                  className={`flex items-center gap-1 text-xs px-2 py-1 rounded hover:bg-accent/5 ${showGraph ? "text-accent font-medium" : "text-muted hover:text-accent"}`}
                  onClick={() => setShowGraph((v) => !v)}
                  title={showGraph ? "Back to editor (Ctrl+G)" : "Open graph view (Ctrl+G)"}
                >
                  {showGraph
                    ? <><FileText size={13} /> Editor</>
                    : <><GitGraph size={13} /> Graph</>
                  }
                </button>
              </div>
              {showChat ? <ChatPanel /> : <BacklinksPanel />}
            </div>
          </Panel>
        </PanelGroup>
      </div>

      <StatusBar />

      {settingsOpen && <SettingsModal />}
    </div>
  );
}
