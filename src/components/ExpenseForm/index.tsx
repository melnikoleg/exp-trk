import { yupResolver } from "@hookform/resolvers/yup";
import { formatISO, startOfDay } from "date-fns";
import React, { FC, useEffect, useMemo, useCallback } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import { withMemoization } from "../../utils/withMemoization";
import { useRenderMetrics } from "../../hooks/useRenderMetrics";

import { categoryList, currencyList } from "../../entities";
import { Expense } from "../../types";
import { Button } from "../Button";
import { CategoryGroup } from "../CategoryGroup";
import { DatePicker } from "../DatePicker";
import { Icon } from "../Icon";
import { IconButton } from "../IconButton";
import { Input } from "../Input";
import { InputLabel } from "../InputLabel";
import { InputWithCurrency } from "../InputWithCurrency";
import styles from "./index.module.css";
import { useClickEscape } from "../../hooks/useClickEscape";

interface Inputs extends Omit<Expense, "id"> {
  description: string;
}

const schema = yup
  .object({
    name: yup.string().required(),
    amount: yup.number().positive().integer().required(),
    category: yup.string().oneOf(categoryList).required(),
    currency: yup.string().oneOf(currencyList).required(),
    date: yup.string().required(),
    description: yup.string().required(),
  })
  .required();

export interface IProps {
  defaultValues?: Inputs;
  onClose: () => void;
  onSubmit: (data: Inputs) => void;
}

const emptyData = {
  name: "",
  amount: 0,
  category: categoryList[0],
  currency: currencyList[0],
  date: new Date().toISOString().split("T")[0],
  description: "",
};

export const ExpenseForm: FC<IProps> = ({
  onClose,
  onSubmit,
  defaultValues = emptyData,
}) => {
  useRenderMetrics('ExpenseForm');

  // Memoize the default form values to prevent unnecessary rerenders
  const memoizedDefaults = useMemo(() => ({
    name: defaultValues.name || "",
    amount: defaultValues.amount,
    category: defaultValues.category || categoryList[0],
    currency: defaultValues.currency || currencyList[0], 
    date: defaultValues.date || new Date().toISOString().split("T")[0],
    description: defaultValues.description || "",
  }), [defaultValues]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: emptyData,
    resolver: yupResolver(schema),
    mode: "onChange", 
  });

  // Effect to handle form values
  useEffect(() => {
    if (memoizedDefaults) {
      reset(memoizedDefaults, { keepDefaultValues: false });
    }
  }, [memoizedDefaults, reset]);

  useClickEscape(onClose);

  const handleOnSubmit: SubmitHandler<Inputs> = useCallback((data) => {
    onSubmit({ ...data, date: formatISO(startOfDay(new Date(data.date))) });
    onClose();
  }, [onSubmit, onClose]);



  return (
    <form className={styles.form} onSubmit={handleSubmit(handleOnSubmit)} data-testid="expense-form">
      <div className={styles.fields}>
        <div className={styles.field}>
          <InputLabel htmlFor="name">Name</InputLabel>
          <Input
            id="name"
            {...register("name", {
              shouldUnregister: false,
            })}
            error={!!errors.name}
            helperText={errors?.name?.message}
            autoFocus
          />
        </div>
        <div className={styles.field}>
          <InputLabel htmlFor="amount">Payment amount</InputLabel>
          <InputWithCurrency
            id="amount"
            {...register("amount", {
              valueAsNumber: true, 
              shouldUnregister: false, 
            })}
            error={!!errors.amount}
            helperText={errors?.amount?.message}
            selectProps={register("currency", {
              shouldUnregister: false, 
            })}
          />
        </div>
        <div className={styles.field}>
          <InputLabel>Select category</InputLabel>
          <CategoryGroup
            {...register("category", {
              shouldUnregister: false,
            })}
            error={!!errors.category}
            helperText={errors?.category?.message}
          />
        </div>
        <div className={styles.field}>
          <InputLabel htmlFor="date">Select date</InputLabel>
          <DatePicker
            id="date"
            {...register("date", {
              shouldUnregister: false,
            })}
            error={!!errors.date}
            helperText={errors?.date?.message}
          />
        </div>
        <div className={styles.field}>
          <InputLabel htmlFor="description">Description</InputLabel>
          <Input
            id="description"
            {...register("description", {
              shouldUnregister: false,
            })}
            error={!!errors.description}
            helperText={errors?.description?.message}
          />
        </div>
      </div>
      <div className={styles.buttons}>
        <div className={styles["button-close"]}>
          <IconButton onClick={onClose} data-testid="cancel-button">
            <Icon icon="close" color="white" size={12} />
          </IconButton>
        </div>
        <Button type="submit" data-testid="submit-button">
          {defaultValues && defaultValues.name ? "Update" : "Create"}
        </Button>
      </div>
    </form>
  );
};

// Export a memoized version of the ExpenseForm
export default withMemoization<IProps>(ExpenseForm, 'ExpenseForm');
