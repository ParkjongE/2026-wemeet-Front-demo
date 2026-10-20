export default function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden className={`relative overflow-hidden rounded-2xl bg-hairline/50 ${className}`}>
      <div className="animate-shimmer absolute inset-0" />
    </div>
  );
}
