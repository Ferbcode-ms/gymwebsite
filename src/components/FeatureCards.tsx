"use client";

import React from "react";
import Image from "next/image";
import { FeatureCardItem } from "@/lib/cms/types";
import { DEFAULT_FEATURE_CARDS } from "@/lib/cms/defaults";

const CARDS: FeatureCardItem[] = DEFAULT_FEATURE_CARDS;

export function FeatureCards({ initialCards }: { initialCards?: FeatureCardItem[] } = {}) {
  const cards = initialCards && initialCards.length > 0 ? initialCards : CARDS;

  return (
    <section className="relative w-full bg-[var(--black-ish)] py-12 md:py-20">
      <div className="max-w-[1700px] w-full mx-auto px-5 sm:px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 lg:gap-12">
          {cards.map((card) => (
            <div key={card.id} className="flex flex-col group">
              {/* Rounded Image Container */}
              <div className="relative aspect-[4/5] sm:aspect-[3/3.5] w-full overflow-hidden bg-neutral-900 shadow-xl">
                <Image
                  src={card.image}
                  alt={card.alt || card.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover object-center filter brightness-95 group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                {/* Subtle dark gradient overlay for depth */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
              </div>

              {/* Title Underneath Card */}
              <div className="mt-5 md:mt-6">
                <h3 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black uppercase text-[var(--white-ish)] tracking-tight">
                  {card.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
