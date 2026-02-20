import { useState } from "react";
import type { Challenge } from "@/data/challenges";
import { writeupIndex } from "@/data/writeupIndex";
import FeedbackForm from "./FeedbackForm";
const categories = [
  { type: "web", label: "WEB" },
  { type: "misc", label: "MISC" },
  { type: "crypto", label: "CRYPTO" },
  { type: "pwn", label: "PWN" },
  { type: "forensics", label: "FORENSICS" },
] as const;

const contacts = [
  { label: "GitHub", url: "https://github.com/syndro-1", icon: "GH" },
  { label: "X", url: "https://x.com/Syndro_1", icon: "X" },
  { label: "Discord", url: "https://discordapp.com/users/313717103150759950", icon: "DC" },
  { label: "Medium", url: "https://medium.com/@syndro", icon: "MD" },
  { label: "LinkedIn", url: "https://www.linkedin.com/in/ibrahim-mahmoud-15905a340/", icon: "LI" },
];

interface InfoPanelProps {
  onChallengeClick?: (challenge: Challenge) => void;
}

const InfoPanel = ({ onChallengeClick }: InfoPanelProps) => {
  const [open, setOpen] = useState(false);

  const solved: Record<string, number> = {};
  writeupIndex.forEach((c) => {
    solved[c.type] = (solved[c.type] || 0) + 1;
  });

  const recentSolves = [...writeupIndex].slice(-4).reverse();

  return (
    <>
      {/* Toggle button — always visible */}
      <button
        onClick={() => setOpen(!open)}
        className={`fixed top-2.5 right-5 z-[1001] w-9 h-9 rounded-md border transition-all flex items-center justify-center font-mono text-xs
          ${open
            ? "bg-primary text-primary-foreground border-primary box-glow-sm"
            : "bg-card/80 glass text-primary border-border hover:border-primary/50"
          }`}
        aria-label="Toggle info panel"
      >
        {open ? "✕" : "≡"}
      </button>

      {/* Backdrop on mobile */}
      {open && (
        <div
          className="lg:hidden fixed inset-0 bg-background/60 glass z-[999]"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Panel */}
      <aside
        className={`fixed top-0 right-0 bottom-0 z-[1000] w-[320px] bg-card/95 glass border-l border-border
          flex flex-col overflow-y-auto transition-transform duration-300 ease-out
          ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="p-6 flex flex-col h-full gap-6">
          {/* Category stats */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="h-px flex-1 bg-border" />
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground">Stats</span>
              <div className="h-px flex-1 bg-border" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              {categories.map(
                (cat) =>
                  (solved[cat.type] || 0) > 0 && (
                    <div
                      key={cat.type}
                      className="flex items-center gap-2 bg-muted/30 rounded-md px-3 py-2 border border-border/50"
                    >
                      <span className="w-2 h-2 rounded-full bg-primary" />
                      <span className="text-xs font-mono text-muted-foreground">{cat.label}</span>
                      <span className="ml-auto text-xs font-bold text-primary">{solved[cat.type]}</span>
                    </div>
                  )
              )}
            </div>
          </div>

          {/* Recent Solves */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="h-px flex-1 bg-border" />
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground">Recent</span>
              <div className="h-px flex-1 bg-border" />
            </div>
            <div className="space-y-1.5">
              {recentSolves.map((c, i) => (
                <button
                  key={i}
                  onClick={() => onChallengeClick?.(c)}
                  className="w-full text-left p-2.5 rounded-md text-sm text-foreground/80 border border-transparent
                    hover:bg-muted/50 hover:border-primary/20 hover:text-primary transition-all
                    neon-border-left border-l-primary/0 hover:border-l-primary group"
                >
                  <span className="group-hover:translate-x-1 inline-block transition-transform">{c.title}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Contacts */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="h-px flex-1 bg-border" />
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground">Links</span>
              <div className="h-px flex-1 bg-border" />
            </div>
            <div className="flex flex-wrap gap-2">
              {contacts.map((c) => (
                <a
                  key={c.label}
                  href={c.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono text-muted-foreground border border-border
                    hover:text-primary hover:border-primary/30 hover:bg-primary/5 transition-all"
                >
                  <span className="text-[10px] font-bold text-primary/60">{c.icon}</span>
                  {c.label}
                </a>
              ))}
            </div>
          </div>

          {/* Feedback */}
          <div className="mt-auto">
            <FeedbackForm />
            </div>
        </div>
      </aside>
    </>
  );
};

export default InfoPanel;
