import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { formatDistance, subDays } from "date-fns";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date) {
  return formatDistance(subDays(new Date(date), 0), new Date(), { addSuffix: true })
}
