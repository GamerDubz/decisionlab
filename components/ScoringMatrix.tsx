'use client'

import { Fragment, useState } from 'react'
import { ChevronDown, Plus, X } from 'lucide-react'
import { PanelLabel } from './CriteriaPanel'
import { calcScore, clampScore, MAX_SCORE, MIN_SCORE } from '@/lib/scoring'
import type { Criterion, Option, OptionId } from '@/lib/types'

type ScoringMatrixProps = {
  criteria: Criterion[]
  options: Option[]
  onAdd: () => void
  onUpdate: (id: OptionId, patch: Partial<Option>) => void
  onRemove: (id: OptionId) => void
  onSetScore: (optionId: OptionId, criterionId: Criterion['id'], value: number) => void
}

export function ScoringMatrix({ criteria, options, onAdd, onUpdate, onRemove, onSetScore }: ScoringMatrixProps) {
  const [expanded, setExpanded] = useState<OptionId | null>(null)

  return (
    <section aria-labelledby="matrix-heading">
      <div className="mb-4 flex items-center justify-between gap-3">
        <PanelLabel index="02" title="Scoring matrix" id="matrix-heading" />
        <button
          type="button"
          onClick={onAdd}
          className="flex min-h-11 items-center gap-1.5 rounded-sm border border-[color:var(--color-line)] bg-[color:var(--color-paper-raised)] px-3.5 text-sm text-[color:var(--color-ink-soft)] transition-colors hover:border-[color:var(--color-ink-faint)] hover:text-[color:var(--color-ink)]"
        >
          <Plus size={15} aria-hidden="true" />
          Add option
        </button>
      </div>

      <div className="overflow-x-auto rounded-sm border border-[color:var(--color-line)] bg-[color:var(--color-paper-raised)]">
        <table className="w-full min-w-[560px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-[color:var(--color-line)]">
              <th scope="col" className="w-full px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[color:var(--color-ink-faint)]">
                Option
              </th>
              {criteria.map((criterion) => (
                <th
                  key={criterion.id}
                  scope="col"
                  className="min-w-[92px] px-2 py-3 text-center text-xs font-semibold uppercase tracking-wide text-[color:var(--color-ink-faint)]"
                >
                  {criterion.name || 'Untitled'}
                  <div className="mt-1 flex items-center justify-center">
                    <span
                      className="flex h-5 w-5 items-center justify-center rounded-full border border-[color:var(--color-line)] text-[10px] font-bold normal-case text-[color:var(--color-amber-ink)]"
                      title={`Weight ${criterion.weight}`}
                    >
                      {criterion.weight}
                    </span>
                  </div>
                </th>
              ))}
              <th scope="col" className="min-w-[128px] px-3 py-3 text-center text-xs font-semibold uppercase tracking-wide text-[color:var(--color-ink-faint)]">
                Score
              </th>
              <th scope="col" className="w-11 px-2 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {options.map((option) => {
              const score = calcScore(option, criteria)
              const isOpen = expanded === option.id
              return (
                <Fragment key={option.id}>
                  <tr className="border-b border-[color:var(--color-line-soft)] last:border-b-0">
                    <td className="px-4 py-3 align-top">
                      <div className="flex items-start gap-1">
                        <button
                          type="button"
                          onClick={() => setExpanded(isOpen ? null : option.id)}
                          className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center text-[color:var(--color-ink-faint)] transition-transform hover:text-[color:var(--color-ink)]"
                          style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 200ms ease' }}
                          aria-label={isOpen ? `Hide notes for ${option.name}` : `Show notes for ${option.name}`}
                          aria-expanded={isOpen}
                        >
                          <ChevronDown size={16} aria-hidden="true" />
                        </button>
                        <input
                          type="text"
                          value={option.name}
                          onChange={(event) => onUpdate(option.id, { name: event.target.value })}
                          className="w-full min-w-[120px] bg-transparent py-1 font-semibold text-[color:var(--color-ink)] outline-none border-b border-transparent focus-visible:border-[color:var(--color-line)]"
                          aria-label="Option name"
                        />
                      </div>
                    </td>
                    {criteria.map((criterion) => (
                      <td key={criterion.id} className="px-2 py-3 text-center align-top">
                        <label className="sr-only" htmlFor={`score-${option.id}-${criterion.id}`}>
                          Score for {option.name || 'option'} on {criterion.name || 'criterion'}
                        </label>
                        <input
                          id={`score-${option.id}-${criterion.id}`}
                          type="number"
                          min={MIN_SCORE}
                          max={MAX_SCORE}
                          value={option.scores[criterion.id] ?? ''}
                          placeholder="5"
                          onChange={(event) => onSetScore(option.id, criterion.id, clampScore(Number(event.target.value)))}
                          className="h-11 w-14 rounded-sm border border-[color:var(--color-line)] bg-[color:var(--color-paper)] text-center text-sm font-medium outline-none focus-visible:border-[color:var(--color-amber-ink)]"
                        />
                      </td>
                    ))}
                    <td className="px-3 py-3 align-top">
                      <div className="flex flex-col items-center gap-1.5 pt-2">
                        <span className="text-sm font-extrabold tabular-nums text-[color:var(--color-ink)]">
                          {score}
                          <span className="ml-0.5 text-[10px] font-normal text-[color:var(--color-ink-faint)]">/100</span>
                        </span>
                        <div className="h-1.5 w-full max-w-20 overflow-hidden rounded-full bg-[color:var(--color-line-soft)]">
                          <div
                            className="h-full rounded-full bg-[color:var(--color-amber)] transition-[width] duration-500"
                            style={{ width: `${score}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-2 py-3 align-top">
                      <button
                        type="button"
                        onClick={() => onRemove(option.id)}
                        className="flex h-11 w-11 items-center justify-center text-[color:var(--color-ink-faint)] transition-colors hover:text-[color:var(--color-rust)]"
                        aria-label={`Remove ${option.name || 'option'}`}
                      >
                        <X size={16} aria-hidden="true" />
                      </button>
                    </td>
                  </tr>
                  {isOpen && (
                    <tr className="border-b border-[color:var(--color-line-soft)] bg-[color:var(--color-paper)]">
                      <td colSpan={criteria.length + 3} className="px-4 py-3">
                        <div className="grid gap-3 sm:grid-cols-2">
                          <label className="block">
                            <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[color:var(--color-ink-faint)]">
                              Pros
                            </span>
                            <textarea
                              value={option.pros}
                              onChange={(event) => onUpdate(option.id, { pros: event.target.value })}
                              rows={2}
                              placeholder="What makes this option appealing?"
                              className="w-full resize-y rounded-sm border border-[color:var(--color-line)] bg-[color:var(--color-paper-raised)] p-2 text-sm outline-none focus-visible:border-[color:var(--color-amber-ink)]"
                            />
                          </label>
                          <label className="block">
                            <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[color:var(--color-ink-faint)]">
                              Cons
                            </span>
                            <textarea
                              value={option.cons}
                              onChange={(event) => onUpdate(option.id, { cons: event.target.value })}
                              rows={2}
                              placeholder="What's the catch?"
                              className="w-full resize-y rounded-sm border border-[color:var(--color-line)] bg-[color:var(--color-paper-raised)] p-2 text-sm outline-none focus-visible:border-[color:var(--color-amber-ink)]"
                            />
                          </label>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              )
            })}
          </tbody>
        </table>
      </div>
    </section>
  )
}
