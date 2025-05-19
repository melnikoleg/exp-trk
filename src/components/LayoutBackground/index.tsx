import { FC } from "react";

import styles from "./index.module.css";

interface IProps {
  open?: boolean;
  onClose: () => void;
}

export const LayoutBackground: FC<IProps> = ({ onClose, open = false }) => {
  if (!open) return null;

  return <div onClick={onClose} className={styles["layout-background"]} />;
};
