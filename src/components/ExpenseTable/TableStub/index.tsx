import cn from "classnames";

import { Icon } from "../../Icon";
import { TableCell, TableRow } from "../../Table";
import cellStyles from "../index.module.css";
import styles from "./index.module.css";

const STUB_COUNT = 15;
const STUBS = Array(STUB_COUNT).fill(0);

const STUB_LINE = <div className={styles["stub-line"]} />;
const STUB_SQUARE = <div className={styles["stub-square"]} />;

export const TableStub = () => {
  return (
    <>
      {STUBS.map((_, idx) => (
        <TableRow key={idx} classname={styles.row}>
          <TableCell
            valign="middle"
            classname={cn(cellStyles.cell1, styles.cell1)}
          >
            <div className={styles["stub-head-container"]}>
              {STUB_SQUARE}
              {STUB_LINE}
            </div>
          </TableCell>
          <TableCell classname={cn(cellStyles.cell2, styles.cell2)}>
            {STUB_LINE}
          </TableCell>
          <TableCell classname={cn(cellStyles.cell3, styles.cell3)}>
            {STUB_LINE}
          </TableCell>
          <TableCell classname={cn(cellStyles.cell4, styles.cell4)}>
            {STUB_LINE}
          </TableCell>
          <TableCell classname={cn(cellStyles.cell5, styles.cell5)}>
            <Icon icon="menu" />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
};
