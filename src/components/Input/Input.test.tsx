import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Input } from "./index";

describe("Input Component", () => {
  it("renders with default props", () => {
    render(<Input placeholder="Enter text" />);

    const input = screen.getByTestId("input");
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("placeholder", "Enter text");
    expect(input).toHaveAttribute("data-error", "false");
    expect(input).toHaveAttribute("data-has-children", "false");
  });

  it("renders with error state", () => {
    render(<Input placeholder="Enter text" error={true} />);

    const input = screen.getByTestId("input");
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("data-error", "true");
  });

  it("displays helper text when provided", () => {
    render(<Input placeholder="Enter text" helperText="This is a hint" />);

    const helperText = screen.getByText("This is a hint");
    expect(helperText).toBeInTheDocument();
  });

  it("displays error helper text when in error state", () => {
    render(
      <Input
        placeholder="Enter text"
        error={true}
        helperText="This field is required"
      />,
    );

    const helperText = screen.getByText("This field is required");
    expect(helperText).toBeInTheDocument();
  });

  it("handles onChange events", () => {
    const handleChange = vi.fn();
    render(<Input placeholder="Enter text" onChange={handleChange} />);

    const input = screen.getByPlaceholderText("Enter text");
    fireEvent.change(input, { target: { value: "New text" } });

    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it("renders with a default value", () => {
    render(<Input placeholder="Enter text" defaultValue="Default value" />);

    const input = screen.getByPlaceholderText("Enter text");
    expect(input).toHaveValue("Default value");
  });

  it("renders with children", () => {
    render(
      <Input placeholder="Enter text">
        <span data-testid="child-element">Child</span>
      </Input>,
    );

    const childElement = screen.getByTestId("child-element");
    expect(childElement).toBeInTheDocument();
  });

  it("applies custom classes when provided", () => {
    render(<Input placeholder="Enter text" className="custom-class" />);

    const input = screen.getByPlaceholderText("Enter text");
    expect(input).toHaveClass("input");
    expect(input).toHaveClass("custom-class");
  });
});
