import cn from "classnames";
import { FC, ForwardedRef, memo, TableHTMLAttributes } from "react";

interface IProps extends TableHTMLAttributes<HTMLTableRowElement> {
  children?: React.ReactNode;
  classname?: string;
  ref?: ForwardedRef<HTMLTableRowElement>;
}

export const TableRow: FC<IProps> = memo(
  ({ children, classname, ref, ...props }) => {
    return (
      <tr ref={ref} className={cn("row", classname)} {...props}>
        {children}
      </tr>
    );
  },
);
