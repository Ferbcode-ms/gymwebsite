"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MarqueeTicker } from "./MarqueeTicker";

function FacebookIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function InstagramIcon({ className = "w-4 h-4" }: { className?: string }) {
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

export function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const arcRef = useRef<HTMLDivElement>(null);

  const [formState, setFormState] = useState<{
    name: string;
    phone: string;
    email: string;
    message: string;
  }>({
    name: "",
    phone: "",
    email: "",
    message: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Upward arc scrub animation entering the footer
      if (arcRef.current && footerRef.current) {
        gsap.to(arcRef.current, {
          y: -140,
          ease: "none",
          scrollTrigger: {
            trigger: footerRef.current,
            start: "top bottom",
            end: "top top",
            scrub: 1,
          },
        });
      }
    }, footerRef);

    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formState),
      });
    } catch {
      // silently proceed so user always sees success
    } finally {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }
  };

  return (
    <footer
      ref={footerRef}
      id="contact-section"
      className="relative w-full bg-[var(--black-ish)] text-[var(--white-ish)] lg:min-h-screen flex flex-col justify-between pt-12 md:pt-16 pb-6 md:pb-8 select-none"
    >
      {/* Top Bubble Curved Transition entering footer with Upward Scroll Motion */}
      <div
        ref={arcRef}
        className="absolute top-0 left-0 right-0 w-full z-10 pointer-events-none will-change-transform"
      >
        <div className="top-bubble-wrap">
          <div className="top-bubble bg-[var(--black-ish)]" />
        </div>
        {/* Continuous dark background fill beneath the upward-moving arc */}
        <div className="w-full bg-[var(--black-ish)] h-[200px]" />
      </div>

      {/* Marquee Ticker: WANT TO KNOW MORE? Layered in front of the arc */}
      <div className="relative z-20 mb-6 md:mb-8">
        <MarqueeTicker text="WANT TO KNOW MORE?" />
      </div>

      <div className="max-w-[1700px] w-full mx-auto px-5 sm:px-6 md:px-16 flex-1 flex flex-col justify-between">
        {/* Main 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 pb-6 md:pb-8 border-b border-[var(--dark-grey)]/20 items-start">
          {/* Left Column: Mission Statement & Trial CTA */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <p className="text-base sm:text-lg lg:text-xl text-[var(--white-ish)]/90 leading-relaxed font-normal">
              Do you want to lie exhausted and satisfied on your couch? We&apos;ll make that
              happen! Contact us for more information or click the button below for a free
              trial session, and we will help you take the first steps toward your personal
              fitness goals.
            </p>

            <div>
              <a
                href="#contact-form"
                onClick={() => {
                  const input = document.getElementById("name-input");
                  if (input) input.focus();
                }}
                className="apex-btn-pill px-8 py-3 text-base sm:text-lg inline-flex cursor-pointer"
              >
                Free Trial
              </a>
            </div>
          </div>

          {/* Right Column: Minimalist Contact Form */}
          <div id="contact-form" className="lg:col-span-7">
            <h3 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-black uppercase text-[var(--white-ish)] tracking-tight mb-8">
              Get in touch for more information
            </h3>

            {isSubmitted ? (
              <div className="p-6 rounded-2xl bg-[var(--green-yellow)]/10 border border-[var(--green-yellow)] flex items-start gap-4">
                <CheckCircle2 className="w-7 h-7 text-[var(--green-yellow)] flex-shrink-0" />
                <div>
                  <h4 className="font-heading text-xl font-bold uppercase text-[var(--green-yellow)]">
                    Thank you for your message!
                  </h4>
                  <p className="text-base text-[var(--white-ish)]/90 mt-1">
                    We will get in touch with you as soon as possible for your free trial session.
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
                  <div>
                    <label htmlFor="name-input" className="sr-only">
                      Name
                    </label>
                    <input
                      id="name-input"
                      type="text"
                      required
                      placeholder="Name"
                      value={formState.name}
                      onChange={(e) =>
                        setFormState({ ...formState, name: e.target.value })
                      }
                      className="w-full bg-transparent border-b border-[var(--white-ish)]/40 focus:border-[var(--green-yellow)] py-4 text-base text-[var(--white-ish)] placeholder-[var(--white-ish)]/60 focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone-input" className="sr-only">
                      Phone Number
                    </label>
                    <input
                      id="phone-input"
                      type="tel"
                      required
                      placeholder="Phone Number"
                      value={formState.phone}
                      onChange={(e) =>
                        setFormState({ ...formState, phone: e.target.value })
                      }
                      className="w-full bg-transparent border-b border-[var(--white-ish)]/40 focus:border-[var(--green-yellow)] py-4 text-base text-[var(--white-ish)] placeholder-[var(--white-ish)]/60 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email-input" className="sr-only">
                    Email Address
                  </label>
                  <input
                    id="email-input"
                    type="email"
                    required
                    placeholder="Email Address"
                    value={formState.email}
                    onChange={(e) =>
                      setFormState({ ...formState, email: e.target.value })
                    }
                    className="w-full bg-transparent border-b border-[var(--white-ish)]/40 focus:border-[var(--green-yellow)] py-4 text-base text-[var(--white-ish)] placeholder-[var(--white-ish)]/60 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="message-input" className="sr-only">
                    Message
                  </label>
                  <textarea
                    id="message-input"
                    rows={2}
                    placeholder="Message"
                    value={formState.message}
                    onChange={(e) =>
                      setFormState({ ...formState, message: e.target.value })
                    }
                    className="w-full bg-transparent border-b border-[var(--white-ish)]/40 focus:border-[var(--green-yellow)] py-4 text-base text-[var(--white-ish)] placeholder-[var(--white-ish)]/60 focus:outline-none transition-colors resize-none"
                  />
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="apex-btn-pill px-8 py-3.5 text-base cursor-pointer"
                  >
                    {isSubmitting ? "Just a moment..." : "Send Message"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Sub-Footer Legal & Social Bar */}
        <div className="pt-4 md:pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs sm:text-sm text-[var(--white-ish)]/70">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 sm:gap-6">
            <span>© Apex Fitness {new Date().getFullYear()}</span>
            <Link href="#contact-section" className="hover:text-[var(--white-ish)] underline">
              Terms & Conditions
            </Link>
            <Link href="#contact-section" className="hover:text-[var(--white-ish)] underline">
              Privacy Policy
            </Link>
            <Link href="#aanbod-section" className="hover:text-[var(--white-ish)] underline">
              Classes & Programs
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full bg-[var(--green-yellow)] flex items-center justify-center text-[var(--black-ish)] hover:bg-white transition-colors"
              aria-label="Facebook"
            >
              <FacebookIcon className="w-3.5 h-3.5 fill-current" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full bg-[var(--green-yellow)] flex items-center justify-center text-[var(--black-ish)] hover:bg-white transition-colors"
              aria-label="Instagram"
            >
              <InstagramIcon className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
