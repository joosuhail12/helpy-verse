
import { twMerge } from "tailwind-merge";
import { type ClassValue, clsx } from "clsx";
import { v4 as uuidv4 } from "uuid";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateId(): string {
  return uuidv4();
}
