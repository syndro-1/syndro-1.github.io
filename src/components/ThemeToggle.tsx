import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

type Theme = "dark" | "light";

export default function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof document === "undefined") return "dark";
    return document.documentElement.classList.contains("light") ? "light" : "dark";
  });

  useEffect(() => {
    if (typeof document === "undefined") return;
    const isLight = document.documentElement.classList.contains("light");
    setTheme(isLight ? "light" : "dark");
  }, []);

  const toggle = () => {
    const next: Theme = theme === "light" ? "dark" : "light";
    setTheme(next);
    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("light", next === "light");
    }
    try {
      localStorage.setItem("theme", next);
    } catch {}
  };

  const Icon = theme === "light" ? Moon : Sun;

  return (
    <button
      type="button"
      onClick={toggle}
      className={[
        "group inline-flex items-center gap-2 rounded-xl border border-border/60",
        "bg-card/60 glass hover:bg-card/80 transition-colors",
        compact ? "h-9 px-3 text-xs" : "h-10 px-4 text-xs",
        "font-mono uppercase tracking-[0.18em] text-muted-foreground hover:text-primary",
      ].join(" ")}
      aria-label="Toggle theme"
      title="Toggle theme"
    >
      <span className="text-primary">
        <Icon size={16} className="transition-transform group-hover:-rotate-12" />
      </span>
      {!compact && <span className="hidden sm:inline">Toggle theme</span>}
      {compact && <span className="hidden md:inline">Theme</span>}
    </button>
  );
}
