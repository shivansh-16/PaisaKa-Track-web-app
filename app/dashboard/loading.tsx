export default function Loading() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--pk-bg)' }}>
      {/* Header Skeleton */}
      <header className="flex items-center justify-between px-4 py-4 bg-white shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg animate-pulse bg-gray-300"></div>
          <div className="w-32 h-5 rounded animate-pulse bg-gray-300"></div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full animate-pulse bg-gray-300"></div>
          <div className="w-8 h-8 rounded-full animate-pulse bg-gray-300"></div>
        </div>
      </header>

      <main className="px-4 py-6 space-y-6">
        {/* Balance Card Skeleton */}
        <section className="rounded-2xl p-6 animate-pulse" style={{ background: 'linear-gradient(135deg, var(--pk-orange) 0%, #ff6b35 100%)' }}>
          <div className="space-y-3">
            <div className="w-24 h-4 bg-white/20 rounded"></div>
            <div className="w-48 h-10 bg-white/20 rounded"></div>
            <div className="w-40 h-4 bg-white/20 rounded"></div>
          </div>
        </section>

        {/* Quick Actions Skeleton */}
        <section className="grid grid-cols-2 gap-4">
          <div className="h-20 rounded-2xl animate-pulse bg-gray-200"></div>
          <div className="h-20 rounded-2xl animate-pulse border-2 border-dashed border-gray-300 bg-white"></div>
        </section>

        {/* Recent Expenses Skeleton */}
        <section className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="w-32 h-6 bg-gray-200 rounded animate-pulse mb-4"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
                  <div className="space-y-2">
                    <div className="w-24 h-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="w-16 h-3 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
                <div className="w-16 h-5 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </section>

        {/* Active Groups Skeleton */}
        <section className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="w-28 h-6 bg-gray-200 rounded animate-pulse mb-4"></div>
          <div className="space-y-3">
            {[1, 2].map((item) => (
              <div key={item} className="flex items-center justify-between py-3 px-4 rounded-xl" style={{ background: 'var(--pk-bg)' }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-300 animate-pulse"></div>
                  <div className="space-y-2">
                    <div className="w-20 h-4 bg-gray-300 rounded animate-pulse"></div>
                    <div className="w-16 h-3 bg-gray-300 rounded animate-pulse"></div>
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <div className="w-16 h-4 bg-gray-300 rounded animate-pulse"></div>
                  <div className="w-12 h-3 bg-gray-300 rounded animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Loading Indicator */}
      <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-white rounded-full px-4 py-2 shadow-lg border">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm" style={{ color: 'var(--pk-text-secondary)' }}>Loading dashboard...</span>
        </div>
      </div>
    </div>
  );
}
