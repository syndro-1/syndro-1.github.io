export type MarkdownWriteupMeta = {
  slug: string;
  title: string;
  /** Display grouping used across the site (CTF event name or lab platform name). */
  ctf: string;
  type?: string;
  /** Optional discriminator for richer UI (used by the local /admin helper). */
  kind?: "ctf" | "lab";
  /** For labs: TryHackMe / HackTheBox (optional but recommended). */
  platform?: "TryHackMe" | "HackTheBox";
  /** For labs: difficulty badge on lists (optional). */
  difficulty?: "easy" | "medium" | "hard" | "insane";
  /** Optional OS label (e.g., Linux/Windows). */
  os?: string;
  /** Optional target line shown under the title. */
  target?: string;
  /** Optional display flag/label shown on the index card */
  flag?: string;
  /**
   * Base URL (ending with /) where images for this writeup live.
   * Example: /writeups/event-slug/writeup-slug/
   */
  baseUrl?: string;
  /**
   * Option A (recommended for GitHub Pages):
   * Path under /public (served as-is by Vite), e.g. /writeups/event/slug/writeup.md
   */
  markdownPath?: string;
  /**
   * Option B (copy/paste friendly):
   * Inline markdown stored directly in the registry.
   * Images must still be served locally from /public.
   */
  markdown?: string;
  /** ISO string used for sorting recent solves (optional) */
  createdAt?: string;
};

/**
 * Markdown-based writeups (used by the local admin uploader).
 *
 * Notes:
 * - keep markdown + images in /public so GitHub Pages works.
 * - do NOT use data:image/...; images must be served locally.
 */
export const markdownWriteups: Record<string, MarkdownWriteupMeta> = {
  // ADMIN-GENERATED-START
  // ADMIN-GENERATED-END
};
