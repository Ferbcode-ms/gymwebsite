"use client";

import React from "react";
import { SiteContent } from "@/lib/cms/types";
import { DEFAULT_CONTENT } from "@/lib/cms/defaults";

export function AboutSection({ initialAbout }: { initialAbout?: SiteContent["about"] } = {}) {
  const about = initialAbout || DEFAULT_CONTENT.about;

  return (
    <section
      id="about-section"
      className="relative w-full bg-[var(--black-ish)] text-[var(--white-ish)] pt-12 pb-16 sm:pt-16 sm:pb-24 md:pt-24 md:pb-36 overflow-hidden"
    >
      <div className="max-w-[1700px] w-full mx-auto px-5 sm:px-6 md:px-12 flex justify-end">
        {/* Right-aligned Content Block */}
        <div className="w-full lg:w-[65%] max-w-3xl space-y-6 sm:space-y-8 md:space-y-10">
          <h2 className="font-heading text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black uppercase text-[var(--white-ish)] tracking-tight">
            {about.headline || "Apex Fitness"}
          </h2>

          <div className="space-y-4 sm:space-y-6 text-base sm:text-lg md:text-2xl text-[var(--white-ish)]/90 leading-relaxed font-normal">
            <p>
              {about.paragraph1 ||
                "At Apex Fitness, we believe in the power of an active and healthy lifestyle. Our modern facility and dedicated trainers are here to help you achieve your personal fitness goals, whether you are taking your first steps or are a seasoned athlete."}
            </p>
            <p>
              {about.paragraph2 ||
                "That is why we move beyond the generic talk of weight loss, muscle gain, and basic conditioning. Feeling stronger, happier, more resilient, and truly energized. Yes, that is within your reach. But you have to put in the work. Great results don't happen by chance."}
            </p>
          </div>

          {/* Bullet Checklist with Lime Green Markers */}
          <ul className="green-marker list-disc pl-5 sm:pl-6 space-y-2.5 sm:space-y-3.5 text-base sm:text-lg md:text-2xl text-[var(--white-ish)] font-normal">
            {(about.highlights && about.highlights.length > 0
              ? about.highlights
              : DEFAULT_CONTENT.about.highlights
            ).map((item, index) => (
              <li key={index} className="pl-1 sm:pl-2">
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
