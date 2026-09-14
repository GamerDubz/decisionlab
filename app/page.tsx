'use client'

import { useCallback, useState } from 'react'
import { Header } from '@/components/Header'
import { CriteriaPanel } from '@/components/CriteriaPanel'
import { ScoringMatrix } from '@/components/ScoringMatrix'
import { ResultsPanel } from '@/components/ResultsPanel'
import { createDefaultDecision } from '@/lib/defaultDecision'
import { rankOptions } from '@/lib/scoring'
import { loadDecision, saveDecision } from '@/lib/storage'
import { newCriterionId, newOptionId, type Criterion, type CriterionId, type Decision, type Option, type OptionId } from '@/lib/types'

export default function DecisionLabPage() {
  const [decision, setDecision] = useState<Decision>(() => loadDecision() ?? createDefaultDecision())

  const update = useCallback((patch: Partial<Decision>) => {
    setDecision((current) => {
      const next = { ...current, ...patch }
      saveDecision(next)
      return next
    })
  }, [])

  const addCriterion = () =>
    update({ criteria: [...decision.criteria, { id: newCriterionId(), name: 'New criterion', weight: 5 }] })

  const updateCriterion = (id: CriterionId, patch: Partial<Criterion>) =>
    update({ criteria: decision.criteria.map((c) => (c.id === id ? { ...c, ...patch } : c)) })

  const removeCriterion = (id: CriterionId) =>
    update({ criteria: decision.criteria.filter((c) => c.id !== id) })

  const addOption = () =>
    update({ options: [...decision.options, { id: newOptionId(), name: 'New option', pros: '', cons: '', scores: {} }] })

  const updateOption = (id: OptionId, patch: Partial<Option>) =>
    update({ options: decision.options.map((o) => (o.id === id ? { ...o, ...patch } : o)) })

  const removeOption = (id: OptionId) =>
    update({ options: decision.options.filter((o) => o.id !== id) })

  const setScore = (optionId: OptionId, criterionId: CriterionId, value: number) =>
    update({
      options: decision.options.map((o) =>
        o.id === optionId ? { ...o, scores: { ...o.scores, [criterionId]: value } } : o,
      ),
    })

  const handleReset = () => {
    if (window.confirm('Reset to the default decision? This clears your current data.')) {
      const fresh = createDefaultDecision()
      setDecision(fresh)
      saveDecision(fresh)
    }
  }

  const ranked = rankOptions(decision)

  return (
    <div className="min-h-screen px-5 py-8 sm:px-8 md:py-12">
      <div className="mx-auto max-w-6xl">
        <Header title={decision.title} onTitleChange={(title) => update({ title })} onReset={handleReset} />

        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          <CriteriaPanel
            criteria={decision.criteria}
            onAdd={addCriterion}
            onUpdate={updateCriterion}
            onRemove={removeCriterion}
          />

          <div className="space-y-10">
            <ScoringMatrix
              criteria={decision.criteria}
              options={decision.options}
              onAdd={addOption}
              onUpdate={updateOption}
              onRemove={removeOption}
              onSetScore={setScore}
            />
            <ResultsPanel ranked={ranked} />
          </div>
        </div>
      </div>
    </div>
  )
}
