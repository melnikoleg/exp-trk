import { FC } from "react";

import styles from "./index.module.css";

interface IProps {
  children: React.ReactNode;
  title: string;
}

export const Tooltip: FC<IProps> = ({ children, title }) => {
  return (
    <div className={styles.tooltip}>
      {children}
      <div className={styles["tooltip-text"]}>{title}</div>
    </div>
  );
};
