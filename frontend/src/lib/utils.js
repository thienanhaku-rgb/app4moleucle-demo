import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function getApiUrl(path) {
    let baseUrl = process.env.REACT_APP_BACKEND_URL;
    if (baseUrl && baseUrl.startsWith('http:')) {
        baseUrl = baseUrl.replace('http:', 'https:');
    }
    return `${baseUrl}${path}`;
}
