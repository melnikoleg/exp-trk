import { FC, LabelHTMLAttributes } from "react";

import styles from "./index.module.css";

interface IProps extends LabelHTMLAttributes<HTMLLabelElement> {}

export const InputLabel: FC<IProps> = ({ children, ...props }) => {
  return (
    <label {...props} className={styles.container}>
      {children}
    </label>
  );
};
