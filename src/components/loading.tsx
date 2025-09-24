/**
 * Optimized loading components for better UX and performance
 * Prevents layout shifts and provides consistent loading states
 */

interface LoadingSkeletonProps {
  className?: string;
  width?: string;
  height?: string;
  variant?: 'text' | 'rect' | 'circle';
}

export function LoadingSkeleton({ 
  className = "", 
  width, 
  height, 
  variant = 'rect' 
}: LoadingSkeletonProps) {
  const baseClasses = "bg-muted animate-pulse";
  const variantClasses = {
    text: "h-4 rounded",
    rect: "rounded-xl",
    circle: "rounded-full"
  };
  
  const style = {
    ...(width && { width }),
    ...(height && { height })
  };
  
  return (
    <div 
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={style}
    />
  );
}

interface PostCardSkeletonProps {
  count?: number;
}

export function PostCardSkeleton({ count = 3 }: PostCardSkeletonProps) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="border rounded-xl p-4 space-y-4">
          <LoadingSkeleton height="200px" className="w-full" />
          <div className="space-y-2">
            <LoadingSkeleton variant="text" className="w-3/4" />
            <LoadingSkeleton variant="text" className="w-1/2 h-3" />
            <div className="flex gap-2">
              <LoadingSkeleton variant="text" className="w-16 h-3" />
              <LoadingSkeleton variant="text" className="w-12 h-3" />
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
        <div key={i} className="border rounded-xl p-6 space-y-3">
          <LoadingSkeleton variant="text" className="w-3/4 h-6" />
          <LoadingSkeleton variant="text" className="w-full h-4" />
          <LoadingSkeleton variant="text" className="w-2/3 h-4" />
          <div className="flex gap-4 items-center pt-2">
            <LoadingSkeleton variant="text" className="w-20 h-3" />
            <LoadingSkeleton variant="text" className="w-16 h-3" />
          </div>
        </div>
      ))}
    </div>
  );
}