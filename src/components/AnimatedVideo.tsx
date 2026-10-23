'use client';

import { useEffect, useRef } from 'react';
import { usePrefersReducedMotion } from './usePageMotion';

/** Lazy, silent inline video with a persistent poster when autoplay is unavailable. */
export default function AnimatedVideo({ src, poster, active = true, className = '' }: {
  src: string; poster: string; active?: boolean; className?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    let disposed = false;
    let inView = false;
    let pending = false;
    let frame = 0;
    const permitted = () => !disposed && inView && active && !reduced && !window.matchMedia('(prefers-reduced-motion: reduce)').matches && !document.hidden;
    const sync = () => {
      if (!permitted()) { video.pause(); return; }
      if (video.getAttribute('src') !== src) {
        video.src = src;
        video.load();
      }
      // Set DOM properties as well as attributes for Safari's inline autoplay policy.
      video.muted = true;
      video.defaultMuted = true;
      video.playsInline = true;
      if (pending || !video.paused) return;
      pending = true;
      const attempt = video.play();
      if (attempt) attempt.then(() => {
        if (!disposed && !permitted()) video.pause();
      }).catch(() => { /* Keep the poster; retry on the next user gesture. */ }).finally(() => { pending = false; });
      else pending = false;
    };
    const measure = () => {
      const box = video.getBoundingClientRect();
      inView = box.bottom > 0 && box.top < window.innerHeight && box.right > 0 && box.left < window.innerWidth;
      sync();
    };
    const scheduleMeasure = () => {
      if (!frame) frame = requestAnimationFrame(() => { frame = 0; measure(); });
    };
    let observer: IntersectionObserver | undefined;
    if (typeof IntersectionObserver !== 'undefined') {
      observer = new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; sync(); }, { threshold: 0.01 });
      observer.observe(video);
    } else {
      window.addEventListener('scroll', scheduleMeasure, { passive: true });
      window.addEventListener('resize', scheduleMeasure);
    }
    measure();
    document.addEventListener('visibilitychange', sync);
    document.addEventListener('pointerup', sync, { passive: true });
    document.addEventListener('touchend', sync, { passive: true });
    document.addEventListener('keydown', sync);
    video.addEventListener('canplay', sync);
    return () => {
      disposed = true;
      observer?.disconnect();
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', scheduleMeasure);
      window.removeEventListener('resize', scheduleMeasure);
      document.removeEventListener('visibilitychange', sync);
      document.removeEventListener('pointerup', sync);
      document.removeEventListener('touchend', sync);
      document.removeEventListener('keydown', sync);
      video.removeEventListener('canplay', sync);
      video.pause();
    };
  }, [src, active, reduced]);

  return <video ref={ref} className={className} poster={poster} loop muted playsInline preload="none" aria-hidden="true" disablePictureInPicture />;
}
