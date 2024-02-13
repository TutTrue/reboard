import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { formatDistance, subDays, parse, parseISO, format } from 'date-fns'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function timeAgo(date: string) {
  return formatDistance(subDays(new Date(date), 0), new Date(), {
    addSuffix: true,
  })
}

export function readTimeFromDateString(date: string) {
  return format(parseISO(date), 'h:mm a')
}
