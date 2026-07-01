export function MovieCardSkeleton() {
  return (
    <div className="flex-shrink-0 w-[160px] md:w-[200px] animate-pulse">
      <div className="aspect-[2/3] bg-zinc-800 rounded-md" />
      <div className="mt-2 space-y-2">
        <div className="h-3 bg-zinc-800 rounded w-3/4" />
        <div className="h-2 bg-zinc-800 rounded w-1/2" />
      </div>
    </div>
  );
}

export function RowSkeleton() {
  return (
    <div className="mb-8 px-4 md:px-10">
      <div className="h-6 bg-zinc-800 rounded w-48 mb-4 animate-pulse" />
      <div className="flex gap-2 overflow-hidden">
        {Array.from({ length: 6 }).map((_, i) => <MovieCardSkeleton key={i} />)}
      </div>
    </div>
  );
}

export function HeroSkeleton() {
  return (
    <div className="h-[70vh] md:h-[80vh] bg-zinc-800 animate-pulse flex items-end pb-20 px-4 md:px-10">
      <div className="max-w-2xl space-y-4">
        <div className="h-10 bg-zinc-700 rounded w-96" />
        <div className="h-4 bg-zinc-700 rounded w-64" />
        <div className="h-4 bg-zinc-700 rounded w-full" />
        <div className="h-4 bg-zinc-700 rounded w-3/4" />
        <div className="flex gap-3 mt-6">
          <div className="h-10 bg-zinc-700 rounded w-28" />
          <div className="h-10 bg-zinc-700 rounded w-32" />
        </div>
      </div>
    </div>
  );
}

export function GridSkeleton({ count = 12 }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 animate-pulse">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="aspect-[2/3] bg-zinc-800 rounded-md" />
      ))}
    </div>
  );
}
