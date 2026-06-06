import type { LLMSettings, ChatMessage } from "../store/llmStore";
import { csrfHeaders } from "./nextcloudApi";

declare const OC: { generateUrl: (path: string) => string };

export async function callLLM(
  settings: LLMSettings,
  messages: Array<{ role: string; content: string }>
): Promise<string> {
  if (!settings.url || !settings.model) {
    throw new Error("LLM not configured. Please set URL and model in settings.");
  }

  // Route through Nextcloud PHP proxy to bypass CSP — supports any OpenAI-compatible endpoint.
  const proxyUrl = OC.generateUrl("/apps/opensidian/api/v1/llmproxy");
  const res = await fetch(proxyUrl, {
    method: "POST",
    headers: csrfHeaders(),
    body: JSON.stringify({
      url:      settings.url,
      model:    settings.model,
      token:    settings.token ?? "",
      messages,
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(`API error ${res.status}: ${text}`);
  }

  const data = await res.json();
  const content = data?.choices?.[0]?.message?.content;
  if (!content) throw new Error("Unexpected API response format");
  return content;
}

export function buildApiMessages(
  systemPrompt: string,
  history: ChatMessage[],
  userMessage: string
) {
  return [
    { role: "system", content: systemPrompt },
    ...history.map((m) => ({ role: m.role, content: m.content })),
    { role: "user", content: userMessage },
  ];
}
