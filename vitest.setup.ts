import React from "react";
import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

// Mock matchMedia for jsdom
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock Next.js Image component
vi.mock("next/image", () => ({
  default: ({ fill, priority, ...props }: React.ImgHTMLAttributes<HTMLImageElement> & { fill?: boolean; priority?: boolean }) => {
    return React.createElement("img", {
      ...props,
      alt: props.alt || "",
    });
  },
}));

// Mock GSAP to prevent animation timers in unit tests
vi.mock("gsap", () => {
  const gsapMock = {
    registerPlugin: vi.fn(),
    timeline: vi.fn(() => ({
      to: vi.fn().mockReturnThis(),
      fromTo: vi.fn().mockReturnThis(),
      kill: vi.fn(),
    })),
    set: vi.fn(),
    to: vi.fn(),
    fromTo: vi.fn(),
    quickTo: vi.fn(() => vi.fn()),
    context: vi.fn((fn: () => void) => {
      fn();
      return { revert: vi.fn() };
    }),
    ticker: {
      add: vi.fn(),
      remove: vi.fn(),
      lagSmoothing: vi.fn(),
    },
  };
  return {
    default: gsapMock,
    ...gsapMock,
  };
});

vi.mock("gsap/ScrollTrigger", () => ({
  ScrollTrigger: {
    register: vi.fn(),
    getAll: vi.fn(() => []),
    update: vi.fn(),
    refresh: vi.fn(),
  },
}));
