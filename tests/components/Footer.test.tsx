import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Footer } from "@/components/Footer";

describe("Footer Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders contact form inputs with accessible labels", () => {
    render(<Footer />);

    expect(screen.getByPlaceholderText(/name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/phone number/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/email address/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/message/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /send message/i })).toBeInTheDocument();
  });

  it("accepts user typing into form fields", () => {
    render(<Footer />);

    const nameInput = screen.getByPlaceholderText(/name/i) as HTMLInputElement;
    const emailInput = screen.getByPlaceholderText(/email address/i) as HTMLInputElement;

    fireEvent.change(nameInput, { target: { value: "John Doe" } });
    fireEvent.change(emailInput, { target: { value: "john@example.com" } });

    expect(nameInput.value).toBe("John Doe");
    expect(emailInput.value).toBe("john@example.com");
  });

  it("submits the form and displays thank-you confirmation", async () => {
    // Mock fetch for /api/leads
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    });
    global.fetch = fetchMock;

    render(<Footer />);

    const nameInput = screen.getByPlaceholderText(/name/i);
    const phoneInput = screen.getByPlaceholderText(/phone number/i);
    const emailInput = screen.getByPlaceholderText(/email address/i);
    const submitBtn = screen.getByRole("button", { name: /send message/i });

    fireEvent.change(nameInput, { target: { value: "Sarah Connor" } });
    fireEvent.change(phoneInput, { target: { value: "+1 555-0199" } });
    fireEvent.change(emailInput, { target: { value: "sarah@resistance.org" } });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/thank you for your message!/i)).toBeInTheDocument();
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "/api/leads",
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })
    );
  });

  it("renders sub-footer copyright and legal links", () => {
    render(<Footer />);

    const currentYear = new Date().getFullYear();
    expect(screen.getByText(new RegExp(`© Apex Fitness ${currentYear}`, "i"))).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /terms & conditions/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /privacy policy/i })).toBeInTheDocument();
  });
});
