import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import ParticlesBackground from "@/components/ParticlesBackground";
import LiveClock from "@/components/LiveClock";
import InfoPanel from "@/components/InfoPanel";
import CyberModal from "@/components/CyberModal";
import TopNav from "@/components/TopNav";
import SiteFooter from "@/components/SiteFooter";
import { myCTFs, labPlatforms, thmChallenges, htbChallenges } from "@/data/challenges";
import { writeupIndex } from "@/data/writeupIndex";

const categoryTabs = ["all", "web", "misc", "crypto", "pwn", "forensics"] as const;
const categoryOnly = ["web", "misc", "crypto", "pwn", "forensics"] as const;

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

const Index = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [ctfModalOpen, setCtfModalOpen] = useState(false);
  const [labsModalOpen, setLabsModalOpen] = useState(false);
  const [visibleCards, setVisibleCards] = useState<Set<number>>(new Set());
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  const filtered = useMemo(
    () =>
      writeupIndex
        .filter((c) => activeTab === "all" || c.type === activeTab)
        .filter(
          (c) =>
            c.title.toLowerCase().includes(search.toLowerCase()) ||
            c.flag.toLowerCase().includes(search.toLowerCase())
        ),
    [activeTab, search]
  );

  const solvesByEvent = useMemo(() => {
    const map: Record<string, number> = {};
    for (const c of writeupIndex) map[c.ctf] = (map[c.ctf] || 0) + 1;
    return map;
  }, []);

  const solvedLabs = useMemo(() => {
    // Anything that lives under the Lab platforms and has a writeup.
    const labItems = writeupIndex
      .filter((w) => w.kind === "lab" || ["TryHackMe", "HackTheBox"].includes(w.ctf) || Boolean(w.platform))
      .map((w) => {
        // Prefer difficulty stored in markdown meta; otherwise fall back to the static lab lists.
        const thm = thmChallenges.find((t) => t.slug && w.slug && t.slug === w.slug);
        const htb = htbChallenges.find((t) => t.slug && w.slug && t.slug === w.slug);

        const difficulty = w.difficulty || thm?.difficulty || htb?.difficulty || "";
        return { ...w, difficulty };
      })
      // Most recent first (if createdAt exists), otherwise stable by title.
      .sort((a, b) => {
        const da = a.createdAt ?? "";
        const db = b.createdAt ?? "";
        if (da && db) return db.localeCompare(da);
        if (da) return -1;
        if (db) return 1;
        return a.title.localeCompare(b.title);
      });

    return labItems.slice(0, 4);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number(entry.target.getAttribute("data-idx"));
            setVisibleCards((prev) => new Set(prev).add(idx));
          }
        });
      },
      { threshold: 0.1 }
    );

    cardsRef.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [filtered]);

  return (
    <div className="min-h-screen relative grid-bg scanlines page-aurora">
      <ParticlesBackground />
      <LiveClock />
      <InfoPanel onChallengeClick={(c) => c.slug && navigate(`/writeup/${c.slug}`)} />

      <TopNav
        onOpenCTFs={() => setCtfModalOpen(true)}
        onOpenLabs={() => setLabsModalOpen(true)}
        rightOffsetClassName="right-0 pr-16"
      />

      <main className="max-w-screen-2xl mx-auto px-6 md:px-10 lg:px-12 pt-28 pb-8 min-h-screen relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-[260px_minmax(0,1fr)_320px] xl:grid-cols-[280px_minmax(0,1fr)_360px] gap-8 xl:gap-10 items-start">
          {/* LEFT SIDEBAR (CTFs/Labs moved here) */}
          <aside className="space-y-4 lg:sticky lg:top-24">
            <div className="bg-card/50 glass border border-border/60 rounded-2xl p-5 overflow-hidden">
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-4">Quick access</p>
              <div className="grid grid-cols-1 gap-3">
                <button
                  onClick={() => setCtfModalOpen(true)}
                  className="rounded-2xl border border-border/60 bg-background/20 px-4 py-3 text-left hover:bg-primary/5 hover:border-primary/30 transition-colors"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-sm font-semibold text-foreground">CTFs</div>
                    <span className="text-[10px] font-mono text-primary/70 uppercase tracking-[0.22em]">open</span>
                  </div>
                  <div className="text-xs font-mono text-muted-foreground mt-1">{myCTFs.length} events</div>
                </button>
                <button
                  onClick={() => setLabsModalOpen(true)}
                  className="rounded-2xl border border-border/60 bg-background/20 px-4 py-3 text-left hover:bg-primary/5 hover:border-primary/30 transition-colors"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-sm font-semibold text-foreground">Labs</div>
                    <span className="text-[10px] font-mono text-primary/70 uppercase tracking-[0.22em]">open</span>
                  </div>
                  <div className="text-xs font-mono text-muted-foreground mt-1">{labPlatforms.length} platforms</div>
                </button>
              </div>
            </div>

            {/* Solved Labs (auto-updates from markdownWriteups + lab lists) */}
            <div className="bg-card/50 glass border border-border/60 rounded-2xl p-5">
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-3">Solved Labs</p>
              <div className="space-y-2">
                {solvedLabs.map((lab) => (
                  <button
                    key={lab.title}
                    onClick={() => lab.slug && navigate(`/writeup/${lab.slug}`)}
                    className="w-full text-left rounded-xl border border-border/60 bg-background/20 px-4 py-3 hover:bg-primary/5 hover:border-primary/30 transition-colors"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-sm font-semibold text-foreground truncate">{lab.title}</div>
                      <span className="text-[10px] font-mono uppercase tracking-[0.22em] text-primary/70">
                        {(lab as any).difficulty || "solved"}
                      </span>
                    </div>
                    <div className="text-[10px] font-mono text-muted-foreground/70 uppercase tracking-[0.22em] mt-1 truncate">
                      {lab.platform || lab.ctf}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* MAIN */}
          <div className="min-w-0">
            {/* Hero */}
            <header className="mb-16" style={{ animation: "float-up 0.8s ease forwards" }}>
              <div className="mb-6">
                <p className="font-mono text-xs text-muted-foreground uppercase tracking-[0.3em] mb-4">
                  // cybersecurity portfolio
                </p>
                <h1 className="font-display text-6xl md:text-8xl lg:text-9xl text-primary leading-none tracking-tighter animate-glitch">
                  Syndro
                </h1>
              </div>

              <div className="mt-10 bg-card/60 glass rounded-md border border-border p-5 md:p-6 max-w-xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-primary via-primary/50 to-transparent" />
                <div className="absolute top-0 left-0 w-px h-full bg-gradient-to-b from-primary to-transparent" />
                <div className="font-mono text-sm leading-relaxed space-y-1.5">
                  <p className="text-muted-foreground">
                    <span className="text-primary/60">$</span> whoami
                  </p>
                  <p className="text-primary font-medium pl-4">Syndro</p>
                  <p className="text-muted-foreground">
                    <span className="text-primary/60">$</span> cat bio.txt
                  </p>
                  <p className="text-foreground/90 pl-4">
                    CTF player • Doing web most of the time • Student at AOU
                    <span className="animate-blink text-primary">█</span>
                  </p>
                </div>
              </div>
            </header>

            {/* Writeups Section */}
            <section>
              <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 mb-10">
                <div>
                  <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.3em] mb-2">
                    // challenge writeups
                  </p>
                  <h2 className="font-display text-3xl md:text-4xl text-foreground tracking-tight">
                    Write<span className="text-primary">ups</span>
                  </h2>
                </div>
                <div className="relative">
                  <input
                    type="search"
                    placeholder="Search..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="bg-card/60 glass border border-border rounded-md pl-4 pr-4 py-2 text-foreground text-sm w-64 font-mono placeholder:text-muted-foreground/40
                      focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/10 transition-all"
                  />
                </div>
              </div>

              {/* Tabs */}
              <div className="flex gap-1 mb-8 flex-wrap">
                {categoryTabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-1.5 rounded-md text-xs font-mono uppercase tracking-wider transition-all border
                      ${
                        activeTab === tab
                          ? "bg-primary/10 text-primary border-primary/30"
                          : "bg-transparent text-muted-foreground border-transparent hover:text-foreground hover:bg-muted/30"
                      }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 min-h-[200px]">
                {filtered.length === 0 ? (
                  <p className="col-span-full text-center text-muted-foreground py-16 font-mono text-sm">No challenges found.</p>
                ) : (
                  filtered.map((c, i) => (
                    <div
                      key={`${c.title}-${i}`}
                      ref={(el) => {
                        cardsRef.current[i] = el;
                      }}
                      data-idx={i}
                      onClick={() => c.slug && navigate(`/writeup/${c.slug}`)}
                      className={`group bg-card/40 glass rounded-md border border-border/50 p-5 cursor-pointer transition-all duration-500
                        border-l-[3px] ${tagBorderColors[c.type]}
                        hover:bg-card/70 hover:border-border hover:shadow-[0_8px_30px_hsl(var(--neon-glow))]
                        ${visibleCards.has(i) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
                      style={{ transitionDelay: `${i * 60}ms` }}
                    >
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <h3 className="font-sans text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                          {c.title}
                        </h3>
                        <span
                          className={`text-[10px] font-mono font-bold uppercase tracking-widest ${tagTextColors[c.type]} shrink-0`}
                        >
                          {c.type}
                        </span>
                      </div>
                      <p className="font-mono text-xs text-muted-foreground break-all">
                        <span className="text-muted-foreground/50">flag:</span>{" "}
                        <code className="text-primary/80">{c.flag}</code>
                      </p>
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-[10px] font-mono text-muted-foreground/50">{c.ctf}</span>
                        <span className="text-[10px] font-mono text-muted-foreground/30 group-hover:text-primary/50 transition-colors">
                          read →
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>

          {/* RIGHT SIDEBAR */}
          <aside className="space-y-4 lg:sticky lg:top-24">
            <div className="bg-card/50 glass border border-border/60 rounded-2xl p-5 overflow-hidden">
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-3">Writeup stats</p>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-border/60 bg-card/40 p-3">
                  <div className="text-2xl font-display text-primary leading-none">{writeupIndex.length}</div>
                  <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-muted-foreground mt-1">total</div>
                </div>
                <div className="rounded-xl border border-border/60 bg-card/40 p-3">
                  <div className="text-2xl font-display text-primary leading-none">
                    {new Set(writeupIndex.map((c) => c.ctf)).size}
                  </div>
                  <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-muted-foreground mt-1">events</div>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                {categoryOnly.map((t) => {
                  const count = writeupIndex.filter((c) => c.type === t).length;
                  return (
                    <div key={t} className="flex items-center gap-3">
                      <span className={`inline-block h-2 w-2 rounded-full ${tagTextColors[t]}`} />
                      <span className="text-xs font-mono uppercase tracking-[0.18em] text-muted-foreground">{t}</span>
                      <span className="ml-auto text-xs font-mono text-primary/80">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-card/50 glass border border-border/60 rounded-2xl p-5">
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-3">Recent solves</p>
              <div className="space-y-2">
                {[...writeupIndex]
                  .slice(-5)
                  .reverse()
                  .map((c) => (
                    <button
                      key={`${c.ctf}-${c.title}`}
                      onClick={() => c.slug && navigate(`/writeup/${c.slug}`)}
                      className="w-full text-left rounded-xl border border-border/60 bg-background/20 px-4 py-3 hover:bg-primary/5 hover:border-primary/30 transition-colors"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="text-sm font-semibold text-foreground truncate">{c.title}</div>
                        <span
                          className={`text-[10px] font-mono uppercase tracking-[0.22em] ${tagTextColors[c.type]}`}
                        >
                          {c.type}
                        </span>
                      </div>
                      <div className="text-[10px] font-mono text-muted-foreground/70 uppercase tracking-[0.22em] mt-1 truncate">
                        {c.ctf}
                      </div>
                    </button>
                  ))}
              </div>
            </div>

            <div className="bg-card/50 glass border border-border/60 rounded-2xl p-5">
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-3">CTF snapshot</p>
              <div className="space-y-2">
                {myCTFs.map((ctf) => (
                  <div
                    key={ctf.name}
                    className="rounded-xl border border-border/60 bg-background/20 px-4 py-3 flex items-center gap-3"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_hsl(var(--neon-glow))]" />
                    <div className="min-w-0">
                      <div className="text-xs font-mono uppercase tracking-[0.18em] text-muted-foreground truncate">
                        {ctf.name}
                      </div>
                      <div className="text-[10px] font-mono text-muted-foreground/60 uppercase tracking-[0.22em]">
                        {ctf.status}
                      </div>
                    </div>
                    <div className="ml-auto text-xs font-mono text-primary/80">
                      {solvesByEvent[ctf.name] || 0}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </main>

      <SiteFooter />

      {/* CTF Modal */}
      <CyberModal open={ctfModalOpen} onClose={() => setCtfModalOpen(false)} title="My CTFs">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {myCTFs.map((ctf) => (
            <div
              key={ctf.name}
              onClick={() => {
                if (ctf.route) {
                  navigate(ctf.route);
                  setCtfModalOpen(false);
                }
              }}
              className={`bg-muted/30 border border-border rounded-md p-5 transition-all group
                ${ctf.route ? "cursor-pointer hover:border-primary/30 hover:bg-primary/5" : "opacity-60"}`}
            >
              <h3 className="font-sans font-semibold text-foreground group-hover:text-primary transition-colors mb-1">
                {ctf.name}
              </h3>
              <p className="text-xs font-mono text-muted-foreground">
                {solvesByEvent[ctf.name] || 0} solves
              </p>
              <div className="flex items-center gap-1.5 mt-3">
                <span
                  className={`w-1.5 h-1.5 rounded-full ${ctf.status === "Ended" ? "bg-muted-foreground" : "bg-primary"}`}
                />
                <span className="text-[10px] font-mono text-muted-foreground uppercase">{ctf.status}</span>
              </div>
            </div>
          ))}
        </div>
      </CyberModal>

      {/* Labs Modal */}
      <CyberModal open={labsModalOpen} onClose={() => setLabsModalOpen(false)} title="Labs / Machines">
        <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.2em] mb-4">Platforms</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {labPlatforms.map((p) => (
            <div
              key={p.platform}
              onClick={() => {
                if (p.route) {
                  navigate(p.route);
                  setLabsModalOpen(false);
                }
              }}
              className={`bg-muted/30 border border-border rounded-md p-5 transition-all group
                ${p.route ? "cursor-pointer hover:border-primary/30 hover:bg-primary/5" : "opacity-60"}`}
            >
              <h3 className="font-sans font-semibold text-foreground group-hover:text-primary transition-colors mb-1">
                {p.platform}
              </h3>
              {p.username && (
                <p className="text-xs font-mono text-muted-foreground">
                  @<span className="text-foreground/80">{p.username}</span>
                </p>
              )}
              <div className="flex items-center gap-1.5 mt-3">
                <span
                  className={`w-1.5 h-1.5 rounded-full ${p.status === "Active" ? "bg-primary animate-pulse" : "bg-muted-foreground"}`}
                />
                <span className="text-[10px] font-mono text-muted-foreground uppercase">{p.status}</span>
              </div>
            </div>
          ))}
        </div>
      </CyberModal>
    </div>
  );
};

export default Index;
