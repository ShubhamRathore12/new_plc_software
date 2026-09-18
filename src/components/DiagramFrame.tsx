"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

interface DiagramFrameProps {
  label: string;
  machine?: string;
  live?: boolean;
  /** Upper bound on scale-up, so a small diagram is not blown into a blurry poster. */
  maxScale?: number;
  children: ReactNode;
}

/**
 * Bezel around the process diagram.
 *
 * The diagram lays out at a fixed natural size, so instead of scrolling it we
 * scale it to exactly fill the available width and let the frame's height
 * follow. Growing or shrinking the window re-fits it; nothing ever clips.
 */
export function DiagramFrame({
  label,
  machine,
  live = false,
  maxScale = 1.6,
  children,
}: DiagramFrameProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [height, setHeight] = useState<number>();

  const fit = useCallback(() => {
    const viewport = viewportRef.current;
    const content = contentRef.current;
    if (!viewport || !content) return;

    // offsetWidth/Height are pre-transform layout values, so they stay stable
    // no matter what scale is currently applied.
    const naturalWidth = content.offsetWidth;
    const naturalHeight = content.offsetHeight;
    if (!naturalWidth || !naturalHeight) return;

    const next = Math.min(viewport.clientWidth / naturalWidth, maxScale);
    setScale(next);
    setHeight(naturalHeight * next);
  }, [maxScale]);

  useEffect(() => {
    fit();

    const observer = new ResizeObserver(fit);
    if (viewportRef.current) observer.observe(viewportRef.current);
    if (contentRef.current) observer.observe(contentRef.current);
    window.addEventListener("resize", fit);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", fit);
    };
  }, [fit]);

  return (
    <div className="surface glow-edge relative overflow-hidden p-3 sm:p-4">
      {/* header strip */}
      <div className="mb-3 flex items-center justify-between gap-3 px-1">
        <div className="flex items-center gap-2.5">
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              live ? "pulse-dot bg-success" : "bg-muted-foreground/40"
            }`}
          />
          <span className="text-[10px] font-bold tracking-[0.22em] uppercase">
            {label}
          </span>
        </div>
        {machine && (
          <span className="text-muted-foreground font-mono text-[10px] font-semibold tracking-wider">
            {machine}
          </span>
        )}
      </div>

      {/* screen */}
      <div
        className="border-border/80 relative overflow-hidden rounded-xl border"
        style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.25)" }}
      >
        <div
          ref={viewportRef}
          className="relative w-full"
          style={{ height: height ? `${height}px` : undefined }}
        >
          <div
            ref={contentRef}
            className="absolute top-0 left-0 w-max origin-top-left"
            style={{ transform: `scale(${scale})` }}
          >
            {children}
          </div>
        </div>

        {/* corner ticks, drawn over the diagram edges */}
        {[
          "left-1.5 top-1.5 border-l-2 border-t-2",
          "right-1.5 top-1.5 border-r-2 border-t-2",
          "left-1.5 bottom-1.5 border-l-2 border-b-2",
          "right-1.5 bottom-1.5 border-r-2 border-b-2",
        ].map((pos) => (
          <span
            key={pos}
            aria-hidden
            className={`border-primary/50 pointer-events-none absolute h-3.5 w-3.5 rounded-[2px] ${pos}`}
          />
        ))}
      </div>
    </div>
  );
}

export default DiagramFrame;
