import { useState } from "react";
import { ArrowRight, ArrowLeft, X, Link2, Palette, Rocket, FileText, Bot } from "lucide-react";
import { useOnboardingStore } from "../../store/onboardingStore";
import { useLLMStore } from "../../store/llmStore";

const STEPS = [
  { icon: <Rocket size={28} className="text-accent" />, title: "Welcome to Opensidian", content: <StepWelcome /> },
  { icon: <Link2 size={28} className="text-accent" />, title: "Connect with Wikilinks", content: <StepWikilinks /> },
  { icon: <FileText size={28} className="text-accent" />, title: "Note Templates", content: <StepTemplates /> },
  { icon: <Palette size={28} className="text-accent" />, title: "Color & Emoji system", content: <StepColors /> },
  { icon: <Bot size={28} className="text-accent" />, title: "AI & LLM Setup", content: <StepLLM /> },
];

export function WelcomeWizard() {
  const [step, setStep] = useState(0);
  const complete = useOnboardingStore((s) => s.complete);

  const isLast = step === STEPS.length - 1;
  const current = STEPS[step];

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/30">
      <div className="bg-base border border-border rounded-2xl shadow-2xl w-[680px] overflow-hidden">
        <div className="flex items-center justify-between px-6 pt-6 pb-0">
          <div className="flex items-center gap-3">
            {current.icon}
            <h2 className="text-lg font-bold">{current.title}</h2>
          </div>
          <button onClick={complete} className="text-muted hover:text-text transition-colors" title="Skip">
            <X size={16} />
          </button>
        </div>

        <div className="px-6 py-5 min-h-[300px]">{current.content}</div>

        <div className="flex items-center justify-between px-6 py-4 border-t border-border">
          <div className="flex gap-1.5">
            {STEPS.map((_, i) => (
              <button
                key={i}
                onClick={() => setStep(i)}
                className={`w-2 h-2 rounded-full transition-colors ${i === step ? "bg-accent" : "bg-border hover:bg-muted"}`}
              />
            ))}
          </div>
          <div className="flex items-center gap-2">
            {step > 0 && (
              <button
                onClick={() => setStep((s) => s - 1)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-muted hover:text-text border border-border rounded-lg hover:bg-accent/5 transition-colors"
              >
                <ArrowLeft size={14} /> Back
              </button>
            )}
            <button
              onClick={() => (isLast ? complete() : setStep((s) => s + 1))}
              className="flex items-center gap-1.5 px-4 py-1.5 text-sm font-medium bg-accent text-white rounded-lg hover:bg-accent/80 transition-colors"
            >
              {isLast ? "Get started" : "Next"}
              {!isLast && <ArrowRight size={14} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function StepWelcome() {
  return (
    <div className="space-y-4">
      <p className="text-text leading-relaxed">
        Opensidian turns your <span className="text-accent font-medium">Nextcloud folder</span> of Markdown files
        into a linked knowledge base — wikilinks, graph view, and AI chat, right inside Nextcloud.
      </p>
      <div className="grid grid-cols-3 gap-3 pt-1">
        {[
          { emoji: "📁", label: "Your Nextcloud folder", desc: "Notes stay in your files" },
          { emoji: "✍️", label: "Plain Markdown", desc: "Open in any editor" },
          { emoji: "🔓", label: "Open source", desc: "Free forever" },
        ].map((item) => (
          <div key={item.label} className="flex flex-col items-center text-center gap-1.5 p-3 rounded-xl bg-surface border border-border">
            <span className="text-2xl">{item.emoji}</span>
            <p className="text-xs font-semibold text-text">{item.label}</p>
            <p className="text-xs text-muted">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function StepWikilinks() {
  return (
    <div className="space-y-4">
      <p className="text-text leading-relaxed">
        Type <code className="bg-surface border border-border rounded px-1.5 py-0.5 text-accent font-mono text-sm">[[Note Name]]</code> anywhere in a note to create a link. Opensidian tracks every connection automatically.
      </p>
      <div className="bg-surface border border-border rounded-xl p-4 font-mono text-sm space-y-1 text-muted">
        <p><span className="text-accent font-bold"># </span><span className="text-text">🟨 Project Alpha</span></p>
        <p className="pt-1">Owner: <span className="text-accent underline">[[Anna Example]]</span></p>
        <p>Kickoff: <span className="text-accent underline">[[2026-04-15 Kickoff]]</span></p>
        <p>Depends on: <span className="text-accent underline">[[Project Beta]]</span></p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {[
          { emoji: "🔗", label: "Backlinks panel", desc: "See every note that links to the current one" },
          { emoji: "🕸️", label: "Graph view", desc: "Ctrl+G — visualize your entire knowledge network" },
        ].map((item) => (
          <div key={item.label} className="flex gap-2.5 p-3 rounded-xl bg-surface border border-border">
            <span className="text-xl shrink-0">{item.emoji}</span>
            <div>
              <p className="text-xs font-semibold text-text">{item.label}</p>
              <p className="text-xs text-muted mt-0.5">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StepColors() {
  return (
    <div className="space-y-3">
      <p className="text-text text-sm leading-relaxed">
        Prefix note titles with a colored emoji to visually type them. Create <code className="bg-surface border border-border rounded px-1 text-accent font-mono text-xs">.configs/colors.md</code> in your vault to define your own system:
      </p>
      <div className="bg-surface border border-border rounded-xl p-4 font-mono text-xs space-y-1">
        <p className="text-muted"># Color System</p>
        <p className="pt-1 text-muted">| Emoji | Color &nbsp;&nbsp;&nbsp; | Type |</p>
        <p className="text-muted">|-------|---------|------|</p>
        {[
          { emoji: "🟩", color: "#a6e3a1", type: "Colleague" },
          { emoji: "🟨", color: "#f9e2af", type: "Project" },
          { emoji: "🟫", color: "#f44336", type: "Meeting" },
        ].map((row) => (
          <p key={row.type}>
            <span>{row.emoji}</span>
            <span className="text-muted"> | </span>
            <span className="text-accent">{row.color}</span>
            <span className="text-muted"> | {row.type}</span>
          </p>
        ))}
      </div>
    </div>
  );
}

function StepTemplates() {
  return (
    <div className="space-y-3">
      <p className="text-text text-sm leading-relaxed">
        Create a <code className="bg-surface border border-border rounded px-1 text-accent font-mono text-xs">.templates/</code> folder in your vault. When creating a new note, you can pick a template as a starting point.
      </p>
      <div className="bg-surface border border-border rounded-xl p-4 font-mono text-xs space-y-0.5">
        <p className="text-muted mb-1">.templates/Meeting.md</p>
        <p className="text-accent font-bold"># 🟫 &lt;Date&gt; &lt;Title&gt;</p>
        <p className="text-muted">**Date:** </p>
        <p className="text-muted">**Participants:** [[]], [[]]</p>
        <p className="text-accent pt-1">## Agenda</p>
        <p className="text-muted">- </p>
        <p className="text-accent pt-1">## Decisions / Actions</p>
        <p className="text-muted">- [ ] </p>
      </div>
    </div>
  );
}

function StepLLM() {
  const { settings, updateSettings } = useLLMStore();
  const [form, setForm] = useState({
    url: settings.url || "https://api.openai.com/v1/chat/completions",
    model: settings.model || "gpt-4o",
    token: settings.token || "",
    systemPrompt: settings.systemPrompt || "",
    userPrompt: settings.userPrompt || "",
  });

  function handleChange(field: keyof typeof form, value: string) {
    const updated = { ...form, [field]: value };
    setForm(updated);
    updateSettings(updated);
  }

  return (
    <div className="space-y-4">
      <p className="text-text text-sm leading-relaxed">
        Connect an OpenAI-compatible API to chat with your notes. You can skip this and configure it later in <span className="text-accent font-medium">Settings → AI & LLM</span>.
      </p>
      <div className="space-y-3">
        <div>
          <label className="block text-xs text-muted mb-1.5">API URL</label>
          <input className="w-full bg-base border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent transition-colors" value={form.url} onChange={(e) => handleChange("url", e.target.value)} />
        </div>
        <div>
          <label className="block text-xs text-muted mb-1.5">Model</label>
          <input className="w-full bg-base border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent transition-colors" value={form.model} onChange={(e) => handleChange("model", e.target.value)} />
        </div>
        <div>
          <label className="block text-xs text-muted mb-1.5">API Token</label>
          <input type="password" className="w-full bg-base border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent transition-colors" placeholder="sk-..." value={form.token} onChange={(e) => handleChange("token", e.target.value)} />
        </div>
      </div>
    </div>
  );
}
