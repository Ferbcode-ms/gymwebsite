"use client";

import React, { useEffect, useRef } from "react";
import { ArrowDown } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SiteContent } from "@/lib/cms/types";

export function Hero({ initialHero }: { initialHero?: SiteContent["hero"] } = {}) {
  const heroRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!heroRef.current) return;
    gsap.registerPlugin(ScrollTrigger);

    const hero = heroRef.current;
    const content = contentRef.current;
    const button = buttonRef.current;
    const nextSection = document.getElementById("sticky-media");

    // Smooth upward parallax as StickyMedia scrolls over the hero
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: hero,
        start: "top top",
        end: () => `+=${window.innerHeight}`,
        scrub: 1,
      },
    });

    if (content) {
      tl.to(
        content,
        {
          y: -100, // subtle upward movement as media covers it
      
          ease: "none",
        },
        0
      );
    }

    if (button) {
      tl.to(
        button,
        {
          y: -90,
          scale: 0.9,
          ease: "none",
        },
        0
      );
    }

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === hero) st.kill();
      });
    };
  }, []);
  const scrollToNext = () => {
    const nextSection = document.getElementById("sticky-media");
    if (nextSection) {
      const lenis = (window as unknown as { lenis?: { scrollTo: (target: Element | string, opts?: { duration?: number }) => void } }).lenis;
      if (lenis) {
        lenis.scrollTo(nextSection, { duration: 1.2 });
      } else {
        nextSection.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <section
      id="hero-section"
      ref={heroRef}
      className="sticky top-0 h-[100dvh] w-full bg-[var(--white-ish)] z-0 flex flex-col justify-end px-5 pb-16 pt-24 sm:px-12 sm:pb-28 sm:pt-36 lg:px-16 overflow-hidden will-change-transform"
    >
      <div
        ref={contentRef}
        className="max-w-[1700px] w-full mx-auto flex flex-col lg:flex-row lg:items-end justify-between gap-8 sm:gap-12 lg:gap-16 will-change-transform"
      >
        {/* Main Display Headline */}
        <div className="flex-1">
          <h1 className="font-heading text-5xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[11vw] font-black text-[var(--black-ish)] uppercase leading-[0.9] tracking-tighter">
            <span className="block overflow-hidden">
              <span className="inline-block transform transition-transform duration-700 ease-out">
                Train today.
              </span>
            </span>
            <span className="block overflow-hidden mt-1 sm:mt-2">
              <span className="inline-block transform transition-transform duration-700 ease-out delay-150">
                Grow tomorrow.
              </span>
            </span>
          </h1>
        </div>

        {/* Editorial Subtitle / Bio */}
        <div className="max-w-xl lg:max-w-md xl:max-w-lg lg:pb-4 pr-16 sm:pr-0">
          <p className="text-base sm:text-lg md:text-2xl text-[var(--black-ish)] font-normal leading-relaxed">
            {initialHero?.subheadline ||
              "Apex Fitness is your premier destination to achieve lasting strength, energy, and athletic performance with state-of-the-art facilities and elite coaches."}
          </p>
        </div>
      </div>

      {/* Circular Scroll Down Indicator */}
      <button
        ref={buttonRef}
        onClick={scrollToNext}
        className="absolute bottom-4 right-4 sm:bottom-10 sm:right-10 z-20 w-14 h-14 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full bg-[var(--green-yellow)] text-[var(--black-ish)] flex items-center justify-center cursor-pointer shadow-lg hover:scale-105 active:scale-95 transition-all duration-300 group focus:outline-none will-change-transform"
        aria-label="Scroll down"
      >
        <div className="relative h-6 w-6 sm:h-8 sm:w-8 overflow-hidden flex items-center justify-center">
          <ArrowDown className="w-5 h-5 sm:w-7 sm:h-7 animate-scroll-arrow text-[var(--black-ish)]" />
        </div>
      </button>
    </section>
  );
}
