import { useState, FormEvent } from "react";

const FeedbackForm = () => {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("sending");
    const form = e.currentTarget;
    const formData = new FormData(form);
    const json = JSON.stringify(Object.fromEntries(formData));

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: json,
      });
      const result = await response.json();
      if (response.ok) {
        form.reset();
        setStatus("success");
        setMessage("Thank you! ❤️ Your message was sent successfully.");
      } else {
        setStatus("error");
        setMessage(result.message || "Failed to send. Try again.");
      }
    } catch {
      setStatus("error");
      setMessage("Network error. Check your connection.");
    }

    setTimeout(() => setStatus("idle"), 6000);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-3">
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Feedback</span>
        <div className="h-px flex-1 bg-border" />
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2.5">
        <input type="hidden" name="access_key" value="b0ddf65c-4b48-418e-bebd-d5f6c0d86995" />
        <input type="hidden" name="subject" value="New Feedback from syndro site" />
        <input type="checkbox" name="botcheck" className="hidden" style={{ display: "none" }} />
        <input
          type="text"
          name="name"
          placeholder="Name (optional)"
          autoComplete="name"
          className="bg-muted/50 border border-border rounded-md px-3 py-2 text-foreground text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
        />
        <input
          type="email"
          name="email"
          placeholder="Email (optional)"
          autoComplete="email"
          className="bg-muted/50 border border-border rounded-md px-3 py-2 text-foreground text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
        />
        <textarea
          name="message"
          placeholder="Your message..."
          rows={3}
          required
          className="bg-muted/50 border border-border rounded-md px-3 py-2 text-foreground text-sm resize-none placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
        />
        <button
          type="submit"
          disabled={status === "sending"}
          className="self-end bg-primary/10 text-primary border border-primary/30 font-mono text-xs uppercase tracking-wider px-4 py-2 rounded-md
            hover:bg-primary hover:text-primary-foreground hover:box-glow-sm transition-all disabled:opacity-50"
        >
          {status === "sending" ? "Sending..." : "Send →"}
        </button>
      </form>
      {status !== "idle" && status !== "sending" && (
        <div
          className={`text-center text-xs p-2.5 rounded-md border animate-[fade-in_0.3s_ease] ${
            status === "success"
              ? "text-primary bg-primary/5 border-primary/20"
              : "text-destructive bg-destructive/5 border-destructive/20"
          }`}
        >
          {message}
        </div>
      )}
      <p className="text-[10px] text-muted-foreground/50 text-center font-mono">
        Messages are private — only I receive them.
      </p>
    </div>
  );
};

export default FeedbackForm;
