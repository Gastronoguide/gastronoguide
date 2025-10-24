import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getPricePerPerson(participants: number): number {
  if (participants === 1) return 120;
  if (participants === 2) return 72;
  if (participants >= 3 && participants <= 4) return 60;
  if (participants >= 5 && participants <= 12) return 55;
  throw new Error("Invalid number of participants");
}
