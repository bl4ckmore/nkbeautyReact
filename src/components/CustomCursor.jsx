import { useEffect, useRef } from 'react';
import './CustomCursor.css';

export default function CustomCursor() {
  const glowRef = useRef(null);
  const ringRef = useRef(null);
  const dotRef  = useRef(null);

  useEffect(() => {
    let gx = -200, gy = -200; // glow position (slowest)
    let rx = -200, ry = -200; // ring position (medium)
    let tx = -200, ty = -200; // target (mouse)
    let raf;

    const lerp = (a, b, t) => a + (b - a) * t;

    const onMove = (e) => { tx = e.clientX; ty = e.clientY; };

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
      // Glow: very slow, heavy lag
      gx = lerp(gx, tx, 0.06);
      gy = lerp(gy, ty, 0.06);
      // Ring: medium lag
      rx = lerp(rx, tx, 0.14);
      ry = lerp(ry, ty, 0.14);

      if (glowRef.current) glowRef.current.style.transform = `translate(${gx - 60}px, ${gy - 60}px)`;
      if (ringRef.current) ringRef.current.style.transform = `translate(${rx - 16}px, ${ry - 16}px)`;
      if (dotRef.current)  dotRef.current.style.transform  = `translate(${tx - 2}px, ${ty - 2}px)`;

      raf = requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup',   onUp);
    document.addEventListener('mouseover', onOver);
    document.addEventListener('mouseout',  onOut);
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup',   onUp);
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseout',  onOut);
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