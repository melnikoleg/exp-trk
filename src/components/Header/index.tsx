import cn from "classnames";
import { FC, memo } from "react";
import { Link } from "react-router-dom";

import { Logo } from "../Logo";
import { Icon } from "../Icon";
import styles from "./index.module.css";

interface IProps {
  children?: React.ReactNode;
  classname?: string;
}

export const Header: FC<IProps> = memo(({ children, classname = "" }) => {
  return (
    <header className={cn(styles.header, classname)}>
      <a href="/" className={styles.logo}>
        <Logo />
      </a>
      {children && <div className={styles.title}>{children}</div>}
      <Link to="/profile" className={styles.profileIcon} aria-label="Profile">
        <Icon icon="menu" size={32} />
      </Link>
    </header>
  );
});
