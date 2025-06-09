import { clsx, type ClassValue } from 'clsx'
import { twMerge } from '@/protocol_docs/node_modules/tailwind-merge/dist/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
} 