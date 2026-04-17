interface PageHeaderProps {
  title: string
  subtitle?: string
  actions?: React.ReactNode
}

export function PageHeader({ title, subtitle, actions }: PageHeaderProps) {
  return (
    <div className="flex items-start justify-between mb-8">
      <div>
        <h1 className="text-[22px] font-semibold text-[#1A1C1A] tracking-[-0.02em]">{title}</h1>
        {subtitle && <p className="text-sm text-[#666] mt-1">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2.5">{actions}</div>}
    </div>
  )
}
