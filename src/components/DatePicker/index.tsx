import { FC, memo } from "react";

import { IProps as IInputProps, Input } from "../Input";

type IProps = IInputProps;

export const DatePicker: FC<IProps> = memo((props) => {
  const inputProps = { ...props };
  return <Input type="date" {...inputProps} />;
});
