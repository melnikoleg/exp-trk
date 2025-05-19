import ExpenseTable from "../components/ExpenseTable";
import { useStore } from "../store/storeContext";
import { Layout } from "../components/Layout";
import { useEffect } from "react";
import { withMemoization } from "../utils/withMemoization";
import { useRenderMetrics } from "../hooks/useRenderMetrics";
import { useOptimizedCallback } from "../hooks/useOptimizedHandlers";

const Main = () => {
  // Track rendering performance
  useRenderMetrics('MainPage');
  
  const {
    expenses,
    isLoading,
    hasMoreExpenses,
    setPage,
    editExpense,
    deleteExpense,
    fetchExpenses: fetchStoreExpenses,
    fromDate,
    toDate,
  } = useStore();
  
  // Optimize the edit expense handler
  const handleEditExpense = useOptimizedCallback((id: number) => {
    editExpense(id);
  }, [editExpense], 'editExpense');
  
  // Optimize the delete expense handler
  const handleDeleteExpense = useOptimizedCallback((id: number) => {
    deleteExpense(id);
  }, [deleteExpense], 'deleteExpense');
  
  // Optimize the mobile click handler
  const handleMobileClick = useOptimizedCallback((id: number) => {
    editExpense(id);
  }, [editExpense], 'mobileClick');
  
  useEffect(() => {
    fetchStoreExpenses({ fromDate, toDate });
  }, [fetchStoreExpenses, fromDate, toDate]);

  return (
    <Layout>
      <h1>Expenses</h1>
      <ExpenseTable
        data={expenses}
        isLoading={isLoading}
        hasMore={hasMoreExpenses}
        setPage={setPage}
        onEdit={handleEditExpense}
        onDelete={handleDeleteExpense}
        onMobileClick={handleMobileClick}
      />
    </Layout>
  );
};

// Export a memoized version of the Main component
export default withMemoization(Main, 'MainPage');
