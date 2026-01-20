import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getPricePerPerson(participants: number): number {
  if (participants <= 0) return 125;
  if (participants === 1) return 125;
  if (participants === 2) return 75;
  if (participants >= 3 && participants <= 4) return 62;
  if (participants >= 5 && participants <= 6) return 57;
  if (participants >= 7 && participants <= 8) return 55;
  if (participants >= 9 && participants <= 10) return 52;
  if (participants >= 11 && participants <= 12) return 50;
  throw new Error("Invalid number of participants");
}
