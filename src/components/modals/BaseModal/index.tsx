import { FC } from "react";

import styles from "./index.module.css";
import { useClickEscape } from "../../../hooks/useClickEscape";
import { useOutsideClick } from "../../../hooks/useOutsideClick";
import { LayoutBackground } from "../../LayoutBackground";

interface IProps {
  onClose: () => void;
  open: boolean;
  children: React.ReactNode;
}

export const BaseModal: FC<IProps> = ({ onClose, open, children }) => {
  useClickEscape(onClose);
  const modalRef = useOutsideClick(onClose);

  if (!open) return null;

  return (
    <>
      <LayoutBackground open={open} onClose={onClose} />
      <div ref={modalRef} className={styles.container}>
        {children}
      </div>
    </>
  );
};
