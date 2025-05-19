import { FC } from "react";
import { BaseModal } from "../BaseModal";
import { Button } from "../../Button";
import styles from "./index.module.css";

interface IProps {
  open: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export const EditDeleteExpenseModal: FC<IProps> = ({
  open,
  onClose,
  onEdit,
  onDelete,
}) => {
  const handleEdit = () => {
    onEdit();
    onClose();
  };

  const handleDelete = () => {
    onDelete();
    onClose();
  };

  return (
    <BaseModal open={open} onClose={onClose}>
      <div className={styles.content}>
        <h3 className={styles.title}>Expense Actions</h3>
        <Button onClick={handleEdit} variant="primary" fullWidth>
          Edit Expense
        </Button>
        <Button onClick={handleDelete} variant="danger" fullWidth>
          Delete Expense
        </Button>
      </div>
    </BaseModal>
  );
};
