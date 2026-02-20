import { ReactNode, useEffect } from "react";

interface CyberModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

const CyberModal = ({ open, onClose, title, children }: CyberModalProps) => {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) {
      document.addEventListener("keydown", handler);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center bg-background/80 glass p-4 animate-[fade-in_0.2s_ease]"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-card border border-primary/30 rounded-lg w-full max-w-3xl max-h-[90vh] overflow-hidden shadow-[0_0_60px_hsl(var(--neon-glow)),0_0_120px_hsl(var(--neon-glow))] relative animate-modal-in">
        {/* Top accent line */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-primary to-transparent" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-muted transition-all font-mono text-sm"
          aria-label="Close modal"
        >
          ✕
        </button>

        <div className="p-8">
          <h2 className="font-display text-2xl text-primary text-glow-sm mb-6 tracking-tight">
            {title}
          </h2>
          <div className="max-h-[60vh] overflow-y-auto">{children}</div>
        </div>

        {/* Bottom accent line */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      </div>
    </div>
  );
};

export default CyberModal;
