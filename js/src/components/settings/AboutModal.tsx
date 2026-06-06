import { X, Globe, Github, Coffee, Code2, BookOpen } from "lucide-react";
import { useOnboardingStore } from "../../store/onboardingStore";

interface Props {
  onClose: () => void;
}

const LINKS = {
  website: "https://markus-begerow.de/linktree",
  github: "https://github.com/markusbegerow/opensidian",
  coffee: "https://paypal.me/MarkusBegerow",
};

const FEATURES = [
  "Full-featured CodeMirror 6 markdown editor with split-pane live preview",
  "[[Wikilink]] syntax with shortest-path resolution and backlinks panel",
  "Force-directed D3 knowledge graph (Ctrl+G) with emoji color coding",
  "AI chat panel — OpenAI-compatible, uses active note + linked notes as context",
  "Hierarchical file tree with drag-and-drop, rename, delete and templates",
  "Light / dark theme, adjustable font size, auto-save",
];

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] uppercase tracking-wider font-semibold text-muted mb-2">{children}</p>
  );
}

function ExternalLink({ href, icon, label, sub }: { href: string; icon: React.ReactNode; label: string; sub: string }) {
  return (
    <button
      onClick={() => window.open(href, "_blank")}
      className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg border border-border hover:border-accent hover:bg-accent/5 transition-colors text-left group"
    >
      <span className="text-muted group-hover:text-accent transition-colors shrink-0">{icon}</span>
      <div className="min-w-0">
        <p className="text-sm font-medium text-text leading-none mb-0.5">{label}</p>
        <p className="text-xs text-muted truncate">{sub}</p>
      </div>
      <span className="text-muted text-xs ml-auto shrink-0">↗</span>
    </button>
  );
}

export function AboutModal({ onClose }: Props) {
  const openOnboarding = useOnboardingStore((s) => s.open);
  return (
    <div
      className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/30"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative bg-base border border-border rounded-xl shadow-lg w-[600px] max-w-[90vw]">
        {/* Close button — absolute so it stays in corner during scroll */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 z-10 w-[var(--default-clickable-area)] h-[var(--default-clickable-area)] flex items-center justify-center rounded-full text-muted hover:text-text hover:bg-accent/10 transition-colors"
        >
          <X size={18} />
        </button>

        <div className="max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-6 space-y-6">
          {/* App identity */}
          <div className="flex items-center gap-3">
            <div className="w-[52px] h-[52px] rounded-xl bg-accent flex items-center justify-center shrink-0">
              <Code2 size={24} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-bold text-base leading-tight text-text">Opensidian</h2>
              <div className="flex items-center gap-2 mt-0.5">
                <p className="text-xs text-muted">Open-source Markdown note-taking for Nextcloud</p>
                <span className="text-xs text-muted border border-border rounded-full px-2 py-0.5 shrink-0">v1.0</span>
              </div>
            </div>
          </div>

          {/* Application Information */}
          <div className="border-t border-border pt-4">
            <SectionHeading>Application Information</SectionHeading>
            <dl className="space-y-1.5 text-sm">
              {([
                ["Author", "Markus Begerow"],
                ["Version", "1.0"],
                ["License", "GPL v3"],
              ] as [string, string][]).map(([label, value]) => (
                <div key={label} className="flex gap-2">
                  <dt className="text-muted w-16 shrink-0">{label}</dt>
                  <dd className="text-text font-medium">{value}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Features */}
          <div className="border-t border-border pt-4">
            <SectionHeading>Features</SectionHeading>
            <ul className="space-y-1.5 text-xs text-muted list-disc list-inside leading-relaxed">
              {FEATURES.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </div>

          {/* Links */}
          <div className="border-t border-border pt-4">
            <SectionHeading>Links</SectionHeading>
            <div className="space-y-2">
              <ExternalLink href={LINKS.website} icon={<Globe size={16} />} label="Website" sub="markus-begerow.de/linktree" />
              <ExternalLink href={LINKS.github} icon={<Github size={16} />} label="GitHub" sub="markusbegerow/opensidian" />
              <ExternalLink href={LINKS.coffee} icon={<Coffee size={16} />} label="Donate a coffee" sub="paypal.me/MarkusBegerow" />
            </div>
          </div>

          {/* Getting Started */}
          <div className="border-t border-border pt-4">
            <button
              onClick={() => { openOnboarding(); onClose(); }}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg border border-border hover:border-accent/50 hover:bg-accent/5 transition-colors text-muted hover:text-accent text-sm font-medium"
            >
              <BookOpen size={15} /> Getting Started
            </button>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
