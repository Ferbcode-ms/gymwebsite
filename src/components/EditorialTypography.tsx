"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function EditorialTypography() {
  const sectionRef = useRef<HTMLElement>(null);
  const line1Ref = useRef<HTMLDivElement>(null);
  const line2Ref = useRef<HTMLDivElement>(null);
  const line3Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    gsap.registerPlugin(ScrollTrigger);

    const section = sectionRef.current;
    const line1 = line1Ref.current;
    const line2 = line2Ref.current;
    const line3 = line3Ref.current;

    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
    const moveX1 = isMobile ? -45 : -85;
    const moveX2 = isMobile ? 45 : 85;
    const moveX3 = isMobile ? -30 : -85;

    // Scroll-driven opposing kinetic typography
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
      },
    });

    // 1st line goes slightly to left
    if (line1) {
      tl.to(
        line1,
        {
          x: moveX1,
          ease: "none",
        },
        0
      );
    }

    // 2nd line goes slightly to right
    if (line2) {
      tl.to(
        line2,
        {
          x: moveX2,
          ease: "none",
        },
        0
      );
    }

    // 3rd line goes slightly to left
    if (line3) {
      tl.to(
        line3,
        {
          x: moveX3,
          ease: "none",
        },
        0
      );
    }

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
      className="relative w-full bg-[var(--black-ish)] text-[var(--white-ish)] pt-16 pb-16 sm:pt-24 sm:pb-24 md:pt-36 md:pb-32 overflow-hidden select-none"
    >
      <div className="max-w-[1700px] w-full mx-auto px-5 sm:px-6 md:px-12 flex flex-col space-y-4 sm:space-y-6 md:space-y-8">
        {/* Row 1 - Left Offset 15% -> moves slightly to left on scroll */}
        <div
          ref={line1Ref}
          className="w-full pl-[2%] sm:pl-[4%] md:pl-[15%] will-change-transform"
        >
          <h2 className="font-heading text-4xl sm:text-6xl md:text-8xl lg:text-[7.5vw] font-black uppercase tracking-tight text-[var(--white-ish)] leading-[0.95]">
            Your couch is very
          </h2>
        </div>

        {/* Row 2 - Center-Right Offset 30% -> moves slightly to right on scroll */}
        <div
          ref={line2Ref}
          className="w-full pl-[4%] sm:pl-[8%] md:pl-[30%] will-change-transform"
        >
          <h2 className="font-heading text-4xl sm:text-6xl md:text-8xl lg:text-[7.5vw] font-black uppercase tracking-tight text-[var(--white-ish)] leading-[0.95]">
            tastier if you add it
          </h2>
        </div>

        {/* Row 3 - Left Offset 5% -> moves slightly to left on scroll */}
        <div
          ref={line3Ref}
          className="w-full pl-[1%] sm:pl-[2%] md:pl-[5%] will-change-transform"
        >
          <h2 className="font-heading text-4xl sm:text-6xl md:text-8xl lg:text-[7.5vw] font-black uppercase tracking-tight text-[var(--white-ish)] leading-[0.95]">
            exhausted lies
          </h2>
        </div>
      </div>
    </section>
  );
}
