import { FC, useState } from "react";

import styles from "./index.module.css";
import { useOutsideClick } from "../../../hooks/useOutsideClick";
import { Icon } from "../../Icon";
import { IconButton } from "../../IconButton";

export interface IProps {
  children: ({ onClose }: { onClose: () => void }) => React.ReactNode;
}

export const Menu: FC<IProps> = ({ children }) => {
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const ref = useOutsideClick(() => {
    handleClose();
  });

  return (
    <div ref={ref} className={styles.container}>
      <IconButton
        onClick={() => setOpen((prev) => !prev)}
        btnType="transparent"
      >
        <Icon icon="menu" />
      </IconButton>
      {open && (
        <ul className={styles.menu}>{children({ onClose: handleClose })}</ul>
      )}
    </div>
  );
};
