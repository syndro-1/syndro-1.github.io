import { Link, useNavigate } from "react-router-dom";
import ThemeToggle from "@/components/ThemeToggle";
import { SITE_BRAND } from "@/data/site";

type TopNavProps = {
  /** show a back button (used on inner pages) */
  backTo?: string;
  /** title block (used on inner pages) */
  title?: string;
  subtitle?: string;
  /** optional actions */
  onOpenCTFs?: () => void;
  onOpenLabs?: () => void;
  /** keep room for the InfoPanel toggle button on the right */
  rightOffsetClassName?: string;
};

const TopNav = ({
  backTo,
  title,
  subtitle,
  onOpenCTFs,
  onOpenLabs,
  rightOffsetClassName = "right-0",
}: TopNavProps) => {
  const navigate = useNavigate();

  return (
    <nav
      className={`fixed top-0 left-0 ${rightOffsetClassName} z-50 h-14 px-6 flex items-center gap-3 bg-card/55 glass border-b border-border/50`}
    >
      {/* Accent */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-primary/40 via-secondary/20 to-transparent" />

      {backTo ? (
        <button
          onClick={() => navigate(backTo)}
          className="text-xs font-mono text-muted-foreground hover:text-primary transition-colors uppercase tracking-wider flex items-center gap-2"
        >
          <span className="text-primary">←</span> Back
        </button>
      ) : (
        <Link
          to="/"
          className="group inline-flex items-center gap-2 rounded-md px-2 py-1 hover:bg-primary/5 transition-colors"
        >
          <span className="w-2.5 h-2.5 rounded-sm bg-primary shadow-[0_0_14px_hsl(var(--neon-glow))]" />
          <span className="font-display text-sm text-primary tracking-tight">
            {SITE_BRAND.handle}
          </span>
          <span className="text-[10px] font-mono text-muted-foreground/70 uppercase tracking-[0.22em] group-hover:text-muted-foreground transition-colors">
            // portfolio
          </span>
        </Link>
      )}

      <div className="h-4 w-px bg-border mx-1" />

      {/* Center title (optional) */}
      {title ? (
        <div className="min-w-0">
          <div className="font-display text-sm text-primary tracking-tight truncate">{title}</div>
          {subtitle ? (
            <div className="text-[10px] font-mono text-muted-foreground/70 uppercase tracking-[0.22em] truncate">
              {subtitle}
            </div>
          ) : null}
        </div>
      ) : (
        <div className="flex items-center gap-1.5">
          {onOpenCTFs ? (
            <button
              onClick={onOpenCTFs}
              className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-[11px] font-mono uppercase tracking-[0.26em]
                text-muted-foreground hover:text-primary border border-transparent hover:border-primary/30 hover:bg-primary/5 transition-colors"
            >
              <span className="text-primary/80">▣</span> CTFs
            </button>
          ) : null}
          {onOpenLabs ? (
            <button
              onClick={onOpenLabs}
              className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-[11px] font-mono uppercase tracking-[0.26em]
                text-muted-foreground hover:text-primary border border-transparent hover:border-primary/30 hover:bg-primary/5 transition-colors"
            >
              <span className="text-primary/80">◧</span> Labs
            </button>
          ) : null}

          <Link
            to="/events"
            className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-[11px] font-mono uppercase tracking-[0.26em]
              text-muted-foreground hover:text-primary border border-transparent hover:border-primary/30 hover:bg-primary/5 transition-colors"
          >
            <span className="text-primary/80">⌁</span> Events
          </Link>
        </div>
      )}

      <div className="ml-auto flex items-center gap-2">
        <ThemeToggle compact />
      </div>
    </nav>
  );
};

export default TopNav;
