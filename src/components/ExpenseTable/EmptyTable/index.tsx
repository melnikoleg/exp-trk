import styles from "./index.module.css";
import { TableCell, TableRow } from "../../Table";
import emptyTable from "../assets/emptyTable.png";

export const EmptyTable = () => {
  return (
    <TableRow>
      <TableCell colSpan={5} align="center">
        <div className={styles.container}>
          <h3 className={styles.title}>The list of transactions are empty </h3>
          <p>
            start to add a new one by clicking add button in the left bottom
            corner of your screen
          </p>
          <div className={styles["image-container"]}>
            <img src={emptyTable} alt="No expenses image" />
          </div>
        </div>
      </TableCell>
    </TableRow>
  );
};
