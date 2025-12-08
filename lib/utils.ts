import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getPricePerPerson(participants: number): number {
  if (participants <= 0) return 100; // Default to single person price
  if (participants === 1) return 100;
  if (participants === 2) return 60;
  if (participants >= 3 && participants <= 4) return 50;
  if (participants >= 5 && participants <= 6) return 46;
  if (participants >= 7 && participants <= 8) return 44;
  if (participants >= 9 && participants <= 10) return 42;
  if (participants >= 11 && participants <= 12) return 40;
  throw new Error("Invalid number of participants");
}
