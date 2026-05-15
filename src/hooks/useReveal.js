import { useEffect } from 'react';

export function useReveal(threshold = 0.12, deps = []) {
  useEffect(() => {
    const selector = '.reveal, .reveal-left, .reveal-right, .reveal-scale';
    const elements = document.querySelectorAll(selector);

    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        } else {
          entry.target.classList.remove('visible');
        }
      });
    }, { threshold });

    elements.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [threshold, ...deps]);
}
