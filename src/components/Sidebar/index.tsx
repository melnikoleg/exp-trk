import cn from "classnames";
import { FC } from "react";

import styles from "./index.module.css";

interface IProps {
  children: React.ReactNode;
  classname?: string;
  open?: boolean;
}

export const Sidebar: FC<IProps> = ({
  children,
  open = false,
  classname = "",
}) => {
  if (!open) return null;
  return <aside className={cn(styles.sidebar, classname)}>{children}</aside>;
};
