import { ThemeProvider } from "next-themes";

import { TransactionProvider } from "@/contexts/transaction-context";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <TransactionProvider>{children}</TransactionProvider>
    </ThemeProvider>
  );
}
