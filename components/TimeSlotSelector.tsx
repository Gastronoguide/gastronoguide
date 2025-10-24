"use client";

import { useState } from "react";
import { Button } from "./ui/button";

const slots = [
  "09:00 - 11:00",
  "11:30 - 13:30",
];

export default function TimeSlotSelector({ onSelect }: { onSelect: (slot: string) => void }) {
  const [selected, setSelected] = useState("");

  const handleClick = (slot: string) => {
    setSelected(slot);
    onSelect(slot);
  };

  return (
    <div className="flex gap-4 mt-2">
      {slots.map((slot) => (
        <Button
          key={slot}
          variant={selected === slot ? "default" : "outline"}
          onClick={() => handleClick(slot)}
        >
          {slot}
        </Button>
      ))}
    </div>
  );
}
