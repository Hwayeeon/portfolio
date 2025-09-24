/**
 * Optimized loading components for better UX and performance
 * Prevents layout shifts and provides consistent loading states
 */

interface LoadingSkeletonProps {
  className?: string;
  width?: string;
  height?: string;
  variant?: "text" | "rect" | "circle";
}

export function LoadingSkeleton({
  className = "",
  width,
  height,
  variant = "rect",
}: LoadingSkeletonProps) {
  const baseClasses = "bg-muted animate-pulse";
  const variantClasses = {
    text: "h-4 rounded",
    rect: "rounded-xl",
    circle: "rounded-full",
  };

  const style = {
    ...(width && { width }),
    ...(height && { height }),
  };

  return <div className={`${baseClasses} ${variantClasses[variant]} ${className}`} style={style} />;
}

interface PostCardSkeletonProps {
  count?: number;
}

export function PostCardSkeleton({ count = 3 }: PostCardSkeletonProps) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="space-y-4 rounded-xl border p-4">
          <LoadingSkeleton height="200px" className="w-full" />
          <div className="space-y-2">
            <LoadingSkeleton variant="text" className="w-3/4" />
            <LoadingSkeleton variant="text" className="h-3 w-1/2" />
            <div className="flex gap-2">
              <LoadingSkeleton variant="text" className="h-3 w-16" />
              <LoadingSkeleton variant="text" className="h-3 w-12" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function BlogListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="space-y-3 rounded-xl border p-6">
          <LoadingSkeleton variant="text" className="h-6 w-3/4" />
          <LoadingSkeleton variant="text" className="h-4 w-full" />
          <LoadingSkeleton variant="text" className="h-4 w-2/3" />
          <div className="flex items-center gap-4 pt-2">
            <LoadingSkeleton variant="text" className="h-3 w-20" />
            <LoadingSkeleton variant="text" className="h-3 w-16" />
          </div>
        </div>
      ))}
    </div>
  );
}
