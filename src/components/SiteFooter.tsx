import { useState } from "react";
import { Link } from "react-router-dom";
import { SOCIAL_LINKS } from "@/data/site";
import CyberModal from "@/components/CyberModal";
import FeedbackForm from "@/components/FeedbackForm";

const SiteFooter = () => {
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  return (
    <footer className="relative z-10 mt-20">
      <div className="max-w-7xl mx-auto px-6 md:px-12 pb-14">
        <div className="rounded-2xl border border-border/60 bg-card/40 glass overflow-hidden">
          <div className="h-px w-full bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
          <div className="p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              <div className="md:col-span-5">
                <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.3em] mb-2">
                  // socials
                </p>
                <div className="flex flex-wrap gap-2">
                  {SOCIAL_LINKS.map((s) => (
                    <a
                      key={s.label}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-border/60 bg-background/20
                        text-xs font-mono text-muted-foreground hover:text-primary hover:border-primary/30 hover:bg-primary/5 transition-colors"
                    >
                      <span className="text-[10px] font-bold text-primary/70">{s.short}</span>
                      {s.label}
                    </a>
                  ))}
                </div>
              </div>

              <div className="md:col-span-4">
                <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.3em] mb-2">
                  // explore
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    to="/events"
                    className="rounded-xl border border-border/60 bg-background/20 px-4 py-3 text-left hover:bg-primary/5 hover:border-primary/30 transition-colors"
                  >
                    <div className="text-sm font-semibold text-foreground">Events</div>
                    <div className="text-[10px] font-mono text-muted-foreground mt-1 uppercase tracking-[0.22em]">
                      CTFs
                    </div>
                  </Link>
                  <Link
                    to="/tryhackme"
                    className="rounded-xl border border-border/60 bg-background/20 px-4 py-3 text-left hover:bg-primary/5 hover:border-primary/30 transition-colors"
                  >
                    <div className="text-sm font-semibold text-foreground">Labs</div>
                    <div className="text-[10px] font-mono text-muted-foreground mt-1 uppercase tracking-[0.22em]">
                      TryHackMe
                    </div>
                  </Link>
                  <button
                    onClick={() => setFeedbackOpen(true)}
                    className="col-span-2 rounded-xl border border-border/60 bg-background/20 px-4 py-3 text-left hover:bg-primary/5 hover:border-primary/30 transition-colors"
                  >
                    <div className="text-sm font-semibold text-foreground">Feedback</div>
                    <div className="text-[10px] font-mono text-muted-foreground mt-1 uppercase tracking-[0.22em]">
                      send a message
                    </div>
                  </button>
                </div>
              </div>

              <div className="md:col-span-3">
                <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.3em] mb-2">
                  // notes
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Writeups are for learning. If you find an error or want to collaborate, hit feedback.
                </p>
              </div>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="text-[10px] font-mono text-muted-foreground/50 uppercase tracking-[0.3em]">
                syndro © {new Date().getFullYear()}
              </div>
              <div className="text-[10px] font-mono text-muted-foreground/40 uppercase tracking-[0.3em]">
                built with vite • react • tailwind
              </div>
            </div>
          </div>
        </div>
      </div>

      <CyberModal open={feedbackOpen} onClose={() => setFeedbackOpen(false)} title="Feedback">
        <FeedbackForm />
      </CyberModal>
    </footer>
  );
};

export default SiteFooter;
