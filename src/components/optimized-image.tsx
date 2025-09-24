import NextImage, { ImageProps } from "next/image";

interface OptimizedImageProps extends Omit<ImageProps, "quality" | "loading"> {
  priority?: boolean;
  quality?: number;
  loading?: "lazy" | "eager";
}

/**
 * Optimized Image component with performance-focused defaults
 * - Automatically uses modern formats (WebP/AVIF)
 * - Optimized quality settings for different contexts
 * - Better loading strategies
 */
export function OptimizedImage({
  quality = 85,
  loading = "lazy",
  priority = false,
  className = "",
  alt,
  ...props
}: OptimizedImageProps) {
  // Adjust quality based on image size and context
  const width = typeof props.width === "number" ? props.width : parseInt(String(props.width || 0));
  const adjustedQuality = width > 800 ? Math.min(quality, 75) : quality;

  return (
    <NextImage
      {...props}
      alt={alt}
      quality={adjustedQuality}
      loading={priority ? "eager" : loading}
      priority={priority}
      className={`transition-opacity duration-300 ${className}`}
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R+ZBzv5VSwZZqe4Mz/6EEVrKKJcOFhSVLaQ=="
    />
  );
}

/**
 * Blog thumbnail component with optimized settings for blog cards
 */
export function BlogThumbnail({
  src,
  alt,
  priority = false,
  ...props
}: Omit<OptimizedImageProps, "width" | "height">) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      width={600}
      height={300}
      quality={80}
      priority={priority}
      className="aspect-video rounded-lg object-cover"
      {...props}
    />
  );
}

/**
 * Avatar component with optimized settings for profile images
 */
export function Avatar({
  src,
  alt,
  size = 40,
  ...props
}: Omit<OptimizedImageProps, "width" | "height"> & { size?: number }) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      width={size}
      height={size}
      quality={90}
      className="rounded-full"
      {...props}
    />
  );
}
