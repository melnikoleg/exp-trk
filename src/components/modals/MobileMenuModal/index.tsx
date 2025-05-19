import { FC } from "react";

import styles from "./index.module.css";
import { BaseModal } from "../BaseModal";

interface IProps {
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  open: boolean;
}

export const MobileMenuModal: FC<IProps> = ({
  onClose,
  onEdit,
  onDelete,
  open,
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
    <>
      <BaseModal open={open} onClose={onClose}>
        <button className={styles.button} onClick={handleEdit}>
          Edit
        </button>
        <button className={styles.button} onClick={handleDelete}>
          Delete
        </button>
      </BaseModal>
    </>
  );
};
