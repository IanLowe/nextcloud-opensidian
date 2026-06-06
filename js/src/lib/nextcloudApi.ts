import type { VaultFile } from "../types/vault";

// Nextcloud globals
declare const OC: { generateUrl: (path: string) => string; requestToken: string };

function url(path: string): string {
  return OC.generateUrl(`/apps/opensidian${path}`);
}

export function csrfHeaders(): HeadersInit {
  return {
    "Content-Type": "application/json",
    "requesttoken": OC.requestToken,
  };
}

async function checkOk(res: Response): Promise<void> {
  if (!res.ok) {
    let msg = res.statusText;
    try {
      const body = await res.json();
      if (body?.error) msg = body.error;
    } catch { /* ignore */ }
    throw new Error(`HTTP ${res.status}: ${msg}`);
  }
}

// ── File operations ───────────────────────────────────────────────────────────

export async function listFiles(vaultPath: string): Promise<VaultFile[]> {
  const res = await fetch(
    url(`/api/v1/files?path=${encodeURIComponent(vaultPath)}`),
    { headers: { "requesttoken": OC.requestToken } }
  );
  await checkOk(res);
  return res.json();
}

export async function readFile(path: string): Promise<string> {
  const res = await fetch(
    url(`/api/v1/file?path=${encodeURIComponent(path)}`),
    { headers: { "requesttoken": OC.requestToken } }
  );
  await checkOk(res);
  const data = await res.json();
  return data.content as string;
}

export async function readFilesBatch(paths: string[]): Promise<Map<string, string | null>> {
  const results = await Promise.allSettled(paths.map((p) => readFile(p)));
  const map = new Map<string, string | null>();
  paths.forEach((p, i) => {
    const r = results[i];
    map.set(p, r.status === "fulfilled" ? r.value : null);
  });
  return map;
}

export async function writeFile(path: string, content: string): Promise<void> {
  const res = await fetch(url("/api/v1/file"), {
    method: "POST",
    headers: csrfHeaders(),
    body: JSON.stringify({ path, content }),
  });
  await checkOk(res);
}

export async function createFile(path: string): Promise<void> {
  await writeFile(path, "");
}

export async function deleteFile(path: string): Promise<void> {
  const res = await fetch(
    url(`/api/v1/file?path=${encodeURIComponent(path)}`),
    { method: "DELETE", headers: csrfHeaders() }
  );
  await checkOk(res);
}

export async function renameFile(path: string, newPath: string): Promise<void> {
  const res = await fetch(url("/api/v1/file/rename"), {
    method: "PUT",
    headers: csrfHeaders(),
    body: JSON.stringify({ path, newPath }),
  });
  await checkOk(res);
}

export async function createDirectory(path: string): Promise<void> {
  const res = await fetch(url("/api/v1/directory"), {
    method: "POST",
    headers: csrfHeaders(),
    body: JSON.stringify({ path }),
  });
  await checkOk(res);
}

// ── Settings ──────────────────────────────────────────────────────────────────

export interface ServerSettings {
  vaultPath: string;
  llmSettings: {
    url: string;
    model: string;
    systemPrompt: string;
    userPrompt: string;
  };
}

export async function getSettings(): Promise<ServerSettings> {
  const res = await fetch(url("/api/v1/settings"), {
    headers: { "requesttoken": OC.requestToken },
  });
  await checkOk(res);
  return res.json();
}

export async function saveSettings(data: Partial<ServerSettings>): Promise<void> {
  const res = await fetch(url("/api/v1/settings"), {
    method: "POST",
    headers: csrfHeaders(),
    body: JSON.stringify(data),
  });
  await checkOk(res);
}

// ── Path helpers (mirrors tauriFs path utilities) ─────────────────────────────

export function basename(path: string, ext = ""): string {
  const name = path.replace(/\\/g, "/").split("/").pop() ?? path;
  if (ext && name.endsWith(ext)) return name.slice(0, -ext.length);
  return name;
}

export function dirname(path: string): string {
  const normalized = path.replace(/\\/g, "/");
  const idx = normalized.lastIndexOf("/");
  return idx >= 0 ? normalized.slice(0, idx) : "";
}
