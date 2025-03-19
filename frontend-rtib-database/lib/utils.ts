import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format currency function with better handling of large numbers
export function formatCurrency(value: number) {
  if (value >= 1e12) {
    return `$${(value / 1e12).toFixed(2)}T`
  } else if (value >= 1e9) {
    return `$${(value / 1e9).toFixed(2)}B`
  } else if (value >= 1e6) {
    return `$${(value / 1e6).toFixed(2)}M`
  } else {
    return `$${value.toLocaleString()}`
  }
}

/**
 * Formats a number as a currency amount
 * @param amount - The number to format
 * @param currency - The currency symbol to use (default: '$')
 * @returns Formatted currency string
 */
export function formatAmount(amount: number, currency = '$') {
  if (amount === undefined || amount === null) return "—";
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(amount);
}

/**
 * Formats a date object or timestamp
 * @param date - The date to format
 * @returns Formatted date string
 */
export function formatDate(date: Date) {
  if (!date) return "—";
  
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
}

