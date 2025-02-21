import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const shortSolanaAddress = (address: string) => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export const sleep = (t: number) => new Promise((resolve, _reject) => { 
  setTimeout(resolve, t)
})