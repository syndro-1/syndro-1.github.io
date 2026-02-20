import { useEffect, useRef } from "react";

const VisitorCounter = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.innerHTML = `
      var sc_project=13192699;
      var sc_invisible=0;
      var sc_security="f34343e1";
      var sc_text=2;
    `;
    document.body.appendChild(script);

    const counterScript = document.createElement("script");
    counterScript.type = "text/javascript";
    counterScript.src = "https://statcounter.com/counter/counter.js";
    counterScript.async = true;
    document.body.appendChild(counterScript);

    return () => {
      document.body.removeChild(script);
      if (document.body.contains(counterScript)) {
        document.body.removeChild(counterScript);
      }
    };
  }, []);

  return (
    <div ref={containerRef} className="flex items-center gap-2 text-xs text-muted-foreground">
      <span className="w-1.5 h-1.5 rounded-full bg-primary/60" />
      <span className="font-mono uppercase tracking-wider">Visitors</span>
      <noscript>
        <div className="statcounter">
          <a title="free hit counter" href="https://statcounter.com/" target="_blank" rel="noopener noreferrer">
            <img
              className="statcounter"
              src="https://c.statcounter.com/13192699/0/f34343e1/0/"
              alt="counter"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </a>
        </div>
      </noscript>
    </div>
  );
};

export default VisitorCounter;
