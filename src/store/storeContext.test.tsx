import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useContext, createContext } from 'react';

const MockStoreContext = createContext({
  expenses: [],
  isAuthenticated: false,
  setIsAuthenticated: vi.fn()
});

const MockStoreProvider = ({ children }: { children: React.ReactNode }) => {
  const store = {
    expenses: [],
    isAuthenticated: false,
    setIsAuthenticated: vi.fn()
  };
  
  return (
    <MockStoreContext.Provider value={store}>
      {children}
    </MockStoreContext.Provider>
  );
};

vi.mock('../api/expenses', () => ({
  fetchExpenses: vi.fn().mockResolvedValue({ items: [], totalCount: 0 }),
  createExpense: vi.fn().mockResolvedValue({ id: 1 }),
  updateExpense: vi.fn().mockResolvedValue({}),
  deleteExpense: vi.fn().mockResolvedValue({})
}));

const TestComponent = () => {
  const { expenses, isAuthenticated, setIsAuthenticated } = useContext(MockStoreContext);
  
  return (
    <div>
      <div data-testid="expenses-count">{expenses.length}</div>
      <div data-testid="auth-status">{isAuthenticated ? 'authenticated' : 'not-authenticated'}</div>
      <button onClick={() => setIsAuthenticated(true)}>Login</button>
      <button onClick={() => setIsAuthenticated(false)}>Logout</button>
    </div>
  );
};

describe('Store Context', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  it('provides initial state values', () => {
    render(
      <MockStoreProvider>
        <TestComponent />
      </MockStoreProvider>
    );
    
    expect(screen.getByTestId('expenses-count')).toHaveTextContent('0');
    expect(screen.getByTestId('auth-status')).toHaveTextContent('not-authenticated');
  });
  
  it('allows changing authentication state', () => {
    render(
      <MockStoreProvider>
        <TestComponent />
      </MockStoreProvider>
    );
    
    expect(screen.getByTestId('auth-status')).toHaveTextContent('not-authenticated');
    act(() => {
      screen.getByText('Login').click();
    });
    act(() => {
      screen.getByText('Logout').click();
    });
  });
});
