import { FC, InputHTMLAttributes } from "react";

import { categoriesMap, categoryList } from "../../entities";
import { HelperText } from "../HelperText";
import { Icon } from "../Icon";
import { IconRadio } from "../IconRadio";
import styles from "./index.module.css";
import { Tooltip } from "../Tooltip";

interface IProps extends InputHTMLAttributes<HTMLInputElement> {
  helperText?: string;
  error?: boolean;
}

export const CategoryGroup: FC<IProps> = ({
  helperText = "",
  error = false,
  ...props
}) => {
  return (
    <>
      <div className={styles.items}>
        {categoryList.map((icon) => (
          <Tooltip key={icon} title={categoriesMap[icon]}>
            <IconRadio value={icon} {...props}>
              <Icon icon={icon} size={24} />
            </IconRadio>
          </Tooltip>
        ))}
      </div>
      {helperText && <HelperText error={error}>{helperText}</HelperText>}
    </>
  );
};
