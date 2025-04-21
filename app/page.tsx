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

import MonthPicker from "./_components/month-picker";
import Summary from "./_components/summary";
import Transactions from "./_components/transactions/page";
import UploadTransaction from "./_components/upload-transaction";

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [transactionsCurrentMonth, setTransactionsCurrentMonth] = useState<
    Transaction[]
  >([]);
  const [transactionsPreviousMonth, setTransactionsPreviousMonth] = useState<
    Transaction[]
  >([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  useEffect(() => {
    async function fetchTransactions() {
      try {
        const response = await fetch("/api/transaction");
        if (!response.ok) {
          throw new Error("Failed to fetch transactions");
        }
        const data = await response.json();
        const parsedData = data
          .map((project: Transaction) => ({
            ...project,
            TransactionBookingDate: new Date(project.TransactionBookingDate),
            TransactionValueDate: new Date(project.TransactionValueDate),
          }))
          .sort((a: Transaction, b: Transaction) => {
            return (
              a.TransactionValueDate.getTime() -
              b.TransactionValueDate.getTime()
            );
          });

        setTransactions(parsedData);
        console.log(parsedData);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    }

    fetchTransactions();
  }, []);

  return (
    <>
      <div className="flex items-center justify-end">
        <MonthPicker
          value={selectedDate}
          onChange={(date) => {
            setSelectedDate(date);
            setTransactionsCurrentMonth(
              transactions.filter(
                (transaction) =>
                  transaction.TransactionValueDate.getFullYear() ===
                    date.getFullYear() &&
                  transaction.TransactionValueDate.getMonth() ===
                    date.getMonth()
              )
            );
            const previousMonth = subMonths(date, 1);
            setTransactionsPreviousMonth(
              transactions.filter(
                (transaction) =>
                  transaction.TransactionValueDate.getFullYear() ===
                    previousMonth.getFullYear() &&
                  transaction.TransactionValueDate.getMonth() ===
                    previousMonth.getMonth()
              )
            );
          }}
          fromYear={2025}
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
        transactions={transactionsCurrentMonth}
        transactionsPreviousMonth={transactionsPreviousMonth}
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
