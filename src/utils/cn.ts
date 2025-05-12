import clsx, { type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * @description function to assign CSS classes in a clever/safe way
 * @see https://www.youtube.com/watch?v=re2JFITR7TI
 */
export default function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
