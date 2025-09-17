import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Payment visibility and urgency utilities
export function isPaymentVisible(dueDate: Date, joinDate?: Date): boolean {
  const now = new Date();
  const twoDaysBeforeDue = new Date(dueDate);
  twoDaysBeforeDue.setDate(twoDaysBeforeDue.getDate() - 2);
  
  return now >= twoDaysBeforeDue;
}

export function getPaymentUrgency(dueDate: Date): 'urgent' | 'soon' | 'normal' {
  const now = new Date();
  const daysDiff = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  
  if (daysDiff <= 0) return 'urgent'; // Overdue or due today
  if (daysDiff <= 2) return 'soon'; // Due within 2 days
  return 'normal';
}

export function calculateDueDate(
  month: number, 
  year: number, 
  generationDay: number, 
  joinDate?: Date,
  useJoinDateBased: boolean = false
): Date {
  if (useJoinDateBased && joinDate) {
    const joinDay = joinDate.getDate();
    return new Date(year, month, joinDay);
  }
  
  return new Date(year, month, generationDay);
}