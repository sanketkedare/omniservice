// @vitest-environment happy-dom
import { describe, it, expect } from "vitest";
import React from "react";
import { render, screen } from "@testing-library/react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/Alert";
import { Card, CardTitle, CardContent } from "@/components/ui/Card";
import { formatCurrency, formatDate, truncateText } from "@/lib/utils";

describe("OmniService AI — UI Design System Tests", () => {
  it("renders Button with brand variant and custom text", () => {
    render(<Button variant="brand">Start Diagnostic</Button>);
    const btn = screen.getByRole("button", { name: /start diagnostic/i });
    expect(btn).toBeDefined();
    expect(btn.className).toContain("from-[#f05a28]");
  });

  it("renders disabled Button when isLoading is true", () => {
    render(<Button isLoading>Processing</Button>);
    const btn = screen.getByRole("button");
    expect(btn.hasAttribute("disabled")).toBe(true);
  });

  it("renders Badge with success and dot indicators", () => {
    render(<Badge variant="success" dot>Verified Pro</Badge>);
    expect(screen.getByText("Verified Pro")).toBeDefined();
  });

  it("renders Alert with title and description", () => {
    render(
      <Alert variant="warning">
        <AlertTitle>Escrow Warning</AlertTitle>
        <AlertDescription>Funds are locked until evidence is verified.</AlertDescription>
      </Alert>
    );
    expect(screen.getByText("Escrow Warning")).toBeDefined();
    expect(screen.getByText("Funds are locked until evidence is verified.")).toBeDefined();
  });

  it("renders Card with title and content", () => {
    render(
      <Card>
        <CardTitle>HomePass Security</CardTitle>
        <CardContent>All appliance warranties backed by OmniService.</CardContent>
      </Card>
    );
    expect(screen.getByText("HomePass Security")).toBeDefined();
    expect(screen.getByText("All appliance warranties backed by OmniService.")).toBeDefined();
  });

  it("formats Indian currency from paise correctly", () => {
    expect(formatCurrency(250000)).toMatch(/₹\s*2,500/);
    expect(formatCurrency(185000)).toMatch(/₹\s*1,850/);
  });

  it("truncates long strings with ellipsis", () => {
    expect(truncateText("Short text", 20)).toBe("Short text");
    expect(truncateText("This is a very long descriptive text for diagnostics", 15)).toBe("This is a very ...")
  });
});
