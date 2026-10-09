import React, { useEffect, useState } from 'react';

interface BlogScrollProgressBarProps {
  /**
   * Optional custom target element id or reference.
   * Defaults to 'blog' (the id of BlogSection container).
   */
  targetId?: string;
  /**
   * Title or label of currently active article or section.
   */
  activeTitle?: string;
}

export function BlogScrollProgressBar({
  targetId = 'blog',
  activeTitle
}: BlogScrollProgressBarProps) {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let ticking = false;

    const calculateProgress = () => {
      const section = document.getElementById(targetId);
      if (!section) {
        setIsVisible(false);
        return;
      }

      const rect = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      // Section is considered active when its top is within or above viewport and bottom is still below or within viewport
      const totalHeight = rect.height;
      const visibleStart = rect.top;
      
      // When the top of the blog section enters the top quarter of the viewport
      const thresholdStart = viewportHeight * 0.3;
      
      if (rect.bottom <= 0 || rect.top >= viewportHeight) {
        setIsVisible(false);
        setProgress(0);
        return;
      }

      // Calculate how far down the user has scrolled through the blog section
      // 0% when top reaches thresholdStart, 100% when bottom reaches the bottom of viewport
      const distanceScrolled = thresholdStart - visibleStart;
      const scrollableDistance = totalHeight + thresholdStart - viewportHeight;

      if (scrollableDistance <= 0) {
        setProgress(100);
        setIsVisible(true);
        return;
      }

      const currentProgress = Math.min(100, Math.max(0, (distanceScrolled / scrollableDistance) * 100));
      setProgress(currentProgress);
      setIsVisible(true);
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          calculateProgress();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    calculateProgress();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [targetId]);

  if (!isVisible && progress === 0) {
    return null;
  }

  return (
    <div
      aria-hidden="true"
      className={`fixed top-0 left-0 right-0 z-50 pointer-events-none transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* High-tech glow bar background track */}
      <div className="relative w-full h-[3px] bg-neutral-900/60 backdrop-blur-sm">
        {/* Dynamic gradient reading progress bar */}
        <div
          className="h-full bg-gradient-to-r from-cyan-500 via-sky-400 to-teal-300 shadow-[0_0_10px_rgba(6,182,212,0.7)] transition-[width] duration-150 ease-out"
          style={{ width: `${progress}%` }}
        />

        {/* Pulsing leading spark dot at the progress edge */}
        {progress > 0 && progress < 100 && (
          <div
            className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-cyan-300 shadow-[0_0_8px_#38bdf8] -ml-1 transition-[left] duration-150 ease-out"
            style={{ left: `${progress}%` }}
          />
        )}
      </div>

      {/* Subtle indicator tag when reading inside the blog section */}
      {isVisible && progress > 2 && (
        <div className="absolute top-2 right-4 sm:right-8 transition-opacity duration-300">
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-neutral-950/85 border border-cyan-500/30 text-[10px] font-mono text-cyan-400/90 shadow-lg backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-neutral-400">Blog:</span>
            <span className="font-semibold text-cyan-300">{Math.round(progress)}%</span>
            {activeTitle && (
              <span className="hidden md:inline text-neutral-400 max-w-[150px] truncate border-l border-neutral-800 pl-1.5 ml-1">
                {activeTitle}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
