import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines Tailwind CSS classes with support for conditional classes and resolving conflicts
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Returns a GitHub Pages compliant URL path
 * Important for static export when hosting on GitHub Pages
 * 
 * @param path - The path to the resource
 * @param options - Optional configuration
 * @returns The processed path for GitHub Pages
 */
export function getGithubPagesUrl(
  path: string, 
  options?: { 
    imageFormat?: 'original' | 'webp' | 'avif',
    quality?: number,
    resize?: {
      width?: number;
      height?: number;
    } 
  }
): string {
  // Handle undefined or empty paths
  if (!path) return '';
  
  // Remove leading slash for relative paths
  const relativePath = path.startsWith('/') ? path.slice(1) : path;
  
  // For production on GitHub Pages, we use paths relative to the repo base
  // In development, we add a leading slash for absolute paths from the server root
  const isProduction = process.env.NODE_ENV === 'production';
  const basePath = isProduction ? '' : '/';
  
  // For images, we can apply format conversion if needed
  // This is placeholder logic that would need to be implemented by actual image processing in the build pipeline
  if (options && isImagePath(relativePath)) {
    // This is where you'd implement the transformations in a real system
    // For now, we're just returning the original path
    // In a production system, this would likely integrate with a tool like Sharp or next/image
    return `${basePath}${relativePath}`;
  }
  
  return `${basePath}${relativePath}`;
}

/**
 * Returns an optimized image URL with appropriate format detection
 * In a real implementation, this would connect to an image CDN or local optimization
 */
export function getOptimizedImageUrl(
  src: string,
  options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'webp' | 'avif' | 'auto' | 'original';
  } = {}
): string {
  const { width, height, quality = 80, format = 'auto' } = options;
  
  // In a real implementation, this would transform the image
  // For now, we just return the original GitHub Pages URL
  return getGithubPagesUrl(src);
}

/**
 * Format a phone number for display with appropriate spacing and formatting
 */
export function formatPhoneNumber(phoneNumber: string): string {
  if (!phoneNumber) return '';
  
  // Remove all non-digit characters
  const cleaned = phoneNumber.replace(/\D/g, '');
  
  // Check for international format with country code
  if (cleaned.length > 10) {
    const countryCode = cleaned.slice(0, cleaned.length - 10);
    const areaCode = cleaned.slice(-10, -7);
    const firstPart = cleaned.slice(-7, -4);
    const lastPart = cleaned.slice(-4);
    
    return `+${countryCode} (${areaCode}) ${firstPart}-${lastPart}`;
  }
  
  // Handle standard 10-digit US format
  if (cleaned.length === 10) {
    const areaCode = cleaned.slice(0, 3);
    const firstPart = cleaned.slice(3, 6);
    const lastPart = cleaned.slice(6, 10);
    
    return `(${areaCode}) ${firstPart}-${lastPart}`;
  }
  
  // For shorter numbers, just add basic formatting
  if (cleaned.length > 6) {
    const firstPart = cleaned.slice(0, 3);
    const lastPart = cleaned.slice(3);
    
    return `${firstPart}-${lastPart}`;
  }
  
  return phoneNumber; // Return as-is if we can't format it
}

/**
 * Determine if a path is an image based on file extension
 */
export function isImagePath(path: string): boolean {
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.avif', '.svg'];
  const lowercasePath = path.toLowerCase();
  
  return imageExtensions.some(ext => lowercasePath.endsWith(ext));
}

/**
 * Determine if a path is a video based on file extension
 */
export function isVideoPath(path: string): boolean {
  const videoExtensions = ['.mp4', '.webm', '.mov', '.avi', '.mkv'];
  const lowercasePath = path.toLowerCase();
  
  return videoExtensions.some(ext => lowercasePath.endsWith(ext));
}

/**
 * Returns a responsive image srcset for optimal loading
 */
export function generateSrcSet(url: string, widths: number[] = [320, 640, 960, 1280, 1920]): string {
  // In a real implementation, this would generate actual srcset with resized versions
  // For now, just return the original URL
  return url;
}

/**
 * Generate a dominant color for an image for use as a placeholder
 * In a real implementation, this would extract the color from the image
 */
export function getDominantColor(category: string): string {
  // Create a deterministic color based on category
  const hue = category === 'cakes' 
    ? 340  // Pink
    : category === 'sweets' 
      ? 200  // Blue 
      : category === 'catering' 
        ? 120  // Green
        : 280; // Purple for everything else
        
  return `hsl(${hue}, 80%, 65%)`;
}

/**
 * Get a fallback placeholder image URL when real images aren't available
 * This ensures the UI doesn't break even if images are missing
 */
export function getPlaceholderImage(category: string, index: number): string {
  // Create a deterministic color based on category and index
  const hue = category === 'cakes' 
    ? 340  // Pink
    : category === 'sweets' 
      ? 200  // Blue 
      : category === 'catering' 
        ? 120  // Green
        : 280; // Purple for everything else
        
  const saturation = 80 + (index % 3) * 10;
  const lightness = 65 - (index % 5) * 5;
  
  // Base64 encoded SVG placeholder
  const svg = encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300">
      <rect width="300" height="300" fill="hsl(${hue}, ${saturation}%, ${lightness}%)"/>
      <text x="50%" y="50%" font-family="Arial" font-size="24" fill="white" text-anchor="middle" dominant-baseline="middle">
        ${category} ${index}
      </text>
    </svg>
  `);
  
  return `data:image/svg+xml;charset=utf-8,${svg}`;
} 