import { FC, InputHTMLAttributes } from "react";

import styles from "./index.module.css";

interface IProps extends InputHTMLAttributes<HTMLInputElement> {}

export const IconRadio: FC<IProps> = ({ children, ...props }) => {
  return (
    <label className={styles.container} tabIndex={0}>
      <input type="radio" hidden {...props} />
      {children}
    </label>
  );
};
