import cn from "classnames";
import { format } from "date-fns";
import { FC, ForwardedRef, memo, useState, useEffect } from "react";

import styles from "./index.module.css";
import deleteStyles from "./deleteAnimation.module.css";
import { categoriesMap } from "../../../entities";
import { Expense } from "../../../types";
import { Menu, MenuItem } from "../../Menu";
import { TableCell, TableRow } from "../../Table";
import { IconCategory } from "../IconCategory";
import cellStyles from "../index.module.css";
import { TotalAmount } from "../TotalAmount";

interface IProps<T> {
  data: T;
  ref: ForwardedRef<HTMLTableRowElement>;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onMobileClick: (id: number) => void;
  classname?: string;
}

export const ExpenseTableRow: FC<IProps<Expense>> = memo(
  ({ data, onEdit, onDelete, onMobileClick, ref, classname }) => {
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
      const checkIfMobile = () => {
        setIsMobile(window.innerWidth <= 768);
      };

      window.addEventListener("resize", checkIfMobile);

      return () => {
        window.removeEventListener("resize", checkIfMobile);
      };
    }, []);

    const handleRowClick = (e: React.MouseEvent) => {
      if (isMobile) {
        e.stopPropagation();
        onMobileClick(data.id);
      }
    };

    const handleDelete = () => {
      setIsDeleting(true);
      setTimeout(() => {
        onDelete(data.id);
      }, 500);
    };

    return (
      <TableRow
        classname={cn(
          styles.row,
          classname && styles[classname],
          isDeleting && deleteStyles["delete-animation"],
        )}
        ref={ref}
        onClick={handleRowClick}
      >
        <TableCell classname={cn(cellStyles.cell1, styles.cell1)}>
          <div className={styles["mobile-cell1-container"]}>
            <div className={styles["category-icon"]}>
              <IconCategory category={data.category} />
            </div>
            <div className={styles["mobile-name-container"]}>
              {data.name}
              <div className={styles["mobile-category"]}>
                {categoriesMap[data.category]}
              </div>
            </div>
          </div>
        </TableCell>
        <TableCell classname={cn(cellStyles.cell2, styles.cell2)}>
          {categoriesMap[data.category]}
        </TableCell>
        <TableCell classname={cn(cellStyles.cell3, styles.cell3)}>
          {format(data.date, "yyyy-MM-dd")}
        </TableCell>
        <TableCell classname={cn(cellStyles.cell4, styles.cell4)}>
          <TotalAmount amount={data.amount} currency={data.currency} />
          <div className={styles["mobile-date"]}>
            {format(data.date, "yyyy-MM-dd")}
          </div>
        </TableCell>
        <TableCell classname={cn(cellStyles.cell5, styles.cell5)}>
          <Menu>
            {({ onClose }) => (
              <>
                <MenuItem onClose={onClose} onClick={() => onEdit(data.id)}>
                  Edit
                </MenuItem>
                <MenuItem onClose={onClose} onClick={() => handleDelete()}>
                  Delete
                </MenuItem>
              </>
            )}
          </Menu>
        </TableCell>
      </TableRow>
    );
  },
);
