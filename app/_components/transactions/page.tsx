import { Transaction } from "@prisma/client";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTransaction } from "@/contexts/transaction-context";
import { cn } from "@/lib/utils";

interface TransactionProps {
  transactions: Transaction[];
}

export default function Transactions({ transactions }: TransactionProps) {
  const { updateTransaction } = useTransaction();

  const totalIncome = transactions
    .filter((transaction) => !transaction.Exclude)
    .reduce(
      (acc, transaction) =>
        acc +
        (transaction.TransactionAmount > 0 ? transaction.TransactionAmount : 0),
      0
    );
  const totalExpenses = Math.abs(
    transactions
      .filter((transaction) => !transaction.Exclude)
      .reduce(
        (acc, transaction) =>
          acc +
          (transaction.TransactionAmount < 0
            ? transaction.TransactionAmount
            : 0),
        0
      )
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6 mt-4 space-y-2">
          <div className="h-6 w-full overflow-hidden rounded-md bg-gray-100">
            {transactions.length > 0 && (
              <div
                className="h-full bg-emerald-500"
                style={{
                  width: `${Math.min(100, (totalIncome / Math.max(totalIncome, totalExpenses)) * 100)}%`,
                }}
              />
            )}
          </div>
          <div className="h-6 w-full overflow-hidden rounded-md bg-gray-100">
            {transactions.length > 0 && (
              <div
                className="h-full bg-rose-500"
                style={{
                  width: `${Math.min(100, (totalExpenses / Math.max(totalIncome, totalExpenses)) * 100)}%`,
                }}
              />
            )}
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead></TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Counterparty</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>
                  <Checkbox
                    checked={!transaction.Exclude}
                    onCheckedChange={async (checked) => {
                      updateTransaction(transaction.id, {
                        Exclude: !checked,
                      });
                    }}
                  />
                </TableCell>
                <TableCell>
                  {transaction.TransactionBookingDate.toLocaleDateString()}
                </TableCell>
                <TableCell>{transaction.CounterpartyName}</TableCell>
                <TableCell
                  className="max-w-xs truncate"
                  title={transaction.TransactionPurpose}
                >
                  {transaction.TransactionPurpose}
                </TableCell>
                <TableCell>{transaction.TransactionCategory}</TableCell>
                <TableCell
                  className={cn(
                    "text-right font-medium",
                    transaction.TransactionAmount > 0
                      ? "text-emerald-500"
                      : "text-rose-500"
                  )}
                >
                  {transaction.TransactionAmount.toLocaleString("de-DE", {
                    style: "currency",
                    currency: "EUR",
                  })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
