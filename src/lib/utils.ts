import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatBytes(bytes: number, decimals = 2) {
  if (!+bytes) return '0 Bytes'
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

export function getReadingTime(text: string): number {
  const wordsPerMinute = 225
  const noOfWords = text.split(/\s/g).length
  const minutes = noOfWords / wordsPerMinute
  return Math.ceil(minutes)
}

export function withTimeout<T>(promiseLike: PromiseLike<T>, ms = 2500, fallbackName = 'operation'): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`Timeout of ${ms}ms exceeded for ${fallbackName}`));
    }, ms);

    Promise.resolve(promiseLike)
      .then((res) => {
        clearTimeout(timer);
        resolve(res);
      })
      .catch((err) => {
        clearTimeout(timer);
        reject(err);
      });
  });
}

