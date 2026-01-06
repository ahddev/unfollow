/**
 * Skeleton loading component for smooth loading states
 */
export default function Skeleton({ className = '' }) {
  return (
    <div className={`animate-pulse bg-base-300 rounded-xl ${className}`} />
  );
}

