import { useEffect, useState } from "react";

const LiveClock = () => {
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () => {
      setTime(
        new Date().toLocaleTimeString("en-US", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-card/80 glass border border-border rounded-md px-3 py-2 font-mono text-primary text-sm tracking-widest pointer-events-none hidden md:flex items-center gap-2">
      <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
      {time}
    </div>
  );
};

export default LiveClock;
