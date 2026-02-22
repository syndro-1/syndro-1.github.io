import { useEffect, useMemo, useState } from "react";

export type SectionChipItem = {
  id: string;
  text: string;
  level?: number;
};

const iconFor = (label: string) => {
  const l = (label || "").toLowerCase();
  if (/(goal|goals)/.test(l)) return "🎯";
  if (/(host|hostname|hosts)/.test(l)) return "🧩";
  if (/recon/.test(l)) return "🛰️";
  if (/(enum|enumeration|dir|fuzz|web)/.test(l)) return "🧪";
  if (/(access|auth|jwt|session|token)/.test(l)) return "🪪";
  if (/api/.test(l)) return "🧭";
  if (/ssrf/.test(l)) return "🕳️";
  if (/ssti/.test(l)) return "🧨";
  if (/(privesc|privilege|root)/.test(l)) return "⚡";
  if (/(desc|description)/.test(l)) return "📝";
  if (/(solve|solution|exploit)/.test(l)) return "🛠️";
  if (/(nmap|port scan|ports)/.test(l)) return "🛰️";
  return "📌";
};

const parseStep = (raw: string) => {
  const t = (raw || "").trim();
  const m = /^\s*(\d{1,2})\s*[\)\.:\-]\s*(.+)$/.exec(t);
  if (!m) return { badge: "", label: t };
  return { badge: `${m[1]})`, label: (m[2] || "").trim() };
};

const shortLabel = (s: string) => {
  const clean = (s || "").replace(/\s+/g, " ").trim();
  if (clean.length <= 24) return clean;
  return `${clean.slice(0, 22).trim()}…`;
};

type Props = {
  items: SectionChipItem[];
  preferTopLevel?: boolean;
};

export default function SectionChips({ items, preferTopLevel = true }: Props) {
  const chips = useMemo(() => {
    const list = (items || []).filter(Boolean);
    if (!preferTopLevel) return list;
    const hasH2 = list.some((x) => x.level === 2);
    return hasH2 ? list.filter((x) => x.level === 2) : list;
  }, [items, preferTopLevel]);

  const [activeId, setActiveId] = useState<string | null>(chips[0]?.id ?? null);

  useEffect(() => {
    if (!chips.length) return;
    const els = chips
      .map((c) => document.getElementById(c.id))
      .filter(Boolean) as HTMLElement[];
    if (!els.length) return;

    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (a.boundingClientRect.top ?? 0) - (b.boundingClientRect.top ?? 0));
        const top = visible[0];
        if (!top?.target) return;
        const id = (top.target as HTMLElement).id;
        if (id) setActiveId(id);
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: 0.01 }
    );

    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [chips]);

  if (!chips.length) return null;

  return (
    <div className="mt-4 bg-card/50 glass border border-border/60 rounded-2xl p-3">
      <div className="flex flex-wrap items-center gap-2 py-1">
        {chips.slice(0, 18).map((h) => {
          const { badge, label } = parseStep(h.text);
          const isActive = activeId === h.id;
          return (
            <button
              key={h.id}
              onClick={() => {
                const el = document.getElementById(h.id);
                if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              className={
                "inline-flex items-center gap-2 rounded-full border px-3 py-2 text-[10px] font-mono uppercase tracking-[0.22em] transition-colors " +
                (isActive
                  ? "border-primary/50 bg-primary/10 text-primary shadow-[0_0_22px_hsl(var(--neon-glow))]"
                  : "border-border/60 bg-background/15 text-muted-foreground hover:text-primary hover:border-primary/40 hover:bg-primary/5")
              }
              title={h.text}
            >
              <span className="text-primary/80">{iconFor(label || h.text)}</span>
              {badge ? <span className={isActive ? "text-primary" : "text-muted-foreground"}>{badge}</span> : null}
              <span className="max-w-[22ch] truncate">{shortLabel(label || h.text)}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
