import { Transaction } from "@prisma/client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

interface TransactionProps {
  transactions: Transaction[];
}

export default function Transactions({ transactions }: TransactionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>All Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
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
