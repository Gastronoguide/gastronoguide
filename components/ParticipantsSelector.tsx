"use client";

import { useState } from "react";
import { getPricePerPerson } from "../lib/utils";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

export default function ParticipantsSelector({ onSelect }: { onSelect: (count: number) => void }) {
  const [count, setCount] = useState(1);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Math.min(10, Math.max(1, parseInt(e.target.value) || 1));
    setCount(val);
    onSelect(val);
  };

  const pricePerPerson = getPricePerPerson(count);
  const total = pricePerPerson * count;

  return (
    <div className="flex flex-col gap-2 mt-2">
      <Label htmlFor="participants">Nombre de participants :</Label>
      <Input
        id="participants"
        type="number"
        min={1}
        max={10}
        value={count}
        onChange={handleChange}
        className="w-24"
      />
      <p>Le prix varie en fonction du nombre de participants : {pricePerPerson}€ par personne - Total : {total}€</p>
    </div>
  );
}
