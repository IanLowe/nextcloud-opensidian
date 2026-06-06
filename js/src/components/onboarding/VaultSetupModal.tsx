import { useState } from "react";
import { FolderOpen, Loader2, CheckCircle2 } from "lucide-react";
import { useVaultStore } from "../../store/vaultStore";

type Status = "idle" | "loading" | "done" | "error";

export function VaultSetupModal() {
  const changeVault = useVaultStore((s) => s.changeVault);
  const [path, setPath] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleOpen() {
    const trimmed = path.trim().replace(/^\/+/, "");
    if (!trimmed) return;
    setError(null);
    setStatus("loading");
    try {
      await changeVault(trimmed);
      setStatus("done");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e));
      setStatus("error");
    }
  }

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-base">
      <div className="w-[480px] space-y-6 px-4">
        <div>
          <h1 className="text-2xl font-bold">Open your vault</h1>
          <p className="text-muted text-sm mt-1">
            Enter the path to a Nextcloud folder containing your Markdown notes.
          </p>
        </div>

        <div className="bg-surface border border-border rounded-xl p-4 space-y-2">
          <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">
            Examples
          </p>
          {["Notes", "Documents/Notes", "Personal/Vault"].map((ex) => (
            <button
              key={ex}
              className="block text-xs text-accent font-mono hover:underline"
              onClick={() => setPath(ex)}
            >
              {ex}
            </button>
          ))}
        </div>

        {status === "idle" || status === "error" ? (
          <div className="space-y-3">
            <div className="flex gap-2">
              <input
                autoFocus
                className="flex-1 bg-base border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-accent transition-colors"
                placeholder="e.g. Notes"
                value={path}
                onChange={(e) => setPath(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleOpen()}
              />
              <button
                onClick={handleOpen}
                disabled={!path.trim()}
                className="flex items-center gap-2 px-4 py-2.5 bg-accent text-white rounded-lg hover:bg-accent/80 transition-colors disabled:opacity-40 font-medium text-sm"
              >
                <FolderOpen size={16} />
                Open
              </button>
            </div>

            {error && (
              <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                {error}
              </p>
            )}
          </div>
        ) : status === "loading" ? (
          <div className="flex items-center justify-center gap-3 py-6 text-muted">
            <Loader2 size={20} className="animate-spin text-accent" />
            <span className="text-sm">Opening vault…</span>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-3 py-6 text-green-400">
            <CheckCircle2 size={20} />
            <span className="text-sm font-medium">Vault ready!</span>
          </div>
        )}
      </div>
    </div>
  );
}
