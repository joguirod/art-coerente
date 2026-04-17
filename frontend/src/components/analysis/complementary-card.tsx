import { Lightbulb } from 'lucide-react'

export function ComplementaryCard({ recommendations }: { recommendations: string[] }) {
  if (recommendations.length === 0) return null

  return (
    <div className="rounded-xl bg-[#eeecf9] border border-[#d4d0ed] p-5">
      <h4 className="text-sm font-semibold text-[#534AB7] mb-1 flex items-center gap-2">
        <Lightbulb className="h-4 w-4" />
        Recomendacoes complementares
      </h4>
      <p className="text-xs text-[#7a74c4] mb-3">Estas recomendacoes nao sao fundamentadas em norma especifica.</p>
      <ul className="space-y-2">
        {recommendations.map((r, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-[#4a449f]">
            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#534AB7] shrink-0" />
            {r}
          </li>
        ))}
      </ul>
    </div>
  )
}
