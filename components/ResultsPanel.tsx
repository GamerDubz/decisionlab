import { PanelLabel } from './CriteriaPanel'
import { BalanceBeam } from './BalanceBeam'
import type { ScoredOption } from '@/lib/types'

type ResultsPanelProps = {
  ranked: ScoredOption[]
}

export function ResultsPanel({ ranked }: ResultsPanelProps) {
  const maxScore = Math.max(...ranked.map((r) => r.score), 1)

  return (
    <section aria-labelledby="results-heading">
      <PanelLabel index="03" title="Results" id="results-heading" />

      {ranked.length === 0 ? (
        <p className="rounded-sm border border-dashed border-[color:var(--color-line)] p-6 text-center text-sm text-[color:var(--color-ink-faint)]">
          Add an option above to see it weighed.
        </p>
      ) : (
        <div className="rounded-sm border border-[color:var(--color-line)] bg-[color:var(--color-paper-raised)] p-4">
          <BalanceBeam leader={ranked[0]} runnerUp={ranked[1]} />

          <ol className="mt-2 space-y-2">
            {ranked.map(({ option, score }, index) => {
              const isLeader = index === 0
              return (
                <li
                  key={option.id}
                  className={`flex items-center gap-3 rounded-sm border p-3 ${
                    isLeader
                      ? 'border-[color:var(--color-amber-ink)] bg-[color:var(--color-amber-soft)]'
                      : 'border-[color:var(--color-line-soft)]'
                  }`}
                >
                  <span
                    className={`w-6 shrink-0 text-center text-base font-extrabold tabular-nums ${
                      isLeader ? 'text-[color:var(--color-amber-ink)]' : 'text-[color:var(--color-ink-faint)]'
                    }`}
                  >
                    {index + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="mb-1.5 flex items-center justify-between gap-2">
                      <span className="truncate text-sm font-semibold text-[color:var(--color-ink)]">
                        {option.name || 'Untitled option'}
                      </span>
                      <span
                        className={`shrink-0 text-sm font-extrabold tabular-nums ${
                          isLeader ? 'text-[color:var(--color-amber-ink)]' : 'text-[color:var(--color-ink)]'
                        }`}
                      >
                        {score}
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-[color:var(--color-line-soft)]">
                      <div
                        className={`h-full rounded-full transition-[width] duration-500 ${
                          isLeader ? 'bg-[color:var(--color-amber)]' : 'bg-[color:var(--color-ink-faint)]'
                        }`}
                        style={{ width: `${(score / maxScore) * 100}%` }}
                      />
                    </div>
                  </div>
                </li>
              )
            })}
          </ol>
        </div>
      )}
    </section>
  )
}
