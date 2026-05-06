import { useEffect } from 'react';

export function useReveal(threshold = 0.12) {
  useEffect(() => {
    const selector = '.reveal, .reveal-left, .reveal-right, .reveal-scale';
    const elements = document.querySelectorAll(selector);

    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Element entered viewport → play animation
          entry.target.classList.add('visible');
        } else {
          // Element left viewport → reset so it replays next time
          entry.target.classList.remove('visible');
        }
      });
    }, { threshold });

    elements.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, [threshold]);
}
