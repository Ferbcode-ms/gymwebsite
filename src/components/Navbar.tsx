"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";

function FacebookIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function InstagramIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

interface NavbarProps {
  onOpenTrial?: () => void;
}

export function Navbar({ onOpenTrial }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  // Lock body scroll and synchronize Lenis while open
  useEffect(() => {
    const lenis = (window as unknown as { lenis?: { stop: () => void; start: () => void } }).lenis;
    if (isMenuOpen && !isClosing) {
      document.body.style.overflow = "hidden";
      lenis?.stop();
    } else if (!isMenuOpen) {
      document.body.style.overflow = "";
      lenis?.start();
    }
    return () => {
      document.body.style.overflow = "";
      lenis?.start();
    };
  }, [isMenuOpen, isClosing]);

  // GSAP Animations synchronized with menu open/close state
  useEffect(() => {
    const isDesktop = typeof window !== "undefined" && window.innerWidth >= 768;

    if (isMenuOpen && !isClosing) {
      // OPEN ANIMATION: Park items above, then drop UP TO DOWN
      if (isDesktop) {
        gsap.set(".nav-divider", {
          scaleY: 0,
          scaleX: 1,
          transformOrigin: "top center",
          opacity: 1,
        });
      } else {
        gsap.set(".nav-divider", {
          scaleX: 0,
          scaleY: 1,
          transformOrigin: "center center",
          opacity: 1,
        });
      }
      gsap.set(".nav-link-anim", { y: -120, opacity: 0 });
      gsap.set(".nav-link-mobile", { y: -50, opacity: 0 });
      gsap.set(".nav-contact-item", { y: -40, opacity: 0 });

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // 1. Dividers draw down (desktop) or expand outward (mobile)
      tl.to(
        ".nav-divider",
        {
          scaleX: 1,
          scaleY: 1,
          duration: 0.65,
          ease: "power2.inOut",
          stagger: 0.08,
        },
        0.15
      );

      // 2. Desktop rotated links drop UP TO DOWN with delay & stagger
      tl.to(
        ".nav-link-anim",
        {
          y: 0,
          opacity: 1,
          duration: 0.85,
          stagger: 0.16,
        },
        0.32
      );

      // 2b. Mobile centered links drop UP TO DOWN
      tl.to(
        ".nav-link-mobile",
        {
          y: 0,
          opacity: 1,
          duration: 0.65,
          stagger: 0.14,
        },
        0.32
      );

      // 3. Contact items drop into place
      tl.to(
        ".nav-contact-item",
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.08,
        },
        0.52
      );
    } else if (isClosing) {
      // CLOSE ANIMATION: Links glide DOWN TO UP (towards negative Y)
      const tlClose = gsap.timeline({ defaults: { ease: "power2.in" } });

      tlClose.to(
        ".nav-link-anim",
        {
          y: -120,
          opacity: 0,
          duration: 0.35,
          stagger: 0.05,
        },
        0
      );

      tlClose.to(
        ".nav-link-mobile",
        {
          y: -50,
          opacity: 0,
          duration: 0.3,
          stagger: 0.04,
        },
        0
      );

      tlClose.to(
        ".nav-contact-item",
        {
          y: -40,
          opacity: 0,
          duration: 0.25,
          stagger: 0.03,
        },
        0
      );

      tlClose.to(
        ".nav-divider",
        {
          scaleX: isDesktop ? 1 : 0,
          scaleY: isDesktop ? 0 : 1,
          duration: 0.3,
        },
        0.06
      );
    }
  }, [isMenuOpen, isClosing]);

  const openMenu = () => {
    setIsMenuOpen(true);
    setIsClosing(false);
  };

  const closeMenu = (targetHash?: string) => {
    if (!isMenuOpen || isClosing) return;
    setIsClosing(true);

    setTimeout(() => {
      setIsMenuOpen(false);
      setIsClosing(false);
      document.body.style.overflow = "";

      if (targetHash) {
        const el = document.querySelector(targetHash);
        if (el) {
          const lenis = (window as unknown as { lenis?: { scrollTo: (target: Element | string, opts?: { duration?: number }) => void } }).lenis;
          if (lenis) {
            lenis.scrollTo(el, { duration: 1.2 });
          } else {
            el.scrollIntoView({ behavior: "smooth" });
          }
        }
      }
    }, 550);
  };

  const toggleMenu = () => {
    if (isMenuOpen && !isClosing) {
      closeMenu();
    } else if (!isMenuOpen) {
      openMenu();
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMenuOpen && !isClosing) {
        closeMenu();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isMenuOpen, isClosing]);

  return (
    <>
      {/* Fixed Floating Brand Wordmark (Standalone Exclusion Blend Mode) */}
      <Link
        href="/"
        className="fixed top-6 left-6 md:top-8 md:left-10 z-50 mbm-ex select-none pointer-events-auto transition-transform duration-200 hover:scale-105"
        onClick={(e) => {
          if (isMenuOpen && !isClosing) {
            e.preventDefault();
            closeMenu();
          }
        }}
        aria-label="Apex Fitness Home"
      >
        <img
          src="/apex-logo-white.svg"
          alt="Apex Fitness"
          className="h-8 sm:h-9 md:h-12 w-auto select-none"
        />
      </Link>

      {/* Fixed Floating Free Trial Pill Button */}
      {!isMenuOpen && (
        <button
          onClick={() => {
            const footerForm = document.getElementById("contact-section");
            if (footerForm) {
              const lenis = (window as unknown as { lenis?: { scrollTo: (target: Element | string, opts?: { duration?: number }) => void } }).lenis;
              if (lenis) {
                lenis.scrollTo(footerForm, { duration: 1.2 });
              } else {
                footerForm.scrollIntoView({ behavior: "smooth" });
              }
            }
            onOpenTrial?.();
          }}
          className="fixed top-5 right-28 md:top-7 md:right-32 z-50 !hidden md:!inline-flex apex-btn-pill px-4 md:px-12 py-3.5 text-sm md:text-xl cursor-pointer shadow-sm pointer-events-auto"
        >
          Free Trial lesson
        </button>
      )}

      {/* Fixed Floating Menu / Close Toggle Button (Standalone Exclusion Blend Mode) */}
      <button
        onClick={toggleMenu}
        className="fixed top-5 right-6 md:top-7 md:right-10 z-50 mbm-ex text-white font-sans text-xl md:text-2xl font-bold cursor-pointer py-2 px-3 select-none transition-all duration-200 hover:opacity-80 outline-none focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0 border-0 pointer-events-auto"
        aria-expanded={isMenuOpen && !isClosing}
        aria-label={isMenuOpen && !isClosing ? "Close menu" : "Open menu"}
      >
        {isMenuOpen && !isClosing ? "Close" : "Menu"}
      </button>

      {/* Full-Screen Architectural Navigation Drawer */}
      <div
        ref={drawerRef}
        data-lenis-prevent
        className={`fixed inset-0 z-40 bg-[var(--white-ish)] text-[var(--black-ish)] transition-transform duration-600 ease-[cubic-bezier(0.76,0,0.24,1)] flex flex-col justify-between h-[100dvh] max-h-[100dvh] overflow-y-auto md:overflow-hidden ${
          isMenuOpen && !isClosing
            ? "translate-y-0 pointer-events-auto"
            : "-translate-y-full pointer-events-none"
        }`}
      >
        {/* Architectural Grid: Desktop 4 Columns / Mobile Stack */}
        <div className="flex-1 w-full flex flex-col md:flex-row relative min-h-0 pt-20 sm:pt-24 md:pt-0 pb-12 md:pb-0">
          {/* Column 1: OFFER */}
          <Link
            href="#aanbod-section"
            onClick={() => closeMenu("#aanbod-section")}
            className="w-full h-auto md:h-full md:w-[18%] lg:w-[20%] flex items-center justify-center py-5 sm:py-6 md:py-0 relative overflow-hidden group cursor-pointer select-none"
          >
            {/* Desktop Centered with 3D Flip Effect (GSAP Animated with Delay) */}
            <div className="hidden md:flex w-full h-full items-center justify-center relative">
              <div className="nav-link-anim flex items-center justify-center">
                <div className="nav-90-wrap">
                  <div className="nav-flip-track">
                    <span className="nav-flip-1">OFFER</span>
                    <span className="nav-flip-2">OFFER</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile View: Centered responsive design */}
            <div className="md:hidden flex items-center justify-center w-full nav-link-mobile">
              <span className="font-heading text-4xl sm:text-5xl font-black uppercase tracking-tight text-[var(--black-ish)] text-center transition-opacity duration-200 group-hover:opacity-75">
                OFFER
              </span>
            </div>
          </Link>

          {/* Full-Height Vertical Divider 1 on Desktop / Horizontal Divider 1 on Mobile */}
          <div className="nav-divider w-full md:w-[2px] h-[1.5px] md:h-full bg-[var(--green-yellow)] flex-none" />

          {/* Column 2: ABOUT US */}
          <Link
            href="#about-section"
            onClick={() => closeMenu("#about-section")}
            className="w-full h-auto md:h-full md:w-[22%] lg:w-[24%] flex items-center justify-center py-5 sm:py-6 md:py-0 relative overflow-hidden group cursor-pointer select-none"
          >
            {/* Desktop Centered with 3D Flip Effect (GSAP Animated with Delay) */}
            <div className="hidden md:flex w-full h-full items-center justify-center relative">
              <div className="nav-link-anim flex items-center justify-center">
                <div className="nav-90-wrap">
                  <div className="nav-flip-track">
                    <span className="nav-flip-1">ABOUT US</span>
                    <span className="nav-flip-2">ABOUT US</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile View: Centered responsive design */}
            <div className="md:hidden flex items-center justify-center w-full nav-link-mobile">
              <span className="font-heading text-4xl sm:text-5xl font-black uppercase tracking-tight text-[var(--black-ish)] text-center transition-opacity duration-200 group-hover:opacity-75">
                ABOUT US
              </span>
            </div>
          </Link>

          {/* Full-Height Vertical Divider 2 on Desktop / Horizontal Divider 2 on Mobile */}
          <div className="nav-divider w-full md:w-[2px] h-[1.5px] md:h-full bg-[var(--green-yellow)] flex-none" />

          {/* Column 3: CONTACT */}
          <Link
            href="#contact-section"
            onClick={() => closeMenu("#contact-section")}
            className="w-full h-auto md:h-full md:w-[22%] lg:w-[24%] flex items-center justify-center py-5 sm:py-6 md:py-0 relative overflow-hidden group cursor-pointer select-none"
          >
            {/* Desktop Centered with 3D Flip Effect (GSAP Animated with Delay) */}
            <div className="hidden md:flex w-full h-full items-center justify-center relative">
              <div className="nav-link-anim flex items-center justify-center">
                <div className="nav-90-wrap">
                  <div className="nav-flip-track">
                    <span className="nav-flip-1">CONTACT</span>
                    <span className="nav-flip-2">CONTACT</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile View: Centered responsive design */}
            <div className="md:hidden flex items-center justify-center w-full nav-link-mobile">
              <span className="font-heading text-4xl sm:text-5xl font-black uppercase tracking-tight text-[var(--black-ish)] text-center transition-opacity duration-200 group-hover:opacity-75">
                CONTACT
              </span>
            </div>
          </Link>

          {/* Full-Height Vertical Divider 3 on Desktop / Horizontal Divider 3 on Mobile */}
          <div className="nav-divider w-full md:w-[2px] h-[1.5px] md:h-full bg-[var(--green-yellow)] flex-none" />

          {/* Column 4: Contact & Hours Details */}
          <div className="flex-1 w-full md:h-full flex flex-col py-6 px-6 md:p-8 lg:p-12 lg:pt-20 lg:pb-8 md:justify-around min-h-0">
            {/* Mobile View: Book Free Trial Action Button */}
            <div className="md:hidden nav-contact-item order-0 w-full pb-6">
              <button
                onClick={() => {
                  closeMenu("#contact-section");
                  onOpenTrial?.();
                }}
                className="w-full apex-btn-pill py-3.5 text-base sm:text-lg cursor-pointer shadow-sm"
              >
                Book Free Trial Session
              </button>
            </div>

            {/* Social Links (Mobile First: order-1, Desktop: order-4) */}
            <div className="nav-contact-item order-1 md:order-4 flex items-center justify-center md:justify-start pt-2 pb-6 md:pt-2 md:pb-0">
              <div className="flex items-center gap-3">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full bg-[var(--green-yellow)] flex items-center justify-center text-[var(--black-ish)] hover:bg-[var(--black-ish)] hover:text-white transition-all duration-300 shadow-sm"
                  aria-label="Facebook"
                >
                  <FacebookIcon className="w-5 h-5 fill-current" />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full bg-[var(--green-yellow)] flex items-center justify-center text-[var(--black-ish)] hover:bg-[var(--black-ish)] hover:text-white transition-all duration-300 shadow-sm"
                  aria-label="Instagram"
                >
                  <InstagramIcon className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Quick Contact Links (Mobile: order-2, Desktop: order-1) */}
            <div className="nav-contact-item order-2 md:order-1 space-y-2 pb-6 md:pb-0 text-center md:text-left">
              <a
                href="mailto:info@apexfitness.com"
                className="block w-fit mx-auto md:mx-0 text-base sm:text-lg md:text-xl font-medium underline underline-offset-4 decoration-[var(--black-ish)] hover:opacity-75 transition-opacity"
              >
                info@apexfitness.com
              </a>
              <a
                href="tel:15552345678"
                className="block w-fit mx-auto md:mx-0 text-base sm:text-lg md:text-xl font-medium underline underline-offset-4 decoration-[var(--black-ish)] hover:opacity-75 transition-opacity"
              >
                +1 (555) 234-5678
              </a>
              <div className="text-base sm:text-lg text-[var(--black-ish)] leading-snug space-y-1">
                <p className="w-fit mx-auto md:mx-0 underline underline-offset-4 decoration-[var(--black-ish)]">
                  100 Athletic Way
                </p>
                <p className="w-fit mx-auto md:mx-0 underline underline-offset-4 decoration-[var(--black-ish)]">
                  Suite 400
                </p>
              </div>
            </div>

            {/* Opening Hours (Mobile: order-3, Desktop: order-2) */}
            <div className="nav-contact-item order-3 md:order-2 space-y-1 pb-6 md:pb-0 text-center md:text-left">
              <h4 className="font-heading text-2xl sm:text-3xl font-black uppercase tracking-wider text-[var(--black-ish)]">
                OPENING HOURS
              </h4>
              <p className="text-sm sm:text-base text-[var(--black-ish)]/80 leading-relaxed font-sans">
                Monday to Friday: 06:00 - 23:00
                <br />
                Saturday & Sunday: 08:00 - 21:00
              </p>
            </div>

            {/* Manned Hours (Mobile: order-4, Desktop: order-3) */}
            <div className="nav-contact-item order-4 md:order-3 space-y-1 pb-8 md:pb-0 text-center md:text-left">
              <h4 className="font-heading text-2xl sm:text-3xl font-black uppercase tracking-wider text-[var(--black-ish)]">
                MANNED HOURS
              </h4>
              <p className="text-sm sm:text-base text-[var(--black-ish)]/80 leading-relaxed font-sans">
                Monday to Friday: 08:00 - 22:00
                <br />
                Saturday & Sunday: 09:00 - 13:00
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
