import { FC } from "react";

import styles from "./index.module.css";
import { currencyMap } from "../../../entities";
import { Currency } from "../../../types";

interface IProps {
  amount: number;
  currency: Currency;
}

export const TotalAmount: FC<IProps> = ({ amount, currency }) => {
  const currencyChar = currencyMap[currency];

  return (
    <div className={styles.total}>
      {amount}
      {currencyChar}
    </div>
  );
};
