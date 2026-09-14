import { Plus, X } from 'lucide-react'
import { clampWeight } from '@/lib/scoring'
import type { Criterion, CriterionId } from '@/lib/types'

type CriteriaPanelProps = {
  criteria: Criterion[]
  onAdd: () => void
  onUpdate: (id: CriterionId, patch: Partial<Criterion>) => void
  onRemove: (id: CriterionId) => void
}

export function CriteriaPanel({ criteria, onAdd, onUpdate, onRemove }: CriteriaPanelProps) {
  return (
    <section aria-labelledby="criteria-heading">
      <PanelLabel index="01" title="Criteria & weights" id="criteria-heading" />
      <div className="space-y-3">
        {criteria.map((criterion) => (
          <div
            key={criterion.id}
            className="rounded-sm border border-[color:var(--color-line)] bg-[color:var(--color-paper-raised)] p-3.5 shadow-[0_1px_0_var(--color-line)]"
          >
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={criterion.name}
                onChange={(event) => onUpdate(criterion.id, { name: event.target.value })}
                className="w-full min-w-0 bg-transparent text-[15px] font-semibold text-[color:var(--color-ink)] outline-none border-b border-transparent focus-visible:border-[color:var(--color-line)] pb-0.5"
                aria-label="Criterion name"
              />
              <button
                type="button"
                onClick={() => onRemove(criterion.id)}
                className="flex h-11 w-11 shrink-0 items-center justify-center text-[color:var(--color-ink-faint)] transition-colors hover:text-[color:var(--color-rust)]"
                aria-label={`Remove ${criterion.name || 'criterion'}`}
              >
                <X size={16} aria-hidden="true" />
              </button>
            </div>
            <div className="mt-2 flex items-center gap-3">
              <span className="w-10 shrink-0 text-xs uppercase tracking-wide text-[color:var(--color-ink-faint)]">
                Weight
              </span>
              <input
                type="range"
                min={1}
                max={10}
                value={criterion.weight}
                onChange={(event) => onUpdate(criterion.id, { weight: clampWeight(Number(event.target.value)) })}
                className="weight-slider"
                aria-label={`Weight for ${criterion.name || 'this criterion'}, from 1 to 10`}
              />
              <span className="w-5 shrink-0 text-right text-sm font-bold tabular-nums text-[color:var(--color-amber-ink)]">
                {criterion.weight}
              </span>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={onAdd}
          className="flex min-h-11 w-full items-center justify-center gap-1.5 rounded-sm border border-dashed border-[color:var(--color-line)] py-2.5 text-sm text-[color:var(--color-ink-faint)] transition-colors hover:border-[color:var(--color-ink-faint)] hover:text-[color:var(--color-ink)]"
        >
          <Plus size={15} aria-hidden="true" />
          Add criterion
        </button>
      </div>
    </section>
  )
}

export function PanelLabel({ index, title, id }: { index: string; title: string; id?: string }) {
  return (
    <div className="relative mb-4 pt-2">
      <span className="tape" aria-hidden="true" />
      <h2 id={id} className="flex items-baseline gap-2 text-sm font-bold uppercase tracking-widest text-[color:var(--color-ink)]">
        <span className="text-[color:var(--color-amber-ink)]">{index}</span>
        {title}
      </h2>
    </div>
  )
}
