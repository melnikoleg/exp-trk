import { FC } from "react";
import { BaseModal } from "../BaseModal";
import styles from "./index.module.css";

interface IProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const MobileExpenseModal: FC<IProps> = ({ open, onClose, children }) => {
  return (
    <BaseModal open={open} onClose={onClose}>
      <div className={styles.content}>{children}</div>
    </BaseModal>
  );
};
