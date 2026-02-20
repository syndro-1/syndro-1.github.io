import { useState, useCallback, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ParticlesBackground from "@/components/ParticlesBackground";
import LiveClock from "@/components/LiveClock";
import { writeups } from "@/data/writeups";
import { markdownWriteups } from "@/data/markdownWriteups";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import TopNav from "@/components/TopNav";
import SiteFooter from "@/components/SiteFooter";
import SectionChips from "@/components/SectionChips";

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const WriteupPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const writeup = slug ? writeups[slug] : null;
  const mdMeta = slug ? markdownWriteups[slug] : null;

  const [zoomedImg, setZoomedImg] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const [markdown, setMarkdown] = useState<string | null>(null);
  const [markdownError, setMarkdownError] = useState<string | null>(null);

  const mdHeadings = useMemo(() => {
    if (!markdown) return [] as Array<{ text: string; id: string; level: number }>;

    const hs: Array<{ text: string; id: string; level: number }> = [];
    const seen = new Map<string, number>();
    const lines = markdown.split(/\r?\n/);
    let inCode = false;

    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith("```")) {
        inCode = !inCode;
        continue;
      }
      if (inCode) continue;

      const m = /^(#{2,4})\s+(.+)$/.exec(trimmed);
      if (!m) continue;
      const level = m[1].length;
      const text = m[2].trim();

      // Skip a top-level title line if user pasted it.
      if (level === 2 && text.toLowerCase() === (mdMeta?.title ?? "").toLowerCase()) continue;

      const base = slugify(text);
      const n = (seen.get(base) ?? 0) + 1;
      seen.set(base, n);
      const id = n === 1 ? base : `${base}-${n}`;
      hs.push({ text, id, level });
    }
    return hs;
  }, [markdown, mdMeta?.title]);

  const { headings, headingIdByIndex } = useMemo(() => {
    const hs: Array<{ text: string; id: string; level: number }> = [];
    const idxToId: Record<number, string> = {};
    const seen = new Map<string, number>();

    (writeup?.sections ?? []).forEach((s, idx) => {
      if (s.type !== "heading") return;
      const base = slugify(s.content);
      const n = (seen.get(base) ?? 0) + 1;
      seen.set(base, n);
      const id = n === 1 ? base : `${base}-${n}`;
      hs.push({ text: s.content, id, level: 2 });
      idxToId[idx] = id;
    });

    return { headings: hs, headingIdByIndex: idxToId };
  }, [writeup]);

  const targetLine = useMemo(() => {
    const t = writeup?.sections.find((s) => s.type === "text" && /^\s*Target:/i.test(s.content));
    return t ? t.content.replace(/^\s*Target:\s*/i, "").trim() : null;
  }, [writeup]);

  const mdSubtitle = useMemo(() => {
    if (!mdMeta) return "";
    const bits: string[] = [];

    // If the admin stored richer meta, use it; otherwise fall back to the legacy ctf string.
    bits.push(mdMeta.platform || mdMeta.ctf);
    if (mdMeta.os) bits.push(mdMeta.os);
    if (mdMeta.difficulty) bits.push(mdMeta.difficulty);
    if (mdMeta.target) bits.push(`target: ${mdMeta.target}`);
    return bits.filter(Boolean).join(" • ");
  }, [mdMeta]);

  const parentPath = useMemo(() => {
    const meta = (writeup?.meta ?? mdMeta?.ctf ?? "").toLowerCase();
    const base = (writeup?.baseImageUrl ?? "").toLowerCase();

    if (base.includes("/labs/tryhackme/") || base.includes("/ctf/tryhackme/") || meta.includes("tryhackme") || meta.includes("thm")) return "/tryhackme";
    if (base.includes("/labs/hackthebox/") || meta.includes("hack the box") || meta.includes("hackthebox") || meta.includes("htb")) return "/hackthebox";
    if (base.includes("/ctf/patriotctf") || meta.includes("patriotctf")) return "/patriotctf2025";
    if (base.includes("/ctf/nite") || meta.includes("nitectf")) return "/nitectf2025";
    return "/";
  }, [writeup, mdMeta]);

  const resolveImageUrl = useCallback(
    (src: string) => {
      if (!writeup?.baseImageUrl) return src;
      if (src.startsWith("http") || src.startsWith("/")) return src;
      return encodeURI(`${writeup.baseImageUrl}${src}`);
    },
    [writeup]
  );

  const mdBaseUrl = useMemo(() => {
    if (mdMeta?.baseUrl) return mdMeta.baseUrl;
    if (!mdMeta?.markdownPath) return undefined;
    return mdMeta.markdownPath.replace(/\/[^/]*$/, "/");
  }, [mdMeta?.baseUrl, mdMeta?.markdownPath]);

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const scrollTop = el.scrollTop;
      const scrollHeight = el.scrollHeight - el.clientHeight;
      const p = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
      setProgress(Math.max(0, Math.min(100, p)));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    let alive = true;
    const run = async () => {
      if (!mdMeta) return;
      setMarkdown(null);
      setMarkdownError(null);
      try {
        // Inline markdown (copy/paste friendly)
        if (mdMeta.markdown) {
          if (alive) setMarkdown(mdMeta.markdown);
          return;
        }

        if (!mdMeta.markdownPath) throw new Error("Missing markdownPath");
        const res = await fetch(mdMeta.markdownPath, { cache: "no-store" });
        if (!res.ok) throw new Error(`Failed to load markdown (${res.status})`);
        const txt = await res.text();
        if (alive) setMarkdown(txt);
      } catch (e: any) {
        if (alive) setMarkdownError(e?.message ?? "Failed to load markdown");
      }
    };
    run();
    return () => {
      alive = false;
    };
  }, [mdMeta]);

  if (!writeup && !mdMeta) {
    return (
      <div className="min-h-screen grid-bg scanlines page-aurora flex items-center justify-center">
        <ParticlesBackground />
        <div className="text-center">
          <h1 className="font-display text-4xl text-primary mb-4">Writeup not found</h1>
          <button onClick={() => navigate("/")} className="text-sm font-mono text-primary hover:underline">
            ← Back to portfolio
          </button>
        </div>
      </div>
    );
  }

  const pageTitle = writeup?.title ?? mdMeta?.title ?? "Writeup";
  const pageSubtitle = writeup?.meta ?? mdSubtitle ?? mdMeta?.ctf ?? "";

  return (
    <div className="min-h-screen relative grid-bg scanlines page-aurora">
      <ParticlesBackground />
      <LiveClock />

      {/* Reading progress */}
      <div className="fixed top-0 left-0 right-0 z-[60] h-[3px] bg-primary/10">
        <div
          className="h-full bg-primary shadow-[0_0_24px_hsl(var(--neon-glow))] transition-[width] duration-100"
          style={{ width: `${progress}%` }}
        />
      </div>

      <TopNav
        backTo={parentPath}
        title={pageTitle}
        subtitle={targetLine ? `${pageSubtitle} • target: ${targetLine}` : pageSubtitle}
      />

      {/* Content */}
      <main className="max-w-7xl mx-auto px-6 md:px-12 pt-28 pb-10 relative z-10">
        <div className="relative bg-card/30 glass border border-border/60 rounded-[2rem] p-6 md:p-10 shadow-[0_30px_90px_rgba(0,0,0,0.55)]">
          <div className="max-w-4xl mx-auto">
            <span id="top" className="block scroll-mt-24" />

            <header className="mb-10" style={{ animation: "float-up 0.8s ease forwards" }}>
              <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.3em] mb-3">
                // challenge writeup
              </p>

              <h1 className="font-display text-4xl md:text-6xl text-primary leading-none tracking-tighter text-glow-sm mb-4">
                {pageTitle}
              </h1>

              <p className="text-sm text-muted-foreground font-mono">
                {pageSubtitle}
                {targetLine ? (
                  <span className="text-muted-foreground">
                    {" "}
                    • Target: <span className="text-primary/90">{targetLine}</span>
                  </span>
                ) : null}
              </p>

              {/* Quick badges for markdown writeups */}
              {!writeup && mdMeta ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {(mdMeta.platform ? [mdMeta.platform] : []).map((b) => (
                    <span
                      key={`p-${b}`}
                      className="inline-flex items-center rounded-xl border border-border/60 bg-background/20 px-3 py-1.5 text-[10px] font-mono uppercase tracking-[0.22em] text-primary/80"
                    >
                      {b}
                    </span>
                  ))}
                  {mdMeta.os ? (
                    <span className="inline-flex items-center rounded-xl border border-border/60 bg-background/20 px-3 py-1.5 text-[10px] font-mono uppercase tracking-[0.22em] text-muted-foreground">
                      {mdMeta.os}
                    </span>
                  ) : null}
                  {mdMeta.difficulty ? (
                    <span className="inline-flex items-center rounded-xl border border-primary/25 bg-primary/5 px-3 py-1.5 text-[10px] font-mono uppercase tracking-[0.22em] text-primary">
                      {mdMeta.difficulty}
                    </span>
                  ) : null}
                  {mdMeta.target ? (
                    <span className="inline-flex items-center rounded-xl border border-border/60 bg-background/20 px-3 py-1.5 text-[10px] font-mono uppercase tracking-[0.22em] text-muted-foreground">
                      target: <span className="ml-1 text-primary/85">{mdMeta.target}</span>
                    </span>
                  ) : null}
                </div>
              ) : null}

              {/* RabbitStore-style chips (JSON + Markdown) */}
              {writeup && headings.length > 0 ? <SectionChips items={headings} /> : null}
              {!writeup && mdHeadings.length > 0 ? <SectionChips items={mdHeadings} /> : null}
            </header>

            {/* BODY */}
            <div
              className="space-y-6"
              style={{ animation: "slide-up 0.5s ease forwards", animationDelay: "0.15s", opacity: 0 }}
            >
              {writeup ? (
                writeup.sections.map((section, i) => {
                  switch (section.type) {
                    case "subheading":
                      return (
                        <h3
                          key={i}
                          className="scroll-mt-24 font-display text-base md:text-lg text-primary/90 tracking-tight mt-8 mb-3"
                        >
                          {section.content}
                        </h3>
                      );
                    case "heading": {
                      const id = headingIdByIndex[i] || slugify(section.content);
                      return (
                        <h2
                          key={i}
                          id={id}
                          className="scroll-mt-24 font-display text-xl md:text-2xl text-primary tracking-tight mt-12 mb-4 pt-4 border-t border-border/30"
                        >
                          {section.content}
                        </h2>
                      );
                    }
                    case "text":
                      return (
                        <p key={i} className="text-foreground/90 leading-relaxed text-sm md:text-base">
                          {section.content}
                        </p>
                      );
                    case "code":
                      return (
                        <pre
                          key={i}
                          className="bg-card/80 border border-border rounded-lg p-5 overflow-x-auto font-mono text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap"
                        >
                          <code>{section.content}</code>
                        </pre>
                      );
                    case "flag":
                      return (
                        <div
                          key={i}
                          className="bg-primary/5 border-2 border-dashed border-primary/40 rounded-lg p-6 text-center my-10"
                        >
                          <p className="font-mono text-lg md:text-xl font-bold text-primary tracking-wider text-glow-sm">
                            {section.content}
                          </p>
                        </div>
                      );
                    case "list":
                      return (
                        <ul
                          key={i}
                          className="list-disc list-inside space-y-1 text-foreground/90 text-sm md:text-base pl-2"
                        >
                          {section.items?.map((item, j) => (
                            <li key={j}>{item}</li>
                          ))}
                        </ul>
                      );
                    case "image":
                      return (
                        <figure key={i} className="my-6">
                          <img
                            src={resolveImageUrl(section.content)}
                            alt={section.alt || "Screenshot"}
                            className="block max-w-full rounded-xl mx-auto border-2 border-primary/20 shadow-[0_20px_60px_rgba(0,0,0,0.6)] cursor-zoom-in transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_25px_80px_hsl(var(--neon-glow))] hover:border-primary/40"
                            loading="lazy"
                            onClick={() => setZoomedImg(resolveImageUrl(section.content))}
                          />
                          {section.alt && (
                            <figcaption className="text-center text-xs text-muted-foreground/60 mt-2 font-mono">
                              {section.alt}
                            </figcaption>
                          )}
                        </figure>
                      );
                    case "callout":
                      return (
                        <div key={i} className="border border-green-500/30 bg-green-500/5 rounded-lg p-4 my-4">
                          <p className="text-sm text-foreground/90 leading-relaxed">
                            <span className="text-green-400 font-bold">💡 </span>
                            {section.content}
                          </p>
                        </div>
                      );
                    default:
                      return null;
                  }
                })
              ) : (
                <div className="space-y-4">
                  {markdownError ? (
                    <div className="rounded-2xl border border-red-500/30 bg-red-500/5 p-4">
                      <p className="text-sm font-mono text-red-200">{markdownError}</p>
                    </div>
                  ) : markdown == null ? (
                    <div className="rounded-2xl border border-border/60 bg-card/40 p-4">
                      <p className="text-sm font-mono text-muted-foreground">Loading markdown…</p>
                    </div>
                  ) : (
                    <MarkdownRenderer
                      markdown={markdown}
                      baseUrl={mdBaseUrl}
                      onImageClick={(src) => setZoomedImg(src)}
                    />
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />

      {/* Image Zoom Modal */}
      {zoomedImg && (
        <div
          className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-sm flex items-center justify-center p-5 cursor-zoom-out"
          onClick={() => setZoomedImg(null)}
        >
          <button
            className="absolute top-5 right-5 w-11 h-11 rounded-xl bg-white/10 border border-white/15 text-white text-2xl grid place-items-center hover:bg-white/20 transition-colors"
            onClick={() => setZoomedImg(null)}
          >
            ×
          </button>
          <img
            src={zoomedImg}
            alt="Zoomed"
            className="max-w-[min(1100px,96vw)] max-h-[92vh] rounded-2xl border-2 border-primary/30 shadow-[0_30px_90px_rgba(0,0,0,0.8)]"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      </div>
  );
};

export default WriteupPage;
