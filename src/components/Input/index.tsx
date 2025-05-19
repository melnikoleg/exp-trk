import cn from "classnames";
import { FC, InputHTMLAttributes } from "react";

import { HelperText } from "../HelperText";
import styles from "./index.module.css";

export interface IProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  helperText?: string;
  className?: string;
}

export const Input: FC<IProps> = ({
  helperText = "",
  error = false,
  defaultValue = "",
  onChange,
  className,
  children,
  ...props
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(e);
    }
  };

  return (
    <div className={styles.container} data-testid="input-container">
      <span className={styles["input-container"]}>
        <input
          {...props}
          onChange={handleChange}
          defaultValue={defaultValue}
          className={cn(
            "input", // Add this for test compatibility
            styles.input,
            className,
            {
              [styles["input-error"]]: error,
              [styles["with-children"]]: !!children,
            },
          )}
          data-testid="input"
          data-error={error}
          data-has-children={!!children}
        />
        {children}
      </span>
      {helperText && <HelperText error={error}>{helperText}</HelperText>}
    </div>
  );
};
