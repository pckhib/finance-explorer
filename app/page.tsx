"use client";

import { useEffect, useState } from "react";

import { Transaction } from "@prisma/client";
import { subMonths } from "date-fns";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTransaction } from "@/contexts/transaction-context";

import MonthPicker from "./_components/month-picker";
import Summary from "./_components/summary";
import Transactions from "./_components/transactions/page";
import UploadTransaction from "./_components/upload-transaction";

export default function Home() {
  const { transactions } = useTransaction();
  const [transactionsCurrentMonth, setTransactionsCurrentMonth] = useState<
    Transaction[]
  >([]);
  const [transactionsPreviousMonth, setTransactionsPreviousMonth] = useState<
    Transaction[]
  >([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  useEffect(() => {
    setTransactionsCurrentMonth(
      transactions.filter(
        (transaction) =>
          transaction.TransactionValueDate.getFullYear() ===
            selectedDate.getFullYear() &&
          transaction.TransactionValueDate.getMonth() ===
            selectedDate.getMonth()
      )
    );
    const previousMonth = subMonths(selectedDate, 1);
    setTransactionsPreviousMonth(
      transactions.filter(
        (transaction) =>
          transaction.TransactionValueDate.getFullYear() ===
            previousMonth.getFullYear() &&
          transaction.TransactionValueDate.getMonth() ===
            previousMonth.getMonth()
      )
    );
  }, [transactions, selectedDate]);

  return (
    <>
      <div className="flex items-center justify-end">
        <MonthPicker
          value={selectedDate}
          onChange={(date) => {
            setSelectedDate(date);
          }}
          fromYear={Math.min(
            ...transactions.map((t) => t.TransactionValueDate.getFullYear())
          )}
          toYear={new Date().getFullYear()}
        />
        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm" className="ml-4 gap-1">
              <Plus className="h-4 w-4" /> <span>Import</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>Upload Transaction</DialogTitle>
            <DialogDescription>
              <UploadTransaction />
            </DialogDescription>
          </DialogContent>
        </Dialog>
      </div>
      <Summary
        transactions={transactionsCurrentMonth.filter(
          (transaction) => !transaction.Exclude
        )}
        transactionsPreviousMonth={transactionsPreviousMonth.filter(
          (transaction) => !transaction.Exclude
        )}
      />
      <Tabs className="space-y-2" defaultValue="transactions">
        <TabsList>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
        </TabsList>
        <TabsContent value="transactions">
          <Transactions transactions={transactionsCurrentMonth} />
        </TabsContent>
      </Tabs>
    </>
  );
}
