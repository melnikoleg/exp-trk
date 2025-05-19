import { ButtonHTMLAttributes, FC } from "react";

import styles from "./index.module.css";

interface IProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "danger";
  fullWidth?: boolean;
}

export const Button: FC<IProps> = ({
  children,
  variant = "primary",
  fullWidth = false,
  className,
  ...props
}) => {
  return (
    <button
      className={[
        "button",
        styles.button,
        variant === "danger" ? styles.danger : "",
        fullWidth ? styles.fullWidth : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      data-testid="button"
      data-variant={variant}
      data-fullwidth={fullWidth}
      {...props}
    >
      {children}
    </button>
  );
};
