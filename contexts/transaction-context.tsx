"use client";

import { createContext, useContext, useEffect, useState } from "react";

import { Transaction } from "@prisma/client";
import { toast } from "sonner";

type TransactionContextType = {
  transactions: Transaction[];
  updateTransaction: (id: number, data: Partial<Transaction>) => void;
};

const TransactionContext = createContext<TransactionContextType | undefined>(
  undefined
);

export function TransactionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

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
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    }

    fetchTransactions();
  }, []);

  const updateTransaction = async (id: number, data: Partial<Transaction>) => {
    try {
      const response = await fetch(`/api/transaction/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error("Failed to update transaction");
      }
      let updatedTransaction: Transaction = await response.json();
      updatedTransaction = {
        ...updatedTransaction,
        TransactionBookingDate: new Date(
          updatedTransaction.TransactionBookingDate
        ),
        TransactionValueDate: new Date(updatedTransaction.TransactionValueDate),
      };

      setTransactions((prev) =>
        prev.map((transaction) =>
          transaction.id === id ? updatedTransaction : transaction
        )
      );
      toast.success(`Transaction updated successfully`);
    } catch (error) {
      console.error("Error updating transaction:", error);
      toast.error("Error updating transaction");
    }
  };

  return (
    <TransactionContext.Provider value={{ transactions, updateTransaction }}>
      {children}
    </TransactionContext.Provider>
  );
}

export function useTransaction() {
  const context = useContext(TransactionContext);
  if (context === undefined) {
    throw new Error("useTransaction must be used within a TransactionProvider");
  }
  return context;
}
