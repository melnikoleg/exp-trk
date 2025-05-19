import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import App from "./index";

vi.mock("react-router-dom", () => ({
  BrowserRouter: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="browser-router">{children}</div>
  ),
  Routes: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="routes">{children}</div>
  ),
  Route: ({ path, element }: { path?: string; element: React.ReactNode }) => (
    <div data-testid="route" data-path={path}>
      {element}
    </div>
  ),
  Outlet: () => <div data-testid="outlet">Outlet content</div>,
}));

vi.mock("../../store/storeContext", () => ({
  useStore: () => ({
    setIsAuthenticated: vi.fn(),
    isAuthenticated: false,
  }),
}));

vi.mock("../../utils/auth", () => ({
  initAuth: vi.fn().mockResolvedValue(false),
}));

vi.mock("../../pages/SignIn", () => ({
  default: () => <div>SignIn Page</div>,
}));
vi.mock("../../pages/SignUp", () => ({
  default: () => <div>SignUp Page</div>,
}));
vi.mock("../../pages/Main", () => ({ default: () => <div>Main Page</div> }));
vi.mock("../../pages/Profile", () => ({
  default: () => <div>Profile Page</div>,
}));
vi.mock("../../pages/ForgotPassword", () => ({
  default: () => <div>ForgotPassword Page</div>,
}));
vi.mock("../../pages/VerificationCode", () => ({
  default: () => <div>VerificationCode Page</div>,
}));
vi.mock("../../pages/RestorePassword", () => ({
  default: () => <div>RestorePassword Page</div>,
}));
vi.mock("../../pages/Success", () => ({
  default: () => <div>Success Page</div>,
}));

vi.mock("../AuthLayout", () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div>Auth Layout: {children}</div>
  ),
}));

vi.mock("../../routes/PrivateRoute", () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="private-route">Private Route: {children}</div>
  ),
}));

describe("App Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    Object.defineProperty(window, "location", {
      writable: true,
      value: { pathname: "/" },
    });
  });

  it("shows loading state initially", async () => {
    const authModule = await import("../../utils/auth");
    const originalInitAuth = authModule.initAuth;
    authModule.initAuth = vi
      .fn()
      .mockImplementation(
        () => new Promise((res) => setTimeout(() => res(false), 100)),
      );
    render(<App />);
    expect(screen.getByText("Initializing...")).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.queryByText("Initializing...")).not.toBeInTheDocument();
    });
    authModule.initAuth = originalInitAuth;
  });

  it("renders the router after auth initialization", async () => {
    render(<App />);
    await waitFor(() => {
      expect(screen.queryByText("Initializing...")).not.toBeInTheDocument();
    });
    expect(screen.getByTestId("browser-router")).toBeInTheDocument();
    expect(screen.getByTestId("routes")).toBeInTheDocument();
    expect(screen.getAllByTestId("route").length).toBeGreaterThan(0);
  });
});
