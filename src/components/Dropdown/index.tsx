import cn from "classnames";
import { FC, SelectHTMLAttributes } from "react";

import styles from "./index.module.css";
import { currencyList } from "../../entities";

interface IProps extends SelectHTMLAttributes<HTMLSelectElement> {
  classname?: string;
}

export const Dropdown: FC<IProps> = ({
  defaultValue,
  onChange,
  classname,
  ...props
}) => {
  const handleChangeCurrency = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (onChange) {
      onChange(e);
    }
  };

  return (
    <select
      className={cn(styles.select, classname)}
      defaultValue={defaultValue}
      onChange={handleChangeCurrency}
      {...props}
    >
      <option>USD</option>
      <option>EUR</option>
      <option>PLN</option>
      <option>BTC</option>
    </select>
  );
};
