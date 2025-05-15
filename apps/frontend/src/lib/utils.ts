import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getInitials(name: string) {
  const initials = name
    .split(' ')
    .map(n => n[0].toUpperCase())
    .join('')

  if (initials.length > 2) {
    return initials[0] + initials[initials.length - 1]
  }

  return initials
}
