import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ServicesSection } from "@/components/ServicesSection";

describe("ServicesSection Component", () => {
  it("renders all 4 service row titles", () => {
    render(<ServicesSection />);

    expect(screen.getByRole("heading", { level: 3, name: /^fitness$/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3, name: /^personal training$/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3, name: /^group classes$/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3, name: /^hyrox & conditioning$/i })).toBeInTheDocument();
  });

  it("renders numbered prefixes (01, 02, 03, 04)", () => {
    render(<ServicesSection />);

    expect(screen.getAllByText("01").length).toBeGreaterThan(0);
    expect(screen.getAllByText("02").length).toBeGreaterThan(0);
    expect(screen.getAllByText("03").length).toBeGreaterThan(0);
    expect(screen.getAllByText("04").length).toBeGreaterThan(0);
  });

  it("toggles mobile drawer on item click", () => {
    render(<ServicesSection />);

    const fitnessRow = screen.getByRole("heading", { level: 3, name: /^fitness$/i }).closest("[data-service-index]");
    expect(fitnessRow).not.toBeNull();

    // Before click, mobile toggle indicator shows "+"
    const toggleIcon = fitnessRow?.querySelector(".font-mono.text-lg");
    expect(toggleIcon?.textContent).toBe("+");

    // Click row to expand
    if (fitnessRow) {
      fireEvent.click(fitnessRow);
    }

    // Toggle indicator switches to "−"
    expect(toggleIcon?.textContent).toBe("−");

    // Click again to collapse
    if (fitnessRow) {
      fireEvent.click(fitnessRow);
    }
    expect(toggleIcon?.textContent).toBe("+");
  });
});
