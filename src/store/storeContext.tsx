import { startOfDay, subDays, format } from "date-fns";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  createExpense,
  deleteExpense,
  fetchExpenses,
  updateExpense,
} from "../api/expenses";
import { Expense, IQueryExpenses } from "../types";

interface ProviderProps {
  expenses: Expense[];
  fromDate: string;
  toDate: string;
  isLoading: boolean;
  currentExpense?: Expense;
  hasMoreExpenses: boolean;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  createExpense: (data: Omit<Expense, "id">) => void;
  fetchExpenses: (queryParams: {
    fromDate: IQueryExpenses["fromDate"];
    toDate: IQueryExpenses["toDate"];
  }) => void;
  updateExpense: (id: number, data: Omit<Expense, "id">) => void;
  editExpense: (arg?: number | Omit<Expense, "id">) => void;
  deleteExpense: (id: number) => void;
  setFromDate: (date: string) => void;
  setToDate: (date: string) => void;
}

const StoreContext = createContext<
  ProviderProps & {
    isAuthenticated: boolean;
    setIsAuthenticated: (v: boolean) => void;
  }
>({
  expenses: [],
  fromDate: "",
  toDate: "",
  isLoading: false,
  currentExpense: undefined,
  hasMoreExpenses: false,
  setPage: () => {},
  createExpense: () => {},
  fetchExpenses: () => {},
  updateExpense: () => {},
  deleteExpense: () => {},
  editExpense: () => {},
  setFromDate: () => {},
  setToDate: () => {},
  isAuthenticated: false,
  setIsAuthenticated: () => {},
});

const filterUniqueById = <T extends { id: number }>(list: T[]): T[] => {
  const result = list.reduce((acc, item) => {
    if (item.id in acc) {
      return acc;
    }

    return { ...acc, [item.id]: item };
  }, {});

  return Object.values(result);
};

const LIMIT_EXPENSES = 10;

const StoreProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [hasMoreExpenses, setHasMoreExpenses] = useState(true);
  const [page, setPage] = useState(0);
  const [fromDate, setFromDate] = useState(() =>
    format(startOfDay(subDays(new Date(), 10)), "yyyy-MM-dd"),
  );
  const [toDate, setToDate] = useState(() => format(new Date(), "yyyy-MM-dd"));
  const [currentExpense, setCurrentExpense] = useState<Expense | undefined>();
  // Initialize authentication state from local storage
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem("accessToken") !== null;
  });

  const handleFetchExpenses = useCallback(
    async (queryParams: {
      fromDate: IQueryExpenses["fromDate"];
      toDate: IQueryExpenses["toDate"];
    }) => {
      setIsLoading(true);
      const newExpenses = await fetchExpenses({
        ...queryParams,
        offset: page * LIMIT_EXPENSES,
        limit: LIMIT_EXPENSES,
      });

      if (newExpenses.length === 0) {
        setHasMoreExpenses(false);
      } else {
        setExpenses((prev) => filterUniqueById([...prev, ...newExpenses]));
      }

      setIsLoading(false);
    },
    [page],
  );

  useEffect(() => {
    if (hasMoreExpenses) {
      handleFetchExpenses({ fromDate, toDate });
    }
  }, [handleFetchExpenses, hasMoreExpenses, fromDate, toDate]);

  const resetExpenseState = useCallback(() => {
    setExpenses([]);
    setPage(0);
    setHasMoreExpenses(true);
  }, []);

  const handleSetCurrentExpense = useCallback((data?: Expense) => {
    console.log("handleSetCurrentExpense called with:", data);
    if (!data) {
      console.log("No data provided, setting currentExpense to undefined");
      return setCurrentExpense(undefined);
    }
    try {
      // Try to format the date if it exists
      const formattedDate = data.date
        ? format(new Date(data.date), "yyyy-MM-dd")
        : format(new Date(), "yyyy-MM-dd");
      console.log("Formatted date:", formattedDate);

      // Ensure amount is correctly typed as a number
      const amount =
        typeof data.amount === "string" ? parseFloat(data.amount) : data.amount;
      console.log("Formatted amount:", amount);

      const formattedExpense = {
        ...data,
        amount,
        date: formattedDate,
      };
      console.log("Setting currentExpense to:", formattedExpense);

      setCurrentExpense(formattedExpense);
    } catch (error) {
      // If date formatting fails, use current date as fallback
      console.error("Error formatting date:", error);
      const fallbackExpense = {
        ...data,
        amount:
          typeof data.amount === "string"
            ? parseFloat(data.amount)
            : data.amount,
        date: format(new Date(), "yyyy-MM-dd"),
      };
      console.log("Using fallback expense due to error:", fallbackExpense);
      setCurrentExpense(fallbackExpense);
    }
  }, []);

  const handleCreateExpense = useCallback(async (data: Omit<Expense, "id">) => {
    const newExpenseRecordId = await createExpense(data);
    setExpenses((prev) =>
      filterUniqueById([...prev, { id: newExpenseRecordId, ...data }]),
    );
  }, []);

  const handleUpdateExpense = useCallback(
    async (id: number, data: Omit<Expense, "id">) => {
      // Optimistic update: update in UI first
      setExpenses((prev) =>
        prev.map((x) => (x.id === id ? { ...x, ...data } : x)),
      );
      try {
        await updateExpense(id, data);
      } catch (e) {
        // Rollback if error
        await handleFetchExpenses({ fromDate, toDate });
      }
    },
    [updateExpense, handleFetchExpenses, fromDate, toDate],
  );

  const handleEditExpense = useCallback(
    (arg?: number | Omit<Expense, "id">) => {
      console.log("handleEditExpense called with:", arg);

      if (typeof arg === "object" && arg !== null) {
        console.log("Object argument received:", arg);
        handleSetCurrentExpense({
          ...arg,
          id: -1,
          name: arg.name || "",
          amount:
            typeof arg.amount === "string"
              ? parseFloat(arg.amount)
              : arg.amount || 0,
          category: arg.category || "other_payments",
          currency: arg.currency || "USD",
          date: arg.date || new Date().toISOString().split("T")[0],
        } as Expense);
        return;
      }

      if (typeof arg === "number") {
        console.log("ID argument received:", arg);
        console.log("Current expenses array:", expenses);
        const expense = expenses.find((expense) => expense.id === arg);
        console.log("Found expense:", expense);

        if (expense) {
          const formattedExpense = {
            ...expense,
            name: expense.name || "",
            amount:
              typeof expense.amount === "string"
                ? parseFloat(expense.amount)
                : expense.amount || 0,
            category: expense.category || "other_payments",
            currency: expense.currency || "USD",
            date: expense.date || new Date().toISOString().split("T")[0],
          };
          handleSetCurrentExpense(formattedExpense);
        } else {
          console.error("Could not find expense with ID:", arg);
          handleSetCurrentExpense(undefined);
        }
        return;
      }

      console.log("No argument or undefined - clearing current expense");
      handleSetCurrentExpense(undefined);
    },
    [expenses, handleSetCurrentExpense],
  );

  const handleDeleteExpense = useCallback(
    async (id: number) => {
      setExpenses((prev) => prev.filter((x) => x.id !== id));
      try {
        await deleteExpense(id);
      } catch (e) {
        await handleFetchExpenses({ fromDate, toDate });
      }
    },
    [deleteExpense, handleFetchExpenses, fromDate, toDate],
  );

  const handleSetFromDate = useCallback(
    (date: string) => {
      setFromDate(date);
      resetExpenseState();
    },
    [resetExpenseState],
  );

  const handleSetToDate = useCallback(
    (date: string) => {
      setToDate(date);
      resetExpenseState();
    },
    [resetExpenseState],
  );

  const store = useMemo(() => {
    return {
      expenses,
      isLoading,
      currentExpense,
      hasMoreExpenses,
      setPage,
      createExpense: handleCreateExpense,
      fetchExpenses: handleFetchExpenses,
      updateExpense: handleUpdateExpense,
      deleteExpense: handleDeleteExpense,
      editExpense: handleEditExpense,
      fromDate,
      toDate,
      setFromDate: handleSetFromDate,
      setToDate: handleSetToDate,
      isAuthenticated,
      setIsAuthenticated,
    };
  }, [
    expenses,
    isLoading,
    currentExpense,
    hasMoreExpenses,
    setPage,
    handleCreateExpense,
    handleFetchExpenses,
    handleUpdateExpense,
    handleDeleteExpense,
    handleEditExpense,
    fromDate,
    toDate,
    handleSetFromDate,
    handleSetToDate,
    isAuthenticated,
  ]);
  return (
    <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
  );
};

export default StoreProvider;

export const useStore = () => {
  return useContext(StoreContext);
};
