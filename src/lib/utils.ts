import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

import type { ClassValue } from 'clsx';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function formatBytes(size: number) {
  const i = size == 0 ? 0 : Math.floor(Math.log(size) / Math.log(1024));
  return (
    +(size / Math.pow(1024, i)).toFixed(2) * 1 + ' ' + ['B', 'kB', 'MB'][i]
  );
}

function getTimeDifference(futureTimeStr: Date) {
  const diffMs = new Date(futureTimeStr).getTime() - Date.now();

  const diffMinutes = Math.floor(diffMs / 60000);
  const hours = Math.floor(diffMinutes / 60);
  const minutes = diffMinutes % 60;

  if (hours > 0) {
    return `${hours} hr ${minutes} min`;
  } else {
    return `${minutes} min`;
  }
}

function generateFileKey(filename: string, length = 8) {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  const randomStr = Array.from(array, (byte) =>
    byte.toString(16).padStart(2, '0')
  ).join('');

  return `${randomStr}-${filename.replace(/\s+/g, '_')}`;
}

export { cn, formatBytes, getTimeDifference, generateFileKey };
