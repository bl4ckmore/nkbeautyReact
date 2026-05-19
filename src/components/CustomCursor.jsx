import { useEffect, useRef } from 'react';
import './CustomCursor.css';

export default function CustomCursor() {
  const glowRef = useRef(null);
  const ringRef = useRef(null);
  const dotRef  = useRef(null);

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    let gx = -200, gy = -200;
    let rx = -200, ry = -200;
    let tx = -200, ty = -200;
    let moved = false;
    let rafId;

    const lerp = (a, b, t) => a + (b - a) * t;

    const onMove = (e) => { tx = e.clientX; ty = e.clientY; moved = true; };

    const onOver = (e) => {
      if (e.target.matches('a, button, [data-cursor], input, select, textarea')) {
        ringRef.current?.classList.add('hover');
        glowRef.current?.classList.add('hover');
      }
    };
    const onOut = (e) => {
      if (e.target.matches('a, button, [data-cursor], input, select, textarea')) {
        ringRef.current?.classList.remove('hover');
        glowRef.current?.classList.remove('hover');
      }
    };
    const onDown = () => ringRef.current?.classList.add('press');
    const onUp   = () => ringRef.current?.classList.remove('press');

    const tick = () => {
      rafId = requestAnimationFrame(tick);
      if (!moved) return;

      gx = lerp(gx, tx, 0.06);
      gy = lerp(gy, ty, 0.06);
      rx = lerp(rx, tx, 0.14);
      ry = lerp(ry, ty, 0.14);

      if (glowRef.current) glowRef.current.style.transform = `translate(${gx - 60}px, ${gy - 60}px)`;
      if (ringRef.current) ringRef.current.style.transform = `translate(${rx - 16}px, ${ry - 16}px)`;
      if (dotRef.current)  dotRef.current.style.transform  = `translate(${tx - 2}px, ${ty - 2}px)`;

      const snap = 0.3;
      if (Math.abs(gx - tx) < snap && Math.abs(gy - ty) < snap &&
          Math.abs(rx - tx) < snap && Math.abs(ry - ty) < snap) {
        moved = false;
      }
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mousedown', onDown, { passive: true });
    window.addEventListener('mouseup',   onUp,   { passive: true });
    document.addEventListener('pointerover', onOver);
    document.addEventListener('pointerout',  onOut);
    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup',   onUp);
      document.removeEventListener('pointerover', onOver);
      document.removeEventListener('pointerout',  onOut);
    };
  }, []);

  return (
    <>
      <div ref={glowRef} className="cur-glow"  aria-hidden="true" />
      <div ref={ringRef} className="cur-ring"  aria-hidden="true" />
      <div ref={dotRef}  className="cur-dot"   aria-hidden="true" />
    </>
  );
}