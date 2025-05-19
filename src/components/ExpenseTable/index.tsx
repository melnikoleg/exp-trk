import { FC, useCallback, useRef, useState, useMemo } from "react";

import { Table, TableBody, TableCell, TableHead, TableRow } from "../Table";
import { EmptyTable } from "./EmptyTable";
import { ExpenseTableRow } from "./ExpenseTableRow";
import { TableStub } from "./TableStub";
import { Expense } from "../../types";
import { Loader } from "../Loader";
import { EditDeleteExpenseModal } from "../modals/EditDeleteExpenseModal";
import { ConfirmModal } from "../modals/ConfirmModal";
import { withMemoization } from "../../utils/withMemoization";
import { useRenderMetrics } from "../../hooks/useRenderMetrics";
import styles from "./index.module.css";

interface IProps<T> {
  data: T[];
  isLoading: boolean;
  hasMore: boolean;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onMobileClick: (id: number) => void;
}

export const ExpenseTable: FC<IProps<Expense>> = ({
  data,
  isLoading,
  setPage,
  hasMore,
  onEdit,
  onDelete,
  onMobileClick,
}) => {
  const observer = useRef<IntersectionObserver | null>(null);

  const [mobileModalOpen, setMobileModalOpen] = useState(false);
  const [selectedExpenseId, setSelectedExpenseId] = useState<number | null>(
    null,
  );
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  // Track rendering performance of this component
  useRenderMetrics('ExpenseTable');
  
  const handleMobileClick = useCallback((id: number) => {
    setSelectedExpenseId(id);
    setMobileModalOpen(true);
  }, []);

  const handleEdit = useCallback((id: number) => {
    setMobileModalOpen(false);
    onEdit(id);
  }, [onEdit]);

  const handleDelete = useCallback((id: number) => {
    setSelectedExpenseId(id);
    setConfirmDeleteOpen(true);
    setMobileModalOpen(false);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (selectedExpenseId !== null) {
      onDelete(selectedExpenseId);
    }
    setConfirmDeleteOpen(false);
    setSelectedExpenseId(null);
  }, [selectedExpenseId, onDelete]);

  const lastExpenseElementRef = useCallback(
    (node: HTMLTableRowElement | null) => {
      if (isLoading || !hasMore) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore, setPage],
  );

  const renderBody = () => {
    if (isLoading && data.length === 0) {
      return <TableStub />;
    }

    if (data.length === 0) {
      return <EmptyTable />;
    }

    return data.map((row, index) => {
      const isNew = index === 0;
      return (
        <ExpenseTableRow
          key={row.id}
          data={row}
          onDelete={handleDelete}
          onEdit={handleEdit}
          onMobileClick={handleMobileClick}
          ref={data.length === index + 1 ? lastExpenseElementRef : null}
          classname={isNew ? "new" : ""}
        />
      );
    });
  };

  return (
    <>
      <Table>
        <TableHead classname={styles.head}>
          <TableRow>
            <TableCell head classname={styles.cell1}>
              Name
            </TableCell>
            <TableCell head classname={styles.cell2}>
              Category
            </TableCell>
            <TableCell head classname={styles.cell3}>
              Date
            </TableCell>
            <TableCell head classname={styles.cell4}>
              Total
            </TableCell>
            <TableCell head classname={styles.cell5} />
          </TableRow>
        </TableHead>
        <TableBody classname={styles.body}>
          {renderBody()}
          {isLoading && data.length !== 0 && (
            <TableRow>
              <TableCell align="center" colSpan={5} valign="middle">
                <Loader />
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {/* Mobile modal for Edit/Delete */}
      <EditDeleteExpenseModal
        open={mobileModalOpen}
        onClose={() => setMobileModalOpen(false)}
        onEdit={() => {
          if (selectedExpenseId !== null) {
            handleEdit(selectedExpenseId);
          }
        }}
        onDelete={() => selectedExpenseId && handleDelete(selectedExpenseId)}
      />
      {/* Confirm delete modal */}
      <ConfirmModal
        open={confirmDeleteOpen}
        onClose={() => setConfirmDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
      >
        Are you sure you want to delete this expense?
      </ConfirmModal>
      {/* We use the sidebar for editing instead of a modal */}
    </>
  );
};

// Export a memoized version of ExpenseTable
export default withMemoization(ExpenseTable, 'ExpenseTable');
