"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function StickyMedia() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const imageInnerRef = useRef<HTMLDivElement>(null);
  const arcRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !frameRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    const section = sectionRef.current;
    const frame = frameRef.current;
    const inner = imageInnerRef.current;

    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
    const initialWidth = isMobile ? "65%" : "25%";
    const initialHeight = isMobile ? "40vh" : "50vh";
    const initialRadius = isMobile ? "16px" : "24px";

    // Initial state: 25% width (65% on mobile), rounded corners, positioned below center
    gsap.set(frame, {
      width: initialWidth,
      height: initialHeight,
      y: 80,
      opacity: 0.9,
      borderRadius: initialRadius,
    });

    if (inner) {
      gsap.set(inner, { scale: 1.25 });
    }

    // Scroll-driven animation: as StickyMedia scrolls over the pinned hero
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top bottom",    // Start when top of section reaches bottom of viewport
        end: "top top",         // End when top of section reaches top of viewport
        scrub: 1,
      },
    });

    // 1. Image rises up into center
    tl.to(frame, {
      y: 0,
      opacity: 1,
      duration: 0.3,
      ease: "power2.out",
    }, 0);

    // 2. Width expands from 25% → 100%, height to full screen, corners flatten
    tl.to(frame, {
      width: "100%",
      height: "100vh",
      borderRadius: "0px",
      ease: "power2.inOut",
      duration: 0.75,
    }, 0.1);

    // 3. Inner image counter-scale for parallax feel
    if (inner) {
      tl.to(inner, {
        scale: 1.0,
        ease: "power2.inOut",
        duration: 0.75,
      }, 0.1);
    }

    // 4. Arc moves upward on scroll as StickyMedia transitions into the dark section
    const arc = arcRef.current;
    if (arc) {
      gsap.to(arc, {
        y: -140,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "bottom bottom",
          end: "bottom top",
          scrub: 1,
        },
      });
    }

    // Refresh ScrollTrigger to ensure pin and trigger bounds are perfectly synchronized
    ScrollTrigger.refresh();

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === section) st.kill();
      });
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="sticky-media"
      className="relative z-10 w-full min-h-screen bg-transparent flex items-center justify-center overflow-hidden pointer-events-none"
    >
      {/* Animated Image Frame: 25% → 100% width */}
      <div
        ref={frameRef}
        className="relative overflow-hidden shadow-2xl flex items-center justify-center pointer-events-auto will-change-[width,height,transform,border-radius]"
        style={{
          width: "25%",
          height: "50vh",
          borderRadius: "24px",
          transform: "translateY(80px)",
        }}
      >
        <div ref={imageInnerRef} className="relative w-full h-full will-change-transform">
          <Image
            src="https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=1600&q=80"
            alt="Athlete intense strength training workout at Apex Fitness"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center filter brightness-95 contrast-105"
          />
          {/* Subtle cinematic vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 pointer-events-none" />
        </div>
      </div>

      {/* Curved Top-Bubble Transition to Dark Mode with Upward Scroll Motion */}
      <div
        ref={arcRef}
        className="absolute -bottom-45 left-0 right-0 w-full z-20 pointer-events-none will-change-transform"
      >
        <div className="top-bubble-wrap relative">
          <div className="top-bubble bg-[var(--black-ish)]" />
        </div>
        {/* Continuous dark background fill beneath the upward-moving arc */}
        <div className="w-full bg-[var(--black-ish)] h-[200px]" />
      </div>
    </section>
  );
}
