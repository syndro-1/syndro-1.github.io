import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import ParticlesBackground from "@/components/ParticlesBackground";
import LiveClock from "@/components/LiveClock";
import TopNav from "@/components/TopNav";
import SiteFooter from "@/components/SiteFooter";
import { labPlatforms, myCTFs } from "@/data/challenges";
import { writeupIndex } from "@/data/writeupIndex";

const Events = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState<"ctf" | "labs">("ctf");

  const solvesByEvent = useMemo(() => {
    const map: Record<string, number> = {};
    for (const c of writeupIndex) map[c.ctf] = (map[c.ctf] || 0) + 1;
    return map;
  }, []);

  return (
    <div className="min-h-screen relative grid-bg scanlines page-aurora">
      <ParticlesBackground />
      <LiveClock />

      <TopNav backTo="/" title="Events" subtitle="CTFs • Labs" />

      <main className="max-w-7xl mx-auto px-6 md:px-12 pt-28 pb-8 relative z-10">
        <header className="mb-10" style={{ animation: "float-up 0.8s ease forwards" }}>
          <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.3em] mb-3">
            // timeline
          </p>
          <h1 className="font-display text-5xl md:text-7xl text-primary leading-none tracking-tighter animate-glitch">
            Events
          </h1>
          <p className="mt-4 text-sm text-muted-foreground font-mono">
            Jump into a CTF event or browse lab platforms.
          </p>
        </header>

        <div className="flex gap-2 mb-8 flex-wrap">
          {([
            { key: "ctf", label: "CTFs" },
            { key: "labs", label: "Labs" },
          ] as const).map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-4 py-1.5 rounded-md text-xs font-mono uppercase tracking-wider transition-all border
                ${tab === t.key ? "bg-primary/10 text-primary border-primary/30" : "bg-transparent text-muted-foreground border-transparent hover:text-foreground hover:bg-muted/30"}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === "ctf" ? (
          <section>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {myCTFs.map((ctf, i) => (
                <button
                  key={ctf.name}
                  onClick={() => ctf.route && navigate(ctf.route)}
                  className="text-left group bg-card/40 glass rounded-md border border-border/50 p-5 transition-all duration-500
                    hover:bg-card/70 hover:border-border hover:shadow-[0_8px_30px_hsl(var(--neon-glow))]"
                  style={{ animation: `slide-up 0.5s ease forwards`, animationDelay: `${i * 40}ms`, opacity: 0 }}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="font-sans text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                      {ctf.name}
                    </h3>
                    <span className="text-[10px] font-mono uppercase tracking-[0.22em] text-muted-foreground/70">
                      {ctf.status}
                    </span>
                  </div>
                  <div className="text-xs font-mono text-muted-foreground">
                    <span className="text-primary/70">{solvesByEvent[ctf.name] || 0}</span> solves
                  </div>
                  <div className="mt-4 text-[10px] font-mono text-muted-foreground/50 uppercase tracking-[0.22em]">
                    open →
                  </div>
                </button>
              ))}
            </div>
          </section>
        ) : (
          <section>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {labPlatforms.map((p, i) => (
                <button
                  key={p.platform}
                  onClick={() => p.route && navigate(p.route)}
                  className={`text-left group bg-card/40 glass rounded-md border border-border/50 p-5 transition-all duration-500
                    hover:bg-card/70 hover:border-border hover:shadow-[0_8px_30px_hsl(var(--neon-glow))]
                    ${p.route ? "cursor-pointer" : "opacity-70 cursor-default"}`}
                  style={{ animation: `slide-up 0.5s ease forwards`, animationDelay: `${i * 40}ms`, opacity: 0 }}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="font-sans text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                      {p.platform}
                    </h3>
                    <span className="text-[10px] font-mono uppercase tracking-[0.22em] text-muted-foreground/70">
                      {p.status}
                    </span>
                  </div>
                  <div className="text-xs font-mono text-muted-foreground">
                    {p.username ? (
                      <>
                        @<span className="text-primary/70">{p.username}</span>
                      </>
                    ) : (
                      <span className="text-muted-foreground/60">username not set</span>
                    )}
                  </div>
                  <div className="mt-4 text-[10px] font-mono text-muted-foreground/50 uppercase tracking-[0.22em]">
                    {p.route ? "open →" : "coming soon"}
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}
      </main>

      <SiteFooter />
    </div>
  );
};

export default Events;
