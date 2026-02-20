import { useEffect, useRef } from "react";

class Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  canvasW: number;
  canvasH: number;

  constructor(w: number, h: number) {
    this.canvasW = w;
    this.canvasH = h;
    this.x = Math.random() * w;
    this.y = Math.random() * h;
    this.size = Math.random() * 1.5 + 0.3;
    this.speedX = (Math.random() - 0.5) * 0.3;
    this.speedY = Math.random() * 0.4 + 0.1;
    this.opacity = Math.random() * 0.5 + 0.2;
  }

  update() {
    this.y += this.speedY;
    this.x += this.speedX;
    if (this.y > this.canvasH) {
      this.y = 0;
      this.x = Math.random() * this.canvasW;
    }
    if (this.x < 0 || this.x > this.canvasW) {
      this.speedX *= -1;
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = `hsla(188, 95%, 43%, ${this.opacity})`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

const ParticlesBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let particles: Particle[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const count = Math.min(Math.floor((canvas.width * canvas.height) / 20000), 80);
      particles = Array.from({ length: count }, () => new Particle(canvas.width, canvas.height));
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw connections between nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.strokeStyle = `hsla(188, 95%, 43%, ${0.06 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      particles.forEach((p) => {
        p.update();
        p.draw(ctx);
      });
      animationId = requestAnimationFrame(animate);
    };

    resize();
    animate();
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 opacity-60 pointer-events-none"
      aria-hidden="true"
    />
  );
};

export default ParticlesBackground;
