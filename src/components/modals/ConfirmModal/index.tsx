import { FC } from "react";

import styles from "./index.module.css";
import { Button } from "../../Button";
import { BaseModal } from "../BaseModal";

interface IProps {
  onClose: () => void;
  onConfirm: () => void;
  open: boolean;
  children: React.ReactNode;
}

export const ConfirmModal: FC<IProps> = ({
  onClose,
  onConfirm,
  open,
  children,
}) => {
  return (
    <>
      <BaseModal open={open} onClose={onClose}>
        <p className={styles.text}>{children}</p>
        <div className={styles.buttons}>
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={onConfirm} variant="danger">
            Delete
          </Button>
        </div>
      </BaseModal>
    </>
  );
};
