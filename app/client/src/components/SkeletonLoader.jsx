/**
 * Skeleton Loader Component
 */

export default function SkeletonLoader({ count = 1, height = 'h-20' }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={`${height} bg-dark-surface rounded-lg skeleton`}
        />
      ))}
    </div>
  );
}

export function TableSkeleton({ rows = 5, cols = 4 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex space-x-4">
          {Array.from({ length: cols }).map((_, colIndex) => (
            <div
              key={colIndex}
              className="h-12 flex-1 bg-dark-surface rounded skeleton"
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-dark-surface border border-dark-border rounded-lg p-6">
      <div className="h-6 w-32 bg-dark-hover rounded skeleton mb-4" />
      <div className="h-10 w-24 bg-dark-hover rounded skeleton" />
    </div>
  );
}
