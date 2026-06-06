export type LinkMap = Record<string, Set<string>>;
export type BacklinkMap = Record<string, Set<string>>;

export interface WikiLink {
  target: string;
  alias?: string;
  anchor?: string;
}

export interface BacklinkEntry {
  sourcePath: string;
  sourceName: string;
  excerpt: string;
}
