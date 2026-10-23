"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface MarqueeTickerProps {
  text?: string;
  className?: string;
  textColor?: string;
  bgColor?: string;
}

export function MarqueeTicker({
  text = "START FAST. FINISH FASTER.",
  className = "",
  textColor = "text-[var(--green-yellow)]",
  bgColor = "bg-[var(--black-ish)]",
}: MarqueeTickerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !trackRef.current) return;
    gsap.registerPlugin(ScrollTrigger);

    const container = containerRef.current;
    const track = trackRef.current;

    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
    const xDistance = isMobile ? -350 : -750;

    // Scroll down moves to left, scroll up moves in opposite direction (right)
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
      },
    });

    tl.to(track, {
      x: xDistance,
      ease: "none",
    });

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === container) st.kill();
      });
    };
  }, []);

  // Repeat the phrase multiple times for a wide continuous banner
  const phrases = Array(12).fill(text);

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden py-8 sm:py-14 select-none ${bgColor} ${className}`}
      aria-hidden="true"
    >
      <div
        ref={trackRef}
        className="flex w-max space-x-6 sm:space-x-12 will-change-transform"
      >
        {phrases.map((phrase, index) => (
          <span
            key={index}
            className={`font-heading text-5xl sm:text-7xl md:text-8xl font-black uppercase tracking-tight whitespace-nowrap ${textColor}`}
          >
            {phrase}
          </span>
        ))}
      </div>
    </div>
  );
}
