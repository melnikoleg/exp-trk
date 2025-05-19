import cn from "classnames";
import { FC, SelectHTMLAttributes } from "react";

import styles from "./index.module.css";

interface IProps extends SelectHTMLAttributes<HTMLSelectElement> {
  className?: string;
}

export const Dropdown: FC<IProps> = ({
  defaultValue,
  onChange,
  className,
  ...props
}) => {
  const handleChangeCurrency = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (onChange) {
      onChange(e);
    }
  };

  return (
    <select
      className={cn(styles.select, className)} // Fix typo: classname -> className
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
