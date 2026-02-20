import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ParticlesBackground from "@/components/ParticlesBackground";
import LiveClock from "@/components/LiveClock";
import TopNav from "@/components/TopNav";
import SiteFooter from "@/components/SiteFooter";
import { myCTFs } from "@/data/challenges";
import { writeupIndex } from "@/data/writeupIndex";

const tagBorderColors: Record<string, string> = {
  web: "border-l-cat-web",
  misc: "border-l-cat-misc",
  crypto: "border-l-cat-crypto",
  pwn: "border-l-cat-pwn",
  forensics: "border-l-cat-forensics",
};

const tagTextColors: Record<string, string> = {
  web: "text-cat-web",
  misc: "text-cat-misc",
  crypto: "text-cat-crypto",
  pwn: "text-cat-pwn",
  forensics: "text-cat-forensics",
};

const titleFromSlug = (s: string) =>
  s
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (m) => m.toUpperCase());

const CTFEvent = () => {
  const { eventSlug } = useParams<{ eventSlug: string }>();
  const navigate = useNavigate();

  const event = useMemo(() => {
    if (!eventSlug) return null;
    return myCTFs.find((e) => e.route === `/ctf/${eventSlug}`) ?? null;
  }, [eventSlug]);

  const eventName = event?.name ?? (eventSlug ? titleFromSlug(eventSlug) : "Event");

  const eventChallenges = useMemo(() => {
    const target = eventName.toLowerCase();
    return writeupIndex.filter((c) => c.ctf.toLowerCase() === target);
  }, [eventName]);

  const categories = useMemo(() => {
    const set = new Set(eventChallenges.map((c) => c.type));
    return Array.from(set);
  }, [eventChallenges]);

  return (
    <div className="min-h-screen relative grid-bg scanlines page-aurora">
      <ParticlesBackground />
      <LiveClock />

      <TopNav backTo="/events" title={eventName} subtitle="ctf writeups" />

      <main className="max-w-7xl mx-auto px-6 md:px-12 pt-28 pb-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-8">
            <header className="pb-10" style={{ animation: "float-up 0.8s ease forwards" }}>
              <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.3em] mb-3">
                // ctf writeups
              </p>
              <h1 className="font-display text-5xl md:text-7xl text-primary leading-none tracking-tighter animate-glitch mb-4">
                {eventName}
              </h1>
              <p className="text-sm text-muted-foreground font-mono">
                Solved challenges • writeups by <span className="text-primary">syndro</span>
              </p>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {eventChallenges.length === 0 ? (
                <div className="col-span-full rounded-2xl border border-border/60 bg-card/40 p-6">
                  <p className="text-sm font-mono text-muted-foreground">No writeups yet for this event.</p>
                </div>
              ) : (
                eventChallenges.map((c, i) => (
                  <div
                    key={`${c.ctf}-${c.title}-${i}`}
                    onClick={() => c.slug && navigate(`/writeup/${c.slug}`)}
                    className={`group bg-card/40 glass rounded-md border border-border/50 p-5 cursor-pointer transition-all duration-500
                      border-l-[3px] ${tagBorderColors[c.type]}
                      hover:bg-card/70 hover:border-border hover:shadow-[0_8px_30px_hsl(var(--neon-glow))]`}
                    style={{ animation: `slide-up 0.5s ease forwards`, animationDelay: `${i * 50}ms`, opacity: 0 }}
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <h3 className="font-sans text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                        {c.title}
                      </h3>
                      <span className={`text-[10px] font-mono font-bold uppercase tracking-widest ${tagTextColors[c.type]} shrink-0`}>
                        {c.type}
                      </span>
                    </div>
                    <p className="font-mono text-xs text-muted-foreground break-all mb-3">
                      <span className="text-muted-foreground/50">flag:</span> <code className="text-primary/80">{c.flag}</code>
                    </p>
                    <span className="text-[10px] font-mono text-muted-foreground/30 group-hover:text-primary/50 transition-colors">
                      read writeup →
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          <aside className="lg:col-span-4 space-y-4 lg:sticky lg:top-24">
            <div className="bg-card/50 glass border border-border/60 rounded-2xl p-5">
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-3">Event</p>
              <div className="rounded-2xl border border-border/60 bg-background/20 p-4">
                <div className="text-lg font-display text-primary leading-none">{eventName}</div>
                <div className="text-[10px] font-mono text-muted-foreground/70 uppercase tracking-[0.22em] mt-2">
                  {eventChallenges.length} solves
                  {categories.length ? ` • ${categories.join(" + ")}` : ""}
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-border/60 bg-background/20 p-3">
                  <div className="text-2xl font-display text-primary leading-none">{eventChallenges.length}</div>
                  <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-muted-foreground mt-1">writeups</div>
                </div>
                <div className="rounded-xl border border-border/60 bg-background/20 p-3">
                  <div className="text-2xl font-display text-primary leading-none">{categories.length}</div>
                  <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-muted-foreground mt-1">categories</div>
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-border/60 bg-background/20 p-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-3">Category split</p>
                {categories.length === 0 ? (
                  <div className="text-xs font-mono text-muted-foreground/70">—</div>
                ) : (
                  categories.map((t) => (
                    <div key={t} className="flex items-center gap-3 py-1">
                      <span className={`inline-block h-2 w-2 rounded-full ${tagTextColors[t]}`} />
                      <span className="text-xs font-mono uppercase tracking-[0.18em] text-muted-foreground">{t}</span>
                      <span className="ml-auto text-xs font-mono text-primary/80">
                        {eventChallenges.filter((c) => c.type === t).length}
                      </span>
                    </div>
                  ))
                )}
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

export default CTFEvent;
