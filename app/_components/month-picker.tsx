"use client";

import { useEffect, useState } from "react";

import {
  addMonths,
  format,
  getYear,
  setMonth,
  setYear,
  subMonths,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface MonthPickerProps {
  value?: Date;
  onChange: (date: Date) => void;
  fromYear: number;
  toYear: number;
}

export default function MonthPicker({
  value,
  onChange,
  fromYear,
  toYear,
}: MonthPickerProps) {
  const [currentDate, setCurrentDate] = useState<Date>(value || new Date());

  useEffect(() => {
    if (value) {
      setCurrentDate(value);
    }
  }, [value]);

  const handlePrevMonth = () => {
    const newDate = subMonths(currentDate, 1);
    setCurrentDate(newDate);
    onChange(newDate);
  };

  const handleNextMonth = () => {
    const newDate = addMonths(currentDate, 1);
    setCurrentDate(newDate);
    onChange(newDate);
  };

  const handleMonthChange = (monthStr: string) => {
    const monthIndex = Number.parseInt(monthStr, 10);
    const newDate = setMonth(currentDate, monthIndex);
    setCurrentDate(newDate);
    onChange(newDate);
  };

  const handleYearChange = (yearStr: string) => {
    const year = Number.parseInt(yearStr, 10);
    const newDate = setYear(currentDate, year);
    setCurrentDate(newDate);
    onChange(newDate);
  };

  // Generate years array
  const years = Array.from(
    { length: toYear - fromYear + 1 },
    (_, i) => fromYear + i
  );

  // Generate months array
  const months = [
    { value: "0", label: "January" },
    { value: "1", label: "February" },
    { value: "2", label: "March" },
    { value: "3", label: "April" },
    { value: "4", label: "May" },
    { value: "5", label: "June" },
    { value: "6", label: "July" },
    { value: "7", label: "August" },
    { value: "8", label: "September" },
    { value: "9", label: "October" },
    { value: "10", label: "November" },
    { value: "11", label: "December" },
  ];

  return (
    <div className="flex items-center space-x-2">
      <Button variant="outline" size="icon" onClick={handlePrevMonth}>
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <div className="flex gap-1">
        <Select
          value={currentDate.getMonth().toString()}
          onValueChange={handleMonthChange}
        >
          <SelectTrigger className="w-[130px]">
            <SelectValue>{format(currentDate, "MMMM")}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {months.map((month) => (
              <SelectItem key={month.value} value={month.value}>
                {month.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={getYear(currentDate).toString()}
          onValueChange={handleYearChange}
        >
          <SelectTrigger className="w-[90px]">
            <SelectValue>{format(currentDate, "yyyy")}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {years.map((year) => (
              <SelectItem key={year} value={year.toString()}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button variant="outline" size="icon" onClick={handleNextMonth}>
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
