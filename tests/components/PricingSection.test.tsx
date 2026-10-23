import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { PricingSection } from "@/components/PricingSection";

describe("PricingSection Component", () => {
  it("renders billing toggle buttons", () => {
    render(<PricingSection />);

    const monthlyBtn = screen.getByRole("button", { name: /per month/i });
    const yearlyBtn = screen.getByRole("button", { name: /per year/i });

    expect(monthlyBtn).toBeInTheDocument();
    expect(yearlyBtn).toBeInTheDocument();
  });

  it("defaults to yearly billing cycle", () => {
    render(<PricingSection />);

    // In default yearly cycle: Individual is € 38,-
    expect(screen.getByText("€ 38,-")).toBeInTheDocument();
    expect(screen.getAllByText(/\* With a 1-year membership/i).length).toBeGreaterThan(0);
  });

  it("updates prices and notes when toggling to monthly", () => {
    render(<PricingSection />);

    const monthlyBtn = screen.getByRole("button", { name: /per month/i });
    fireEvent.click(monthlyBtn);

    // After monthly click: Individual price switches to € 44,-
    expect(screen.getByText("€ 44,-")).toBeInTheDocument();
    expect(screen.getAllByText(/\* Monthly flexible cancellation/i).length).toBeGreaterThan(0);
  });

  it("renders all 3 standard membership plans", () => {
    render(<PricingSection />);

    expect(screen.getByRole("heading", { name: /individual/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /family/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /student/i })).toBeInTheDocument();
  });

  it("renders Hyrox membership section", () => {
    render(<PricingSection />);

    expect(screen.getByRole("heading", { name: /hyrox memberships/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /hyrox basic/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /hyrox premium/i })).toBeInTheDocument();
  });
});
