"use client";

import { useState } from "react";
import { Calendar } from "./ui/calendar";

export default function DateSelector({ onSelect }: { onSelect: (date: string) => void }) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  const handleSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      onSelect(date.toISOString().split("T")[0]);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="font-semibold">Choisissez une date :</label>
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={handleSelect}
        className="rounded-md border"
      />
    </div>
  );
}
