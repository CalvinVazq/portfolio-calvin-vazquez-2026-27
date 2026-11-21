import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

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
    const paths = Array.from(cursor.querySelectorAll<SVGPathElement>('path'));
    const morph = { progress: 0 };
    let interactive = false;
    const renderCursor = () => {
      const t = morph.progress;
      const mix = (a: number, b: number) => a + (b - a) * t;
      const radius = 15, arm = 9, control = radius * .55228475;
      // Each straight ray bends into one quarter of the circular outline.
      const arcs = [
        [[0,-radius],[control,-radius],[radius,-control],[radius,0]],
        [[radius,0],[radius,control],[control,radius],[0,radius]],
        [[0,radius],[-control,radius],[-radius,control],[-radius,0]],
        [[-radius,0],[-radius,-control],[-control,-radius],[0,-radius]],
      ];
      const tips = [[arm,0],[0,arm],[-arm,0],[0,-arm]];
      paths.forEach((path, index) => {
        const [start, c1, c2, end] = arcs[index];
        const tip = tips[index];
        path.setAttribute('d', `M ${16 + mix(0,start[0])} ${16 + mix(0,start[1])} C ${16 + mix(0,c1[0])} ${16 + mix(0,c1[1])} ${16 + mix(tip[0],c2[0])} ${16 + mix(tip[1],c2[1])} ${16 + mix(tip[0],end[0])} ${16 + mix(tip[1],end[1])}`);
      });
    };
    const setInteractive = (next: boolean) => {
      if (interactive === next) return;
      interactive = next;
      gsap.to(morph, { progress: next ? 1 : 0, duration: .5, ease: 'power3.inOut', overwrite: true, onUpdate: renderCursor });
    };
    renderCursor();
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
      cursor.classList.remove('is-visible');
      gsap.killTweensOf(morph);
      interactive = false; morph.progress = 0; renderCursor();
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
      setInteractive(!!target?.closest('a[href], button, input, textarea, select, summary, [role="button"], [role="link"], [role="checkbox"], [tabindex]:not([tabindex="-1"]), [contenteditable="true"], .paper-motion'));
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

  return <><canvas ref={canvasRef} className="cursor-trail" aria-hidden="true"/><div ref={cursorRef} className="custom-cursor" aria-hidden="true"><svg viewBox="0 0 32 32" fill="none" stroke="white" strokeWidth="1.5"><path/><path/><path/><path/></svg></div></>;
}
