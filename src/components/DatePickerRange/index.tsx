import { FC, memo, useState } from "react";

import { useOutsideClick } from "../../hooks/useOutsideClick";
import { Button } from "../Button";
import { DatePicker } from "../DatePicker";
import { Icon } from "../Icon";
import { IProps as IInputProps } from "../Input";
import { InputLabel } from "../InputLabel";
import styles from "./index.module.css";
import { useClickEscape } from "../../hooks/useClickEscape";

interface IProps extends Omit<IInputProps, "onChange"> {
  from: string;
  to: string;
  onChange: (from: string, to: string) => void;
}

export const DatePickerRange: FC<IProps> = memo(({ from, to, onChange }) => {
  const [openFrom, setOpenFrom] = useState(false);
  const [openTo, setOpenTo] = useState(false);

  const [valueFrom, setValueFrom] = useState(from);
  const [valueTo, setValueTo] = useState(to);

  const closePickers = () => {
    setOpenFrom(false);
    setOpenTo(false);
  };

  useClickEscape(closePickers);

  const ref = useOutsideClick(closePickers);

  const cancelChanges = () => {
    setValueFrom(from);
    setValueTo(to);
    closePickers();
  };

  const saveChanges = () => {
    onChange(valueFrom, valueTo);
    closePickers();
  };

  const handleChangeFrom = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFrom = e.target.value;
    setValueFrom(newFrom);
  };

  const handleChangeTo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTo = e.target.value;
    setValueTo(newTo);
  };

  return (
    <div ref={ref} className={styles.container} data-testid="date-picker-range">
      <span className={styles.dates}>
        <span className={styles.icon}>
          <Icon icon="calendar" color="white" size={30} />
        </span>
        <span
          className={styles.date}
          onClick={() => setOpenFrom((prev) => !prev)}
          data-testid="date-from"
        >
          {valueFrom}
        </span>
        {"\u00A0"}-{"\u00A0"}
        <span
          className={styles.date}
          onClick={() => setOpenTo((prev) => !prev)}
          data-testid="date-to"
        >
          {valueTo}
        </span>
      </span>
      {valueFrom > valueTo && (
        <div className={styles.error}>
          The start date cannot be later than the end date
        </div>
      )}
      {(openFrom || openTo) && (
        <div className={styles["date-picker"]}>
          {openFrom && (
            <InputLabel>
              From
              <DatePicker
                value={valueFrom}
                name="fromDate"
                onChange={handleChangeFrom}
              />
            </InputLabel>
          )}
          {openTo && (
            <InputLabel>
              To
              <DatePicker
                value={valueTo}
                name="toDate"
                onChange={handleChangeTo}
              />
            </InputLabel>
          )}
          <div className={styles.buttons}>
            <Button onClick={cancelChanges}>Cancel</Button>
            <Button onClick={saveChanges}>Save</Button>
          </div>
        </div>
      )}
    </div>
  );
});
