import { useNavigate } from "react-router-dom";
import ParticlesBackground from "@/components/ParticlesBackground";
import LiveClock from "@/components/LiveClock";
import { patriotChallenges } from "@/data/challenges";
import TopNav from "@/components/TopNav";
import SiteFooter from "@/components/SiteFooter";

const tagConfig: Record<string, { color: string; border: string }> = {
  web: { color: "text-cat-web", border: "border-l-cat-web" },
  misc: { color: "text-cat-misc", border: "border-l-cat-misc" },
};

const PatriotCTF = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative grid-bg scanlines page-aurora">
      <ParticlesBackground />
      <LiveClock />

      <TopNav backTo="/" title="PatriotCTF 2025" subtitle="ctf writeups" />

      {/* Header */}
      <main className="max-w-7xl mx-auto px-6 md:px-12 pt-28 pb-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-8">
            <header className="pb-10" style={{ animation: "float-up 0.8s ease forwards" }}>
        <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.3em] mb-3">
          // ctf writeups
        </p>
        <h1 className="font-display text-5xl md:text-7xl text-primary leading-none tracking-tighter animate-glitch mb-4">
          PatriotCTF
        </h1>
        <p className="text-sm text-muted-foreground font-mono">
          Solved Challenges • Writeups by <span className="text-primary">syndro</span>
        </p>
      </header>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {patriotChallenges.map((c, i) => {
          const tag = tagConfig[c.type];
          return (
            <div
              key={c.title}
              onClick={() => navigate(`/writeup/${c.slug}`)}
              className={`group bg-card/40 glass rounded-md border border-border/50 border-l-[3px] ${tag.border} p-5 cursor-pointer transition-all duration-500
                hover:bg-card/70 hover:border-border hover:shadow-[0_8px_30px_hsl(var(--neon-glow))]`}
              style={{ animation: `slide-up 0.5s ease forwards`, animationDelay: `${i * 50}ms`, opacity: 0 }}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <h3 className="font-sans text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                  {c.title}
                </h3>
                <span className={`text-[10px] font-mono font-bold uppercase tracking-widest ${tag.color} shrink-0`}>
                  {c.type}
                </span>
              </div>
              <p className="font-mono text-xs text-muted-foreground break-all mb-3">
                <span className="text-muted-foreground/50">flag:</span>{" "}
                <code className="text-primary/80">{c.flag}</code>
              </p>
              <span className="text-[10px] font-mono text-muted-foreground/30 group-hover:text-primary/50 transition-colors">
                read writeup →
              </span>
            </div>
          );
        })}

            </div>
          </div>

          <aside className="lg:col-span-4 space-y-4 lg:sticky lg:top-24">
            <div className="bg-card/50 glass border border-border/60 rounded-2xl p-5">
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-3">Event</p>
              <div className="rounded-2xl border border-border/60 bg-background/20 p-4">
                <div className="text-lg font-display text-primary leading-none">PatriotCTF 2025</div>
                  <div className="text-[10px] font-mono text-muted-foreground/70 uppercase tracking-[0.22em] mt-2">{patriotChallenges.length} solves • web + misc</div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-border/60 bg-background/20 p-3">
                  <div className="text-2xl font-display text-primary leading-none">{patriotChallenges.length}</div>
                  <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-muted-foreground mt-1">writeups</div>
                </div>
                <div className="rounded-xl border border-border/60 bg-background/20 p-3">
                  <div className="text-2xl font-display text-primary leading-none">{new Set(patriotChallenges.map((c) => c.type)).size}</div>
                  <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-muted-foreground mt-1">categories</div>
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-border/60 bg-background/20 p-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-3">Category split</p>
                {(Object.keys(tagConfig) as Array<keyof typeof tagConfig>).map((t) => (
                  <div key={t} className="flex items-center gap-3 py-1">
                    <span className={`inline-block h-2 w-2 rounded-full ${tagConfig[t].color}`} />
                    <span className="text-xs font-mono uppercase tracking-[0.18em] text-muted-foreground">{t}</span>
                    <span className="ml-auto text-xs font-mono text-primary/80">{patriotChallenges.filter((c) => c.type === t).length}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-card/50 glass border border-border/60 rounded-2xl p-5">
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-3">Navigation</p>
              <button
                onClick={() => navigate("/")}
                className="w-full rounded-2xl border border-border/60 bg-background/20 px-4 py-3 text-left hover:bg-primary/5 hover:border-primary/30 transition-colors"
              >
                <div className="text-sm font-semibold text-foreground">← Back to home</div>
                <div className="text-[10px] font-mono text-muted-foreground/70 uppercase tracking-[0.22em] mt-1">main index</div>
              </button>
            </div>
          </aside>
        </div>
      </main>

      <SiteFooter />

      </div>
  );
};

export default PatriotCTF;