"use client";

import { useState } from "react";

const slots = [
  "09:00 - 10:30",
  "10:30 - 12:00",
  "12:00 - 13:30",
];

export default function SlotSelector({ onSelect }: { onSelect: (slot: string) => void }) {
  const [selected, setSelected] = useState<string>("");

  const handleChange = (slot: string) => {
    setSelected(slot);
    onSelect(slot);
  };

  return (
    <div className="flex flex-col gap-2">
      {slots.map((slot) => (
        <button
          key={slot}
          className={`px-4 py-2 rounded border ${
            selected === slot ? "bg-blue-600 text-white" : "bg-white text-black"
          }`}
          onClick={() => handleChange(slot)}
        >
          {slot}
        </button>
      ))}
    </div>
  );
}
