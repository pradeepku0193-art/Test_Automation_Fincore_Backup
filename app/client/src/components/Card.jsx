/**
 * Reusable Card Component
 */

export default function Card({ title, children, className = '', testId }) {
  return (
    <div
      className={`bg-dark-surface border border-dark-border rounded-lg p-6 ${className}`}
      data-testid={testId}
    >
      {title && (
        <h3 className="text-lg font-semibold text-dark-text-primary mb-4">
          {title}
        </h3>
      )}
      {children}
    </div>
  );
}
