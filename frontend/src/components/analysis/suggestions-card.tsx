import { Info } from 'lucide-react'

export function SuggestionsCard({ suggestions }: { suggestions: string[] }) {
  if (suggestions.length === 0) return null

  return (
    <div className="rounded-xl bg-[#e8f0fa] border border-[#bdd4f0] p-5">
      <h4 className="text-sm font-semibold text-[#185FA5] mb-3 flex items-center gap-2">
        <Info className="h-4 w-4" />
        Sugestoes
      </h4>
      <ul className="space-y-2">
        {suggestions.map((s, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-[#2a5a8f]">
            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#185FA5] shrink-0" />
            {s}
          </li>
        ))}
      </ul>
    </div>
  )
}
