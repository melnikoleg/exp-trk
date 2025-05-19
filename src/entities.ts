import { Category, Currency } from "./types";

export const categoryList: Category[] = [
  "other_payments",
  "hobby",
  "subscriptions",
  "transport",
  "restaurants",
  "utility",
  "online_shopping",
  "debts",
];

export const currencyList: Currency[] = ["USD", "EUR", "PLN", "BTC"];

export const categoriesMap: Record<Category, string> = {
  other_payments: "Other Payments",
  hobby: "Hobby",
  subscriptions: "Subscriptions",
  transport: "Transport",
  restaurants: "Restaurants",
  utility: "Utility",
  online_shopping: "Online Shopping",
  debts: "Debts",
};

export const currencyMap: Record<Currency, string> = {
  USD: "$",
  EUR: "€",
  PLN: "zł",
  BTC: "₿",
};
