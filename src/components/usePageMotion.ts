'use client';

import { useEffect, useSyncExternalStore } from 'react';

const reducedQuery = '(prefers-reduced-motion: reduce)';
function subscribeReduced(onChange: () => void) {
  const query = window.matchMedia(reducedQuery);
  if (query.addEventListener) {
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }
  query.addListener(onChange);
  return () => query.removeListener(onChange);
}

// Keep the server and first client render identical, including on motion-limited devices.
export function usePrefersReducedMotion() {
  return useSyncExternalStore(subscribeReduced, () => window.matchMedia(reducedQuery).matches, () => false);
}

export function usePageMotion() {
  useEffect(() => {
    const root = document.documentElement;
    const visibility = () => { root.dataset.pageHidden = String(document.hidden); };
    visibility();
    document.addEventListener('visibilitychange', visibility);

    const sections = document.querySelectorAll('main > section');
    const reveals = document.querySelectorAll<HTMLElement>('[data-reveal]');
    let sectionObserver: IntersectionObserver | undefined;
    let revealObserver: IntersectionObserver | undefined;
    if ('IntersectionObserver' in window) {
      sectionObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => { (entry.target as HTMLElement).dataset.motionActive = String(entry.isIntersecting); });
      });
      sections.forEach(section => sectionObserver!.observe(section));
      revealObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          (entry.target as HTMLElement).dataset.reveal = 'entered';
          revealObserver!.unobserve(entry.target);
        });
      }, { threshold: 0.05 });
      reveals.forEach(element => {
        // Content stays readable before hydration and when JS/observers are unavailable.
        if (element.getBoundingClientRect().top >= window.innerHeight) element.dataset.reveal = 'pending';
        revealObserver!.observe(element);
      });
    }
    root.dataset.appReady = 'true';
    return () => {
      sectionObserver?.disconnect();
      revealObserver?.disconnect();
      document.removeEventListener('visibilitychange', visibility);
      sections.forEach(section => section.removeAttribute('data-motion-active'));
      reveals.forEach(element => { element.dataset.reveal = ''; });
      delete root.dataset.pageHidden;
      delete root.dataset.appReady;
    };
  }, []);
}
