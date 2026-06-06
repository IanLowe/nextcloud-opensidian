import { useEditorStore } from "../../store/editorStore";
import { useVaultStore } from "../../store/vaultStore";

function wordCount(text: string): number {
  return text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
}

export function StatusBar() {
  const content = useEditorStore((s) => s.content);
  const isDirty = useEditorStore((s) => s.isDirty);
  const isIndexing = useVaultStore((s) => s.isIndexing);

  return (
    <div className="flex items-center gap-4 px-4 py-1 border-t border-border bg-surface text-xs text-muted shrink-0">
      {isIndexing && <span className="text-accent animate-pulse">Indexing vault…</span>}
      {isDirty && <span className="text-yellow-400">● Unsaved</span>}
      <span className="ml-auto">{wordCount(content)} words</span>
      <span>{content.length} chars</span>
    </div>
  );
}
