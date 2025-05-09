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
  
  // Make all paths lowercase for GitHub Pages (case-sensitive server)
  const lowerCasePath = path.toLowerCase();
  
  // Remove leading slash for relative paths
  const relativePath = lowerCasePath.startsWith('/') ? lowerCasePath.slice(1) : lowerCasePath;
  
  // Define image directory mappings (old directory name to new directory name with suffix)
  const directoryMappings: Record<string, string> = {
    'images/aboutus/': 'images/aboutus-repo/',
    'images/cakes/': 'images/cakes-repo/',
    'images/sweets/': 'images/sweets-repo/',
    'images/catering/': 'images/catering-repo/',
    'images/hero/': 'images/hero-repo/',
    'images/placeholders/': 'images/placeholders-repo/',
    'images/testemonials/': 'images/testemonials-repo/',
  };
  
  // First check if the path contains any of our known image directories
  let processedPath = relativePath;
  for (const [oldDir, newDir] of Object.entries(directoryMappings)) {
    if (relativePath.includes(oldDir)) {
      processedPath = relativePath.replace(oldDir, newDir);
      break;
    }
  }
  
  // Add the _file suffix to image and video files
  const fileExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.mp4'];
  
  // Check if this is an image/video file
  if (fileExtensions.some(ext => processedPath.endsWith(ext))) {
    const extensionIndex = processedPath.lastIndexOf('.');
    if (extensionIndex !== -1) {
      const baseName = processedPath.substring(0, extensionIndex);
      const extension = processedPath.substring(extensionIndex);
      
      // Add _file before extension if it's not already there
      if (!baseName.endsWith('_file')) {
        processedPath = `${baseName}_file${extension}`;
      }
    }
  }
  
  // In production (GitHub Pages), we need paths relative to the site root without leading slash
  // In development, we need leading slash for proper serving from dev server
  const isProduction = process.env.NODE_ENV === 'production';
  
  // Add leading slash only in development mode
  return isProduction ? processedPath : `/${processedPath}`;
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
  
  // Make sure source path is lowercase
  const lowerCaseSrc = src.toLowerCase();
  
  // In a real implementation, this would transform the image
  // For now, we just return the original GitHub Pages URL
  return getGithubPagesUrl(lowerCaseSrc);
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
  // Make sure URL is lowercase
  const lowerCaseUrl = url.toLowerCase();
  
  // In a real implementation, this would generate actual srcset with resized versions
  // For now, just return the original URL
  return lowerCaseUrl;
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