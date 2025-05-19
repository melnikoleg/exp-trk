import cn from "classnames";
import { FC, memo, TableHTMLAttributes } from "react";

import styles from "./index.module.css";

interface IProps extends TableHTMLAttributes<HTMLTableElement> {
  children?: React.ReactNode;
  classname?: string;
}

export const Table: FC<IProps> = memo(({ children, classname, ...props }) => {
  return (
    <table className={cn(styles.table, classname)} {...props}>
      {children}
    </table>
  );
});
