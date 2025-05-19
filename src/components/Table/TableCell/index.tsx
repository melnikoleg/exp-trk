import cn from "classnames";
import { FC, memo, TdHTMLAttributes } from "react";

import styles from "./index.module.css";

interface IProps extends TdHTMLAttributes<HTMLTableCellElement> {
  children?: React.ReactNode;
  classname?: string;
  head?: boolean;
}

export const TableCell: FC<IProps> = memo(
  ({ children, classname, head = false, ...props }) => {
    const allProps = {
      className: cn("cell", styles.cell, classname),
      ...props,
    };

    if (head) {
      return <th {...allProps}>{children}</th>;
    }

    return <td {...allProps}>{children}</td>;
  },
);
