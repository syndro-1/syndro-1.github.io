import { challenges, thmChallenges, htbChallenges, type Challenge } from "@/data/challenges";
import { markdownWriteups } from "@/data/markdownWriteups";

export type WriteupIndexItem = Challenge & {
  source: "json" | "markdown" | "lab";
  createdAt?: string;
  difficulty?: "easy" | "medium" | "hard" | "insane";
  kind?: "ctf" | "lab";
  platform?: "TryHackMe" | "HackTheBox";
};

const normalizeType = (t?: string): Challenge["type"] => {
  const v = (t ?? "web").toLowerCase();
  if (v === "web" || v === "misc" || v === "crypto" || v === "pwn" || v === "forensics") return v;
  return "web";
};

/**
 * Unified writeup list used for index cards + stats + recent solves.
 *
 * - JSON writeups come from `challenges`.
 * - Markdown writeups come from `markdownWriteups`.
 * - Solved labs (with writeups) are mapped in as "misc".
 *
 * Note: if a lab writeup exists in `markdownWriteups`, we avoid adding a duplicate "lab" entry.
 */
export const writeupIndex: WriteupIndexItem[] = (() => {
  const mdSlugs = new Set(Object.keys(markdownWriteups));

  const jsonItems: WriteupIndexItem[] = challenges.map((c) => ({ ...c, source: "json" as const }));

  const mdItems: WriteupIndexItem[] = Object.values(markdownWriteups).map((m) => ({
    title: m.title,
    flag: m.flag ?? "WRITEUP",
    type: normalizeType(m.type),
    ctf: m.ctf,
    slug: m.slug,
    createdAt: m.createdAt,
    difficulty: m.difficulty,
    kind: m.kind,
    platform: m.platform,
    source: "markdown" as const,
  }));

  const thmItems: WriteupIndexItem[] = thmChallenges
    .filter((t) => t.hasWriteup && Boolean(t.slug) && !mdSlugs.has(String(t.slug)))
    .map((t) => ({
      title: t.title,
      flag: "LAB",
      type: "misc" as const,
      ctf: "TryHackMe",
      slug: t.slug,
      source: "lab" as const,
    }));

  const htbItems: WriteupIndexItem[] = htbChallenges
    .filter((t) => t.hasWriteup && Boolean(t.slug) && !mdSlugs.has(String(t.slug)))
    .map((t) => ({
      title: t.title,
      flag: "LAB",
      type: "misc" as const,
      ctf: "HackTheBox",
      slug: t.slug,
      source: "lab" as const,
    }));

  return [...jsonItems, ...mdItems, ...thmItems, ...htbItems];
})();
