import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { DatePicker } from "./index";

console.log = vi.fn();

describe("DatePicker Component", () => {
  it("renders with default props", () => {
    render(<DatePicker placeholder="Select date" />);

    const datePicker = screen.getByTestId("input");
    expect(datePicker).toBeInTheDocument();
    expect(datePicker).toHaveAttribute("type", "date");
    expect(datePicker).toHaveAttribute("placeholder", "Select date");
  });

  it("passes props to the Input component", () => {
    render(<DatePicker value="2023-05-18" />);

    const datePicker = screen.getByTestId("input");
    expect(datePicker).toHaveAttribute("type", "date");
    expect(datePicker).toHaveAttribute("value", "2023-05-18");
  });

  it("handles error state correctly", () => {
    render(<DatePicker error={true} helperText="Date is required" />);

    const input = screen.getByTestId("input");
    expect(input).toHaveAttribute("type", "date");
    expect(input).toHaveAttribute("data-error", "true");

    const helperText = screen.getByText("Date is required");
    expect(helperText).toBeInTheDocument();
  });
});
