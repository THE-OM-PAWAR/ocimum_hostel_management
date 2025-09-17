import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Utility function to check if payment should be visible in UI
export function isPaymentVisible(dueDate: string | Date): boolean {
  const due = new Date(dueDate);
  const today = new Date();
  
  // Reset time to compare only dates
  due.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  
  // Calculate days until due date
  const daysDiff = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  
  // Show payment if due date is within 2 days or overdue
  return daysDiff <= 2;
}

// Utility function to get payment urgency level
export function getPaymentUrgency(dueDate: string | Date): 'urgent' | 'soon' | 'normal' {
  const due = new Date(dueDate);
  const today = new Date();
  
  due.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  
  const daysDiff = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  
  if (daysDiff < 0) return 'urgent'; // Overdue
  if (daysDiff <= 1) return 'urgent'; // Due today or tomorrow
  if (daysDiff <= 2) return 'soon'; // Due in 2 days
  return 'normal';
}