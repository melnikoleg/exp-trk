import cn from "classnames";
import { ButtonHTMLAttributes, FC } from "react";

import styles from "./index.module.css";

interface IProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  btnType?: "primary" | "transparent";
  size?: "sm" | "md";
}

export const IconButton: FC<IProps> = ({
  children,
  btnType = "primary",
  size = "sm",
  className,
  ...props
}) => {
  return (
    <button
      className={cn(styles.button, className, {
        [styles["button-size-sm"]]: size === "sm",
        [styles["button-size-md"]]: size === "md",
        [styles["button-type-primary"]]: btnType === "primary",
        [styles["button-type-transparent"]]: btnType === "transparent",
      })}
      {...props}
    >
      {children}
    </button>
  );
};
