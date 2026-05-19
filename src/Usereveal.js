import { useEffect } from 'react';

export function useReveal(threshold = 0.12, deps = []) {
  useEffect(() => {
    const selector = '.reveal, .reveal-left, .reveal-right, .reveal-scale';
    const elements = document.querySelectorAll(selector);

    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold });

    // Small delay so React has finished painting remounted DOM nodes
    const timer = setTimeout(() => {
      document.querySelectorAll(selector).forEach(el => obs.observe(el));
    }, 30);

    return () => {
      clearTimeout(timer);
      obs.disconnect();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [threshold, ...deps]);
}