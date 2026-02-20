import { useNavigate } from "react-router-dom";
import ParticlesBackground from "@/components/ParticlesBackground";
import LiveClock from "@/components/LiveClock";
import { htbChallenges, labPlatforms } from "@/data/challenges";
import { markdownWriteups } from "@/data/markdownWriteups";
import TopNav from "@/components/TopNav";
import SiteFooter from "@/components/SiteFooter";

const diffConfig: Record<string, { color: string; border: string; bg: string }> = {
  easy: { color: "text-diff-easy", border: "border-diff-easy/30", bg: "bg-diff-easy/10" },
  medium: { color: "text-diff-medium", border: "border-diff-medium/30", bg: "bg-diff-medium/10" },
  hard: { color: "text-diff-hard", border: "border-diff-hard/30", bg: "bg-diff-hard/10" },
  insane: { color: "text-diff-insane", border: "border-diff-insane/30", bg: "bg-diff-insane/10" },
};

const HackTheBox = () => {
  const navigate = useNavigate();

  const merged = (() => {
    const out = [...htbChallenges];
    const bySlug = new Set(out.map((x) => x.slug).filter(Boolean) as string[]);

    const mdLabs = Object.values(markdownWriteups)
      .filter((m) => (m.platform || m.ctf || "").toLowerCase().includes("hackthebox"))
      .map((m) => ({
        title: m.title,
        difficulty: (m.difficulty ?? "easy") as any,
        hasWriteup: true,
        slug: m.slug,
        note: undefined,
      }));

    for (const m of mdLabs) {
      if (m.slug && !bySlug.has(m.slug)) {
        out.unshift(m as any);
        bySlug.add(m.slug);
      }
    }

    return out;
  })();

  const htbProfile = labPlatforms.find((p) => p.platform.toLowerCase().includes("hack"));

  return (
    <div className="min-h-screen relative grid-bg scanlines page-aurora">
      <ParticlesBackground />
      <LiveClock />

      <TopNav backTo="/" title="Hack The Box" subtitle="platform writeups" />

      <main className="max-w-7xl mx-auto px-6 md:px-12 pt-28 pb-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-8">
            <header className="pb-10" style={{ animation: "float-up 0.8s ease forwards" }}>
              <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.3em] mb-3">
                // platform writeups
              </p>
              <h1 className="font-display text-5xl md:text-7xl text-primary leading-none tracking-tighter animate-glitch mb-4">
                Hack The Box
              </h1>
              <p className="text-sm text-muted-foreground font-mono">
                Solved Machines • Writeups by <span className="text-primary">syndro</span>
              </p>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {merged.length === 0 ? (
                <div className="col-span-full rounded-2xl border border-border/60 bg-card/40 p-6">
                  <p className="text-sm font-mono text-muted-foreground">
                    No Hack The Box writeups yet.
                  </p>
                </div>
              ) : (
                merged.map((c, i) => {
                  const diff = diffConfig[c.difficulty];
                  const isClickable = c.hasWriteup && c.slug;
                  return (
                    <div
                      key={c.title}
                      className={`group bg-card/40 glass rounded-md border border-border/50 p-5 transition-all duration-500 relative overflow-hidden
                        hover:bg-card/70 hover:border-border hover:shadow-[0_8px_30px_hsl(var(--neon-glow))]
                        flex flex-col min-h-[180px] ${isClickable ? "cursor-pointer" : "cursor-default opacity-70"}`}
                      style={{ animation: `slide-up 0.5s ease forwards`, animationDelay: `${i * 40}ms`, opacity: 0 }}
                      onClick={() => isClickable && navigate(`/writeup/${c.slug}`)}
                    >
                      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-primary/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                      <h3 className="font-sans text-base font-semibold text-foreground group-hover:text-primary transition-colors break-words leading-snug">
                        {c.title}
                      </h3>
                      <p className="text-[10px] font-mono text-muted-foreground/40 mt-1.5 relative pb-2">
                        {isClickable ? "Click to read writeup" : c.note || "Coming soon"}
                        <span className="absolute left-0 bottom-0 w-12 h-px bg-gradient-to-r from-primary/20 to-transparent" />
                      </p>

                      {c.note && (
                        <div className="mt-auto mb-12 p-2.5 rounded-md border border-primary/10 bg-primary/5 flex items-start gap-2">
                          <span className="w-1.5 h-1.5 mt-1.5 rounded-full bg-primary shadow-[0_0_8px_hsl(var(--neon))] flex-shrink-0" />
                          <span className="text-xs text-muted-foreground line-clamp-2">{c.note}</span>
                        </div>
                      )}

                      <div
                        className={`absolute left-5 bottom-4 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-mono font-bold uppercase tracking-widest border ${diff.color} ${diff.border} ${diff.bg}`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current shadow-[0_0_6px_currentColor]" />
                        {c.difficulty}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <aside className="lg:col-span-4 space-y-4 lg:sticky lg:top-24">
            <div className="bg-card/50 glass border border-border/60 rounded-2xl p-5">
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-3">Overview</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-border/60 bg-background/20 p-3">
                  <div className="text-2xl font-display text-primary leading-none">{merged.length}</div>
                  <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-muted-foreground mt-1">machines</div>
                </div>
                <div className="rounded-xl border border-border/60 bg-background/20 p-3">
                  <div className="text-2xl font-display text-primary leading-none">HTB</div>
                  <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-muted-foreground mt-1">
                    {htbProfile?.username ? `@${htbProfile.username}` : "username not set"}
                  </div>
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-border/60 bg-background/20 p-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-3">Difficulty legend</p>
                <div className="space-y-2">
                  {(["easy", "medium", "hard", "insane"] as const).map((d) => (
                    <div key={d} className="flex items-center gap-3">
                      <span className={`inline-block h-2 w-2 rounded-full ${diffConfig[d].color}`} />
                      <span className="text-xs font-mono uppercase tracking-[0.18em] text-muted-foreground">{d}</span>
                      <span className="ml-auto text-xs font-mono text-primary/80">{merged.filter((c) => c.difficulty === d).length}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-card/50 glass border border-border/60 rounded-2xl p-5">
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-3">Tips</p>
              <ul className="space-y-2 text-sm text-foreground/85">
                <li className="flex gap-2"><span className="text-primary/80">•</span>Inactive</li>
              </ul>
            </div>
          </aside>
        </div>
      </main>

      <SiteFooter />

      </div>
  );
};

export default HackTheBox;
