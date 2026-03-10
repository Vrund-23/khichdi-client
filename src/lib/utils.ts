import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Optimizes an ImageKit URL by adding transformation parameters.
 * @param url The original image URL
 * @param width Optional width in pixels
 * @param quality Optional quality (1-100), default is 80
 * @returns Optimized URL string
 */
export const optimizeImage = (url: string, width?: number, quality: number = 80): string => {
  if (!url || !url.includes('ik.imagekit.io')) return url;

  try {
    // If URL already has a 'tr' parameter, we'll replace it
    const urlObj = new URL(url);
    const params = [];
    
    if (width) params.push(`w-${width}`);
    params.push(`q-${quality}`);
    params.push('f-auto'); // Automatic format selection (WebP/AVIF)

    const tr = params.join(',');
    
    // Add as query parameter 'tr'
    urlObj.searchParams.set('tr', tr);
    
    return urlObj.toString();
  } catch (e) {
    return url;
  }
};
