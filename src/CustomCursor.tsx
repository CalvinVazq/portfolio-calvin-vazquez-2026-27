import { useEffect, useRef } from 'react';

type Pixel = { x: number; y: number; vx: number; vy: number; size: number; born: number; life: number };

const PIXEL_COLOR = '#ffffff';
const MAX_PIXELS = 140;

export function CustomCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const cursor = cursorRef.current;
    if (!canvas || !cursor) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const preference = window.matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
    let particles: Pixel[] = [];
    let last: { x: number; y: number; time: number } | null = null;
    let frame = 0;
    let enabled = false;
    let width = 0;
    let height = 0;

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    };
    const draw = (now: number) => {
      frame = 0;
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = PIXEL_COLOR;
      particles = particles.filter(pixel => {
        const progress = (now - pixel.born) / pixel.life;
        if (progress >= 1) return false;
        const size = pixel.size * (1 - .45 * progress);
        ctx.globalAlpha = (1 - progress) * .85;
        const drift = progress * 12;
        ctx.fillRect(pixel.x + pixel.vx * drift, pixel.y + pixel.vy * drift, size, size);
        return true;
      });
      ctx.globalAlpha = 1;
      if (particles.length) frame = requestAnimationFrame(draw);
    };
    const hide = () => {
      document.documentElement.classList.remove('custom-cursor-active');
      cursor.classList.remove('is-visible', 'is-interactive');
      last = null;
    };
    const move = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return;
      const { clientX: x, clientY: y } = event;
      cursor.style.left = `${x}px`;
      cursor.style.top = `${y}px`;
      cursor.classList.add('is-visible');
      document.documentElement.classList.add('custom-cursor-active');
      const target = event.target instanceof Element ? event.target : null;
      cursor.classList.toggle('is-interactive', !!target?.closest('a, button, input, textarea, select, [role="button"], [contenteditable="true"]'));
      const now = performance.now();
      if (last) {
        const dx = x - last.x, dy = y - last.y;
        const distance = Math.hypot(dx, dy);
        const speed = distance / Math.max(now - last.time, 8);
        if (distance >= 2) {
          const count = Math.min(18, Math.max(1, Math.floor(distance / (speed > 1 ? 4 : 7))));
          for (let i = 0; i < count; i++) {
            const t = (i + Math.random()) / count;
            particles.push({
              x: last.x + dx * t + (Math.random() - .5) * 10,
              y: last.y + dy * t + (Math.random() - .5) * 10,
              vx: (Math.random() - .5) * 1.2,
              vy: (Math.random() - .5) * 1.2,
              size: 2 + Math.random() * 3,
              born: now,
              life: 300 + Math.random() * 400,
            });
          }
          if (particles.length > MAX_PIXELS) particles.splice(0, particles.length - MAX_PIXELS);
          if (!frame) frame = requestAnimationFrame(draw);
        }
      }
      last = { x, y, time: now };
    };
    const leave = (event: PointerEvent) => { if (event.pointerType === 'mouse' && !event.relatedTarget) hide(); };
    const onVisibility = () => { if (document.hidden) hide(); };
    const disable = () => {
      if (!enabled) return;
      enabled = false;
      window.removeEventListener('pointermove', move);
      document.removeEventListener('pointerout', leave);
      window.removeEventListener('resize', resize);
      window.removeEventListener('blur', hide);
      document.removeEventListener('visibilitychange', onVisibility);
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      particles = [];
      ctx.clearRect(0, 0, width, height);
      hide();
    };
    const updatePreference = () => {
      if (!preference.matches) { disable(); return; }
      if (enabled) return;
      enabled = true;
      resize();
      window.addEventListener('pointermove', move, { passive: true });
      document.addEventListener('pointerout', leave);
      window.addEventListener('resize', resize, { passive: true });
      window.addEventListener('blur', hide);
      document.addEventListener('visibilitychange', onVisibility);
    };
    preference.addEventListener('change', updatePreference);
    updatePreference();
    return () => { preference.removeEventListener('change', updatePreference); disable(); };
  }, []);

  return <><canvas ref={canvasRef} className="cursor-trail" aria-hidden="true"/><div ref={cursorRef} className="custom-cursor" aria-hidden="true"><span/></div></>;
}
