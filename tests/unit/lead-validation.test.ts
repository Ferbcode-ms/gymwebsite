import { describe, it, expect } from "vitest";

// Logic testing the lead validation rules
interface LeadPayload {
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  message?: unknown;
}

function validateLead(body: LeadPayload) {
  const errors: Record<string, string> = {};

  if (!body.name || typeof body.name !== "string" || body.name.trim().length === 0) {
    errors.name = "Name is required";
  }

  if (!body.email || typeof body.email !== "string" || body.email.trim().length === 0) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email.trim())) {
    errors.email = "Invalid email format";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

describe("Lead Validation Unit Tests", () => {
  it("should pass with valid name and email", () => {
    const valid = validateLead({
      name: "Alex Hunter",
      email: "alex@example.com",
      phone: "+1 555-0199",
      message: "Interested in free trial session",
    });

    expect(valid.isValid).toBe(true);
    expect(valid.errors).toEqual({});
  });

  it("should fail when name is missing", () => {
    const invalid = validateLead({
      email: "alex@example.com",
    });

    expect(invalid.isValid).toBe(false);
    expect(invalid.errors.name).toBe("Name is required");
  });

  it("should fail when email is missing", () => {
    const invalid = validateLead({
      name: "Alex Hunter",
    });

    expect(invalid.isValid).toBe(false);
    expect(invalid.errors.email).toBe("Email is required");
  });

  it("should fail when email format is invalid", () => {
    const invalid = validateLead({
      name: "Alex Hunter",
      email: "not-an-email",
    });

    expect(invalid.isValid).toBe(false);
    expect(invalid.errors.email).toBe("Invalid email format");
  });

  it("should trim whitespace in name and email", () => {
    const valid = validateLead({
      name: "   Alex Hunter   ",
      email: "  alex@example.com  ",
    });

    expect(valid.isValid).toBe(true);
  });
});
