export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#faf9f6] px-4">
      <div className="w-full max-w-[400px]">
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#00694c] mb-4">
            <span className="text-base font-bold text-white tracking-tight">A</span>
          </div>
          <h2 className="text-xl font-bold text-[#1a1c1a] tracking-tight">ARTTech</h2>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-[#3d4943]/60 mt-1">
            Análise de Coerência
          </p>
        </div>

        {children}
      </div>
    </div>
  )
}
