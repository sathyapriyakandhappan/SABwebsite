import React, { useEffect, useRef } from 'react';

export default function DNAHelixBackground({ className = '' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let width = (canvas.width = canvas.parentElement.clientWidth);
    let height = (canvas.height = canvas.parentElement.clientHeight);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener('resize', handleResize);

    // Particles configuration
    const particles = Array.from({ length: 45 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2 + 1,
      speedX: (Math.random() - 0.5) * 0.4,
      speedY: (Math.random() - 0.5) * 0.4,
      alpha: Math.random() * 0.6 + 0.2,
    }));

    let rotation = 0;
    const numPoints = 28;
    const strandRadius = Math.min(width * 0.18, 120);
    const step = height / numPoints;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      rotation += 0.018;

      // Draw floating bio-particles
      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(16, 185, 129, ${p.alpha * 0.4})`;
        ctx.fill();
      });

      // Draw DNA double helix
      const centerX = width * 0.72; // Position on the right side of hero

      for (let i = 0; i < numPoints; i++) {
        const y = i * step;
        const angle = rotation + i * 0.32;

        const x1 = centerX + Math.cos(angle) * strandRadius;
        const z1 = Math.sin(angle); // -1 to 1 for depth

        const x2 = centerX + Math.cos(angle + Math.PI) * strandRadius;
        const z2 = Math.sin(angle + Math.PI);

        // Connector rungs (hydrogen bonds)
        const alpha = Math.max(0.1, (z1 + 1) / 2);
        const gradient = ctx.createLinearGradient(x1, y, x2, y);
        gradient.addColorStop(0, `rgba(16, 185, 129, ${alpha * 0.6})`);
        gradient.addColorStop(0.5, `rgba(56, 189, 248, ${alpha * 0.8})`);
        gradient.addColorStop(1, `rgba(236, 72, 153, ${alpha * 0.6})`);

        ctx.beginPath();
        ctx.moveTo(x1, y);
        ctx.lineTo(x2, y);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = Math.max(1, (z1 + 1.2) * 1.5);
        ctx.stroke();

        // Node 1 (Strand A)
        const r1 = Math.max(2.5, (z1 + 1.5) * 3);
        ctx.beginPath();
        ctx.arc(x1, y, r1, 0, Math.PI * 2);
        ctx.fillStyle = z1 > 0 ? '#10b981' : '#047857';
        ctx.shadowColor = '#10b981';
        ctx.shadowBlur = z1 > 0 ? 12 : 2;
        ctx.fill();

        // Node 2 (Strand B)
        const r2 = Math.max(2.5, (z2 + 1.5) * 3);
        ctx.beginPath();
        ctx.arc(x2, y, r2, 0, Math.PI * 2);
        ctx.fillStyle = z2 > 0 ? '#06b6d4' : '#0891b2';
        ctx.shadowColor = '#06b6d4';
        ctx.shadowBlur = z2 > 0 ? 12 : 2;
        ctx.fill();

        // Reset shadow
        ctx.shadowBlur = 0;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none w-full h-full z-0 ${className}`}
    />
  );
}
