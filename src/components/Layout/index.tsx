import { FC, useCallback, useEffect, useState } from "react";

import { useStore } from "../../store/storeContext";
import { Expense } from "../../types";
import { ExpenseForm } from "../ExpenseForm";
import { Header } from "../Header";
import { Icon } from "../Icon";
import { IconButton } from "../IconButton";
import { LayoutBackground } from "../LayoutBackground";
import { Sidebar } from "../Sidebar";
import { UploadInvoiceModal } from "../modals/UploadInvoiceModal";
import { uploadInvoice } from "../../api/expenses";
import styles from "./index.module.css";

interface IProps {
  children: React.ReactNode;
}

export const Layout: FC<IProps> = ({ children }) => {
  const [isOpenSidebar, setIsOpenSidebar] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [formKey, setFormKey] = useState(0);
  const { currentExpense, editExpense, updateExpense, createExpense } =
    useStore();

  const openSidebar = useCallback(() => {
    setIsOpenSidebar(true);
  }, []);

  const closeSidebar = useCallback(() => {
    setIsOpenSidebar(false);
  }, []);

  useEffect(() => {
    console.log("Layout: currentExpense changed:", currentExpense);
    if (currentExpense) {
      console.log("Layout: incrementing form key and opening sidebar");
      setFormKey((prevKey) => prevKey + 1); // Increment key to force re-render
      openSidebar();
    }
  }, [currentExpense, openSidebar]);

  useEffect(() => {
    if (!isOpenSidebar) {
      editExpense();
    }
  }, [isOpenSidebar, editExpense]);

  const onSubmit = currentExpense
    ? (data: Omit<Expense, "id">) => updateExpense(currentExpense.id, data)
    : createExpense;

  const handleUploadInvoice = async (file: File) => {
    setUploadLoading(true);
    setUploadError(null);
    try {
      const extractedData = await uploadInvoice(file);
      console.log("Extracted invoice data:", extractedData);

      const expenseData = {
        name: extractedData.name || "",
        amount:
          typeof extractedData.amount === "string"
            ? parseFloat(extractedData.amount)
            : extractedData.amount,
        category: extractedData.category || "other_payments",
        currency: extractedData.currency || "USD",
        date: extractedData.date || new Date().toISOString().split("T")[0],
        description: extractedData.description || "",
      };

      await createExpense(expenseData);
      setIsUploadModalOpen(false);
    } catch (err) {
      const error = err as Error & {
        response?: { data?: { message?: string } };
      };
      setUploadError(
        error.response?.data?.message || "Failed to extract invoice data.",
      );
    } finally {
      setUploadLoading(false);
    }
  };

  let headerMobileMessage = "Last";

  if (isOpenSidebar) {
    if (currentExpense) {
      headerMobileMessage = "Update";
    } else {
      headerMobileMessage = "Add";
    }
  }

  return (
    <div className={styles.container}>
      <Header classname={styles.header}>{headerMobileMessage}</Header>

      <div className={styles.content}>
        <main>{children}</main>
        <Sidebar open={isOpenSidebar} classname={styles["sidebar-container"]}>
          <ExpenseForm
            key={`expense-form-${formKey}-${currentExpense?.id || "new"}`}
            defaultValues={currentExpense}
            onClose={closeSidebar}
            onSubmit={onSubmit}
          />
        </Sidebar>
      </div>

      <LayoutBackground open={isOpenSidebar} onClose={closeSidebar} />

      <IconButton
        size="md"
        className={styles.button}
        onClick={openSidebar}
        aria-label="Add Expense"
      >
        <Icon icon="plus" size={30} color="white" />
      </IconButton>
      <IconButton
        size="md"
        className={styles.uploadInvoiceButton}
        onClick={() => setIsUploadModalOpen(true)}
        aria-label="Upload Invoice"
      >
        <Icon icon="calendar" size={30} color="white" />
      </IconButton>
      <UploadInvoiceModal
        open={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUpload={handleUploadInvoice}
        error={uploadError || undefined}
        loading={uploadLoading}
      />
    </div>
  );
};
