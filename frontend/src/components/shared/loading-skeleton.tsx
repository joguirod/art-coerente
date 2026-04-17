import { Skeleton } from '@/components/ui/skeleton'

export function CardSkeleton() {
  return (
    <div className="rounded-xl border border-[#eee] bg-white p-5 space-y-3">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
      <Skeleton className="h-3 w-2/3" />
    </div>
  )
}

export function ListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  )
}

export function StatsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="rounded-xl border border-[#eee] bg-white p-5 space-y-3">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-8 w-16" />
        </div>
      ))}
    </div>
  )
}

export function DetailSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Skeleton className="h-6 w-64" />
        <Skeleton className="h-4 w-48" />
      </div>
      <div className="rounded-xl border border-[#eee] bg-white p-6 space-y-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
  )
}
