"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { DEFAULT_SERVICES } from "@/lib/cms/defaults";
import { ServiceItem } from "@/lib/cms/types";

const SERVICES: ServiceItem[] = DEFAULT_SERVICES;

export function ServicesSection({ initialServices }: { initialServices?: ServiceItem[] } = {}) {
  const services = initialServices && initialServices.length > 0 ? initialServices : SERVICES;
  const sectionRef = useRef<HTMLElement>(null);
  const arcRef = useRef<HTMLDivElement>(null);
  const rowsRef = useRef<(HTMLDivElement | null)[]>([]);
  const previewRef = useRef<HTMLDivElement>(null);

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [openMobileIndex, setOpenMobileIndex] = useState<number | null>(null);

  // Track cursor position and hovered index for smooth quickTo tracking
  const lastMouse = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const hoveredIndexRef = useRef<number | null>(null);
  hoveredIndexRef.current = hoveredIndex;

  // GSAP quickTo references
  const xTo = useRef<gsap.QuickToFunc | null>(null);
  const yTo = useRef<gsap.QuickToFunc | null>(null);

  // Setup GSAP quickTo on mount
  useEffect(() => {
    if (previewRef.current) {
      gsap.set(previewRef.current, {
        xPercent: -50,
        yPercent: -50,
        
        scale: 0,
        opacity: 0,
      });
      xTo.current = gsap.quickTo(previewRef.current, "x", {
        duration: 0.35,
        ease: "power2.out",
      });
      yTo.current = gsap.quickTo(previewRef.current, "y", {
        duration: 0.35,
        ease: "power2.out",
      });
    }
  }, []);

  // GSAP ScrollTrigger for Arc and Rows reveal
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // 1. Signature Arc upward motion
      if (arcRef.current && sectionRef.current) {
        gsap.to(arcRef.current, {
          y: -140,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "top top",
            scrub: 1,
          },
        });
      }

      // 2. Rows reveal on scroll
      rowsRef.current.forEach((row) => {
        if (!row) return;
        gsap.fromTo(
          row,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: row,
              start: "top 90%",
              once: true,
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Hide the floating preview modal smoothly
  const hidePreviewModal = () => {
    if (hoveredIndexRef.current !== null) {
      setHoveredIndex(null);
    }
    if (previewRef.current) {
      gsap.to(previewRef.current, {
        scale: 0,
        opacity: 0,
        duration: 0.2,
        ease: "power2.in",
      });
    }
  };

  // Check if cursor is strictly within section boundaries
  const isCursorInsideSection = (x: number, y: number): boolean => {
    if (!sectionRef.current) return false;
    const rect = sectionRef.current.getBoundingClientRect();
    return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
  };

  // Global mousemove and scroll handlers with strict section boundary checks
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      lastMouse.current = { x: e.clientX, y: e.clientY };

      if (!isCursorInsideSection(e.clientX, e.clientY)) {
        hidePreviewModal();
        return;
      }

      if (xTo.current && yTo.current) {
        xTo.current(e.clientX);
        yTo.current(e.clientY);
      }
    };

    const handleGlobalScroll = () => {
      if (lastMouse.current.x === 0 && lastMouse.current.y === 0) return;

      if (!isCursorInsideSection(lastMouse.current.x, lastMouse.current.y)) {
        hidePreviewModal();
        return;
      }

      if (xTo.current && yTo.current) {
        xTo.current(lastMouse.current.x);
        yTo.current(lastMouse.current.y);
      }

      // Check which row is under the cursor during scroll
      const targetEl = document.elementFromPoint(lastMouse.current.x, lastMouse.current.y);
      if (targetEl) {
        const rowEl = targetEl.closest("[data-service-index]");
        if (rowEl) {
          const idxAttr = rowEl.getAttribute("data-service-index");
          if (idxAttr !== null) {
            const idx = parseInt(idxAttr, 10);
            if (!isNaN(idx)) {
              if (hoveredIndexRef.current !== idx) {
                setHoveredIndex(idx);
                if (previewRef.current) {
                  gsap.to(previewRef.current, {
                    scale: 1,
                    opacity: 1,
                    duration: 0.15,
                    ease: "power3.out",
                  });
                }
              }
              return;
            }
          }
        }
      }

      hidePreviewModal();
    };

    window.addEventListener("mousemove", handleGlobalMouseMove);
    window.addEventListener("scroll", handleGlobalScroll, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleGlobalMouseMove);
      window.removeEventListener("scroll", handleGlobalScroll);
    };
  }, []);

  const handleMouseEnter = (index: number) => {
    setHoveredIndex(index);
    if (previewRef.current) {
      gsap.to(previewRef.current, {
        scale: 1,
        opacity: 1,
        duration: 0.35,
        ease: "power3.out",
      });
    }
  };

  const toggleMobileRow = (index: number) => {
    setOpenMobileIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section
      ref={sectionRef}
      id="aanbod-section"
      onMouseLeave={hidePreviewModal}
      className="relative w-full bg-[var(--white-ish)] text-[var(--black-ish)] pt-16 pb-24 md:pt-28 md:pb-36 select-none"
    >
      {/* Signature Curved Top-Bubble Transition to Light Mode with Upward Scroll Motion */}
      <div
        ref={arcRef}
        className="absolute top-0 left-0 right-0 w-full  pointer-events-none will-change-transform"
      >
        <div className="top-bubble-wrap">
          <div className="top-bubble is-light" />
        </div>
        {/* Continuous light background fill beneath the upward-moving arc */}
        <div className="w-full bg-[var(--white-ish)] h-[200px]" />
      </div>

      {/* Desktop Floating Cursor Preview Modal (Hidden by default to prevent initial load flash) */}
      <div
        ref={previewRef}
        className="fixed top-0 left-0 w-72 h-80 sm:w-80 sm:h-96 md:w-[480px] md:h-[400px] lg:w-[540px] lg:h-[440px] pointer-events-none z-50 p-3 sm:p-4 hidden md:block transform-gpu opacity-0 scale-0"
        style={{
          willChange: "transform",
          opacity: 0,
          transform: "scale(0)",
          pointerEvents: "none",
        }}
      >
        <div className="relative w-full h-full overflow-hidden bg-neutral-900 shadow-inner">
          {/* Vertical sliding image track with luxury cubic-bezier easing */}
          <div
            className="w-full h-full will-change-transform flex flex-col"
            style={{
              transform: `translate3d(0, -${(hoveredIndex ?? 0) * 100}%, 0)`,
              transition: "transform 0.5s cubic-bezier(0.76, 0, 0.24, 1)",
            }}
          >
            {services.map((service) => (
              <div
                key={service.id}
                className="relative w-full h-full flex-shrink-0 overflow-hidden"
              >
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  sizes="540px"
                  className="object-cover brightness-95"
                />

                {/* Dark Vignette Overlay with Category Badge, Watermark Number, and Info */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent p-6 sm:p-8 flex flex-col justify-between pointer-events-none">
                  <div className="flex justify-between items-start">
                    <span className="font-mono text-xs uppercase tracking-widest text-[var(--black-ish)] bg-[var(--green-yellow)] font-bold px-3 py-1 shadow-sm">
                      {service.category}
                    </span>
                    <span className="font-heading text-7xl font-black text-white/20 select-none">
                      {service.num}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <h4 className="font-heading text-3xl sm:text-4xl font-black uppercase text-white tracking-tight">
                      {service.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-white/80 line-clamp-2 max-w-md font-sans">
                      {service.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-[1700px] w-full mx-auto px-5 sm:px-6 md:px-12 relative z-10">
        {/* Services Interactive List (Photography Website Style) */}
        <div className="space-y-0 border-t-2 border-[var(--green-yellow)]" onMouseLeave={hidePreviewModal}>
          {services.map((service, index) => {
            const isMobileOpen = openMobileIndex === index;
            const isHovered = hoveredIndex === index;

            return (
              <div
                key={service.id}
                data-service-index={index}
                ref={(el) => {
                  rowsRef.current[index] = el;
                }}
                onMouseEnter={() => handleMouseEnter(index)}
                onClick={() => toggleMobileRow(index)}
                className={`group border-b-2 border-[var(--green-yellow)] py-6 sm:py-10 md:py-16 flex flex-col justify-between transition-all duration-500 hover:bg-black/[0.02] px-2 sm:px-6 cursor-pointer ${
                  hoveredIndex !== null && !isHovered ? "opacity-30" : "opacity-100"
                }`}
              >
                <div className="flex flex-row justify-between items-center gap-4 w-full">
                  {/* Left: Number + Heading */}
                  <div className="flex flex-row items-center gap-3 sm:gap-6 md:gap-12 min-w-0">
                    <span className="font-mono text-xs sm:text-base font-bold text-[var(--black-ish)]/40 group-hover:text-[var(--black-ish)] transition-colors duration-300 flex-shrink-0">
                      {service.num}
                    </span>
                    <h3 className="font-heading text-3xl sm:text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-black uppercase tracking-tight leading-none transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] md:group-hover:translate-x-6 text-[var(--black-ish)]">
                      {service.title}
                    </h3>
                  </div>

                  {/* Right: Arrow Circle on desktop / Round Toggle on mobile */}
                  <div className="flex items-center gap-4 sm:gap-8 flex-shrink-0">
                    <ArrowUpRight className="hidden md:block w-12 h-12 lg:w-15 lg:h-15 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    <div className="w-9 h-9 rounded-full border border-black/20 flex items-center justify-center md:hidden font-mono text-lg text-[var(--black-ish)] font-bold">
                      {isMobileOpen ? "−" : "+"}
                    </div>
                  </div>
                </div>

                {/* Mobile Tap-to-Expand Drawer */}
                <div
                  className={`overflow-hidden md:hidden transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${
                    isMobileOpen ? "max-h-[600px] opacity-100 mt-6" : "max-h-0 opacity-0"
                  }`}
                >
                  <p className="text-base text-[var(--black-ish)]/80 mb-4 leading-relaxed font-sans">
                    {service.description}
                  </p>
                  <div className="relative w-full aspect-video overflow-hidden rounded-2xl bg-black/5 shadow-md">
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 400px"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
