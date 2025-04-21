"use client";

import { useState } from "react";

import { AlertCircle, FileIcon, UploadIcon } from "lucide-react";
import Papa from "papaparse";
import { toast } from "sonner";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface Transaction {
  "Bezeichnung Auftragskonto": string;
  "IBAN Auftragskonto": string;
  "BIC Auftragskonto": string;
  "Bankname Auftragskonto": string;
  Buchungstag: string;
  Valutadatum: string;
  "Name Zahlungsbeteiligter": string;
  "IBAN Zahlungsbeteiligter": string;
  "BIC (SWIFT-Code) Zahlungsbeteiligter": string;
  Buchungstext: string;
  Verwendungszweck: string;
  Betrag: string;
  Waehrung: string;
  "Saldo nach Buchung": string;
  Bemerkung: string;
  Kategorie: string;
  Steuerrelevant: string;
  "Glaeubiger ID": string;
  Mandatsreferenz: string;
}

const dateFromString = (dateString: string): string => {
  const [day, month, year] = dateString.split(".");
  const date = new Date(
    Date.UTC(parseInt(year), parseInt(month) - 1, parseInt(day))
  );
  return date.toISOString();
};

export default function UploadTransaction() {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    // Check if file is CSV
    const validTypes = ["text/csv"];

    if (!validTypes.includes(file.type)) {
      alert("Please upload a CSV file");
      return;
    }

    setFile(file);
  };

  const handleUpload = async () => {
    if (!file) return;

    setError(null);
    setIsUploading(true);

    Papa.parse<Transaction>(file, {
      header: true,
      complete: async (results) => {
        const data = results.data
          .map((row) => {
            try {
              const mappedRow = {
                AccountName: row["Bezeichnung Auftragskonto"],
                AccountIBAN: row["IBAN Auftragskonto"],
                AccountBIC: row["BIC Auftragskonto"],
                AccountBankName: row["Bankname Auftragskonto"],
                TransactionBookingDate: dateFromString(row["Buchungstag"]),
                TransactionValueDate: dateFromString(row["Valutadatum"]),
                CounterpartyName: row["Name Zahlungsbeteiligter"],
                CounterpartyIBAN: row["IBAN Zahlungsbeteiligter"],
                CounterpartyBIC: row["BIC (SWIFT-Code) Zahlungsbeteiligter"],
                TransactionDescription: row["Buchungstext"],
                TransactionPurpose: row["Verwendungszweck"],
                TransactionAmount: parseFloat(row["Betrag"].replace(",", ".")),
                TransactionCurrency: row["Waehrung"].toUpperCase(),
                BalanceAfterTransaction: parseFloat(
                  row["Saldo nach Buchung"].replace(",", ".")
                ),
                AdditionalInformation: row["Bemerkung"],
                TransactionCategory: row["Kategorie"],
                TaxRelevantIndicator: row["Steuerrelevant"],
                CreditorIdentifier: row["Glaeubiger ID"],
                MandateReference: row["Mandatsreferenz"],
              };
              return mappedRow;
            } catch {
              return null;
            }
          })
          .filter((row) => row !== null);

        const response = await fetch("/api/transaction", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ transactions: data }),
        });
        if (response.ok) {
          toast.success("Transactions uploaded successfully!");
          setFile(null);
          setError(null);
          setIsUploading(false);
        } else {
          console.error("Error uploading transactions:", response.statusText);
          setError("Error uploading transactions. Please try again.");
          setIsUploading(false);
        }
      },
      error: (error) => {
        console.error("Error parsing file:", error);
        setError("Error parsing file. Please check the file format.");
        setIsUploading(false);
      },
    });
  };

  return (
    <>
      {!file ? (
        <div
          className={cn(
            "cursor-pointer rounded-lg border-2 border-dashed p-6 text-center transition-colors",
            isDragging
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25"
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => document.getElementById("file-upload")?.click()}
        >
          <UploadIcon className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
          <div className="mb-1 text-lg font-medium">Upload Transaction</div>
          <p className="mb-2 text-sm text-muted-foreground">
            Drag and drop your CSV file here, or click to browse
          </p>
          <Button variant="secondary" size="sm">
            Select File
          </Button>
          <input
            id="file-upload"
            type="file"
            accept=".csv,.xls,.xlsx"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      ) : (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <FileIcon className="h-8 w-8 text-primary" />
                <div>
                  <p className="font-medium">{file.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(file.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              </div>
              {!isUploading ? (
                <div className="flex space-x-2">
                  <Button size="sm" onClick={handleUpload}>
                    Upload
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setFile(null)}
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <div className="w-1/3">
                  <p className="text-sm text-muted-foreground">Uploading...</p>
                </div>
              )}
            </div>
            {error && (
              <Alert variant="destructive" className="mt-6">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}
    </>
  );
}
