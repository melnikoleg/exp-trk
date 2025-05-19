import { FC, SelectHTMLAttributes } from "react";

import { Dropdown } from "../Dropdown";
import { Input, IProps as InputProps } from "../Input";
import styles from "./index.module.css";

type IDropdownProps = SelectHTMLAttributes<HTMLSelectElement>;

interface IProps extends InputProps {
  selectProps?: IDropdownProps;
}

export const InputWithCurrency: FC<IProps> = ({ selectProps, ...props }) => {
  return (
    <div className={styles.container}>
      <Input {...props} type="number">
        <Dropdown className={styles.select} {...selectProps} />
      </Input>
    </div>
  );
};
