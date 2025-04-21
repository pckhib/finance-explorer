import { Transaction } from "@prisma/client";
import { ArrowUpDown, BarChart3, CreditCard, EuroIcon } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function Tile({
  title,
  value,
  info,
  sign,
}: {
  title: string;
  value: string;
  info: string;
  sign?: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {sign}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs">{info}</p>
      </CardContent>
    </Card>
  );
}

interface SummaryProps {
  transactions: Transaction[];
  transactionsPreviousMonth: Transaction[];
}

export default function Summary({
  transactions,
  transactionsPreviousMonth,
}: SummaryProps) {
  // Total Balance
  const totalBalance = transactions.reduce(
    (acc, transaction) => acc + transaction.TransactionAmount,
    0
  );
  const totalBalancePreviousMonth = transactionsPreviousMonth.reduce(
    (acc, transaction) => acc + transaction.TransactionAmount,
    0
  );
  const totalBalancePercentageChange =
    ((totalBalance - totalBalancePreviousMonth) /
      Math.abs(totalBalancePreviousMonth)) *
    100;

  // Total Income
  const totalIncome = transactions.reduce(
    (acc, transaction) =>
      acc +
      (transaction.TransactionAmount > 0 ? transaction.TransactionAmount : 0),
    0
  );
  const totalIncomePreviousMonth = transactionsPreviousMonth.reduce(
    (acc, transaction) =>
      acc +
      (transaction.TransactionAmount > 0 ? transaction.TransactionAmount : 0),
    0
  );
  const totalIncomePercentageChange =
    ((totalIncome - totalIncomePreviousMonth) /
      Math.abs(totalIncomePreviousMonth)) *
    100;

  // Total Expenses
  const totalExpenses = transactions.reduce(
    (acc, transaction) =>
      acc +
      (transaction.TransactionAmount < 0 ? transaction.TransactionAmount : 0),
    0
  );
  const totalExpensesPreviousMonth = transactionsPreviousMonth.reduce(
    (acc, transaction) =>
      acc +
      (transaction.TransactionAmount < 0 ? transaction.TransactionAmount : 0),
    0
  );
  const totalExpensesPercentageChange =
    ((totalExpenses - totalExpensesPreviousMonth) /
      Math.abs(totalExpensesPreviousMonth)) *
    100;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Tile
        title="Total Balance"
        value={`${totalBalance.toLocaleString("de-DE", {
          style: "currency",
          currency: "EUR",
        })}`}
        info={`${totalBalancePercentageChange.toFixed(1)}% from last month`}
        sign={<EuroIcon className="h-4 w-4" />}
      />
      <Tile
        title="Income"
        value={`${totalIncome.toLocaleString("de-DE", {
          style: "currency",
          currency: "EUR",
        })}`}
        info={`${totalIncomePercentageChange.toFixed(1)}% from last month`}
        sign={<ArrowUpDown className="h-4 w-4" />}
      />
      <Tile
        title="Expenses"
        value={`${totalExpenses.toLocaleString("de-DE", {
          style: "currency",
          currency: "EUR",
        })}`}
        info={`${totalExpensesPercentageChange.toFixed(1)}% from last month`}
        sign={<CreditCard className="h-4 w-4" />}
      />
      <Tile
        title="Recurring Expenses"
        value={` €`}
        info={`% of total expenses`}
        sign={<BarChart3 className="h-4 w-4" />}
      />
    </div>
  );
}
