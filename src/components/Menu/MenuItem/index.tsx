import { FC, HTMLAttributes } from "react";

import styles from "./index.module.css";

export interface IProps extends HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  onClose: () => void;
}

export const MenuItem: FC<IProps> = ({ children, onClose, ...props }) => {
  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    if (props.onClick) {
      props?.onClick(e);
    }
    onClose();
  };
  return (
    <li {...props} onClick={handleClick} className={styles.item}>
      {children}
    </li>
  );
};
