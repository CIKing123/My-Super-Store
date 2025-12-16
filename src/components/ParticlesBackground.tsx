import React, { useEffect, useRef } from 'react';

export const ParticlesBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width = canvas.clientWidth;
    let height = canvas.height = canvas.clientHeight;

    const resize = () => {
      width = canvas.width = canvas.clientWidth;
      height = canvas.height = canvas.clientHeight;
    };

    window.addEventListener('resize', resize);

    const particles = Array.from({ length: Math.max(40, Math.floor((width * height) / 50000)) }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 2.4 + 0.6,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      hue: Math.floor(Math.random() * 50) + 200,
      alpha: Math.random() * 0.6 + 0.2
    }));

    let raf = 0;

    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);

      // a subtle gradient background
      const grd = ctx.createLinearGradient(0, 0, width, height);
      grd.addColorStop(0, 'rgba(10,10,12,0.95)');
      grd.addColorStop(1, 'rgba(8,8,20,0.95)');
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, width, height);

      particles.forEach(p => {
        p.x += p.vx + Math.sin((p.y + Date.now() / 1000) / 50) * 0.2;
        p.y += p.vy + Math.cos((p.x + Date.now() / 1000) / 50) * 0.2;

        if (p.x > width + 10) p.x = -10;
        if (p.x < -10) p.x = width + 10;
        if (p.y > height + 10) p.y = -10;
        if (p.y < -10) p.y = height + 10;

        ctx.beginPath();
        ctx.fillStyle = `hsla(${p.hue}, 70%, 60%, ${p.alpha})`;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });

      // connecting lines for a subtle network
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.strokeStyle = `rgba(200,180,120,${(1 - dist / 120) * 0.06})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      raf = requestAnimationFrame(draw);
    }

    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="particles-canvas" />;
};

export default ParticlesBackground;
