import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
}

export function calculateFinancialRatio(numerator: number, denominator: number): string {
  if (denominator === 0 || numerator === 0 || !isFinite(numerator / denominator)) {
    return 'N/A';
  }
  return (numerator / denominator).toFixed(2) + 'x';
}

export function calculateFinancialRatioAsNumber(numerator: number | string, denominator: number | string): number | null {
  const num = typeof numerator === 'string' ? parseFloat(numerator.replace(/[^0-9.-]+/g, "")) : numerator;
  const den = typeof denominator === 'string' ? parseFloat(denominator.replace(/[^0-9.-]+/g, "")) : denominator;
  
  if (isNaN(num) || isNaN(den) || den === 0 || !isFinite(num / den)) {
    return null;
  }
  return num / den;
}

export function formatCompactNumber(value: number): string {
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1
  }).format(value);
}

export function formatRatio(value: number | null): string {
  if (value === null) {
    return 'N/A';
  }
  return value.toFixed(2) + 'x';
}
