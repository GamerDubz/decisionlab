'use client'

import { useState, useCallback, useEffect } from 'react'

type Criterion = { id: string; name: string; weight: number }
type Option = { id: string; name: string; pros: string; cons: string; scores: Record<string, number> }
type Decision = { title: string; criteria: Criterion[]; options: Option[] }

const genId = () => Math.random().toString(36).slice(2)

const defaultDecision: Decision = {
  title: 'My Decision',
  criteria: [
    { id: genId(), name: 'Cost', weight: 8 },
    { id: genId(), name: 'Quality', weight: 9 },
    { id: genId(), name: 'Speed', weight: 6 },
  ],
  options: [
    { id: genId(), name: 'Option A', pros: 'Affordable', cons: 'Slower', scores: {} },
    { id: genId(), name: 'Option B', pros: 'Fast delivery', cons: 'More expensive', scores: {} },
  ],
}

function calcScore(option: Option, criteria: Criterion[]): number {
  let total = 0; let maxTotal = 0
  criteria.forEach((c) => {
    const score = option.scores[c.id] ?? 5
    total += score * c.weight
    maxTotal += 10 * c.weight
  })
  return maxTotal === 0 ? 0 : Math.round((total / maxTotal) * 100)
}

export default function DecisionLabPage() {
  const [decision, setDecision] = useState<Decision>(() => {
    if (typeof window !== 'undefined') {
      try { const saved = localStorage.getItem('decisionlab'); if (saved) return JSON.parse(saved) } catch {}
    }
    return defaultDecision
  })

  useEffect(() => {
    localStorage.setItem('decisionlab', JSON.stringify(decision))
  }, [decision])

  const update = useCallback((patch: Partial<Decision>) => setDecision((d) => ({ ...d, ...patch })), [])

  const addCriterion = () => update({ criteria: [...decision.criteria, { id: genId(), name: 'New Criterion', weight: 5 }] })
  const addOption = () => update({ options: [...decision.options, { id: genId(), name: 'New Option', pros: '', cons: '', scores: {} }] })

  const updateCriterion = (id: string, patch: Partial<Criterion>) =>
    update({ criteria: decision.criteria.map((c) => c.id === id ? { ...c, ...patch } : c) })

  const updateOption = (id: string, patch: Partial<Option>) =>
    update({ options: decision.options.map((o) => o.id === id ? { ...o, ...patch } : o) })

  const setScore = (optId: string, critId: string, val: number) =>
    update({ options: decision.options.map((o) => o.id === optId ? { ...o, scores: { ...o.scores, [critId]: val } } : o) })

  const scores = decision.options.map((o) => ({ option: o, score: calcScore(o, decision.criteria) })).sort((a, b) => b.score - a.score)
  const maxScore = Math.max(...scores.map((s) => s.score), 1)

  const WINNER_COLORS = ['#f59e0b', '#94a3b8', '#92400e']

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-neutral-100 p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 flex items-center justify-between flex-wrap gap-4">
          <div>
            <input
              type="text"
              value={decision.title}
              onChange={(e) => update({ title: e.target.value })}
              className="text-2xl font-bold bg-transparent border-b border-transparent hover:border-[#333] focus:border-blue-500 outline-none text-neutral-100 pb-1 transition-colors"
              aria-label="Decision title"
            />
            <p className="text-sm text-neutral-500 mt-1">Weighted scoring decision matrix</p>
          </div>
          <button
            onClick={() => { if (confirm('Reset to default?')) { setDecision(defaultDecision) } }}
            className="text-xs px-3 py-1.5 border border-[#2e2e2e] hover:border-[#444] rounded text-neutral-500 hover:text-neutral-200 transition-colors"
          >
            Reset
          </button>
        </header>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Criteria */}
          <div>
            <h2 className="text-sm font-semibold text-neutral-300 mb-3 uppercase tracking-wider">Criteria & Weights</h2>
            <div className="space-y-2">
              {decision.criteria.map((c) => (
                <div key={c.id} className="bg-[#1a1a1a] border border-[#2e2e2e] rounded-lg p-3">
                  <input
                    type="text"
                    value={c.name}
                    onChange={(e) => updateCriterion(c.id, { name: e.target.value })}
                    className="w-full bg-transparent text-sm text-neutral-200 outline-none border-b border-transparent focus:border-[#444] mb-2"
                    aria-label="Criterion name"
                  />
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-neutral-600">Weight:</span>
                    <input type="range" min={1} max={10} value={c.weight} onChange={(e) => updateCriterion(c.id, { weight: Number(e.target.value) })} className="flex-1 accent-blue-500" aria-label={`Weight for ${c.name}`} />
                    <span className="text-xs text-neutral-400 w-4 tabular-nums">{c.weight}</span>
                    <button onClick={() => update({ criteria: decision.criteria.filter((x) => x.id !== c.id) })} className="text-neutral-700 hover:text-red-400 transition-colors" aria-label="Remove criterion">×</button>
                  </div>
                </div>
              ))}
              <button onClick={addCriterion} className="w-full py-2.5 border border-dashed border-[#2e2e2e] hover:border-[#444] rounded-lg text-xs text-neutral-600 hover:text-neutral-300 transition-colors">+ Add criterion</button>
            </div>
          </div>

          {/* Scoring matrix */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-neutral-300 uppercase tracking-wider">Scoring Matrix</h2>
              <button onClick={addOption} className="text-xs px-3 py-1.5 bg-[#1a1a1a] border border-[#2e2e2e] hover:border-[#444] rounded text-neutral-500 hover:text-neutral-200 transition-colors">+ Add option</button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr>
                    <th className="text-left py-2 pr-4 text-xs text-neutral-500 font-normal">Option</th>
                    {decision.criteria.map((c) => (
                      <th key={c.id} className="text-center py-2 px-2 text-xs text-neutral-500 font-normal min-w-[80px]">
                        {c.name}<br /><span className="text-neutral-700">w={c.weight}</span>
                      </th>
                    ))}
                    <th className="text-center py-2 px-2 text-xs text-neutral-500 font-normal">Score</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {decision.options.map((o) => {
                    const score = calcScore(o, decision.criteria)
                    return (
                      <tr key={o.id} className="border-t border-[#1e1e1e]">
                        <td className="py-3 pr-4">
                          <input
                            type="text"
                            value={o.name}
                            onChange={(e) => updateOption(o.id, { name: e.target.value })}
                            className="w-full bg-transparent text-neutral-200 outline-none border-b border-transparent focus:border-[#444]"
                            aria-label="Option name"
                          />
                        </td>
                        {decision.criteria.map((c) => (
                          <td key={c.id} className="py-3 px-2 text-center">
                            <input
                              type="number"
                              min={1} max={10}
                              value={o.scores[c.id] ?? 5}
                              onChange={(e) => setScore(o.id, c.id, Math.min(10, Math.max(1, Number(e.target.value))))}
                              className="w-14 text-center bg-[#1a1a1a] border border-[#2e2e2e] rounded px-1 py-1 text-sm outline-none focus:border-blue-500"
                              aria-label={`Score for ${o.name} on ${c.name}`}
                            />
                          </td>
                        ))}
                        <td className="py-3 px-2 text-center">
                          <span className="font-bold text-blue-400 tabular-nums">{score}</span>
                          <span className="text-neutral-700 text-xs">/100</span>
                        </td>
                        <td className="py-3 pl-2">
                          <button onClick={() => update({ options: decision.options.filter((x) => x.id !== o.id) })} className="text-neutral-700 hover:text-red-400 transition-colors" aria-label="Remove option">×</button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Results */}
            <div className="mt-6">
              <h2 className="text-sm font-semibold text-neutral-300 mb-3 uppercase tracking-wider">Results</h2>
              <div className="space-y-2">
                {scores.map(({ option, score }, i) => (
                  <div key={option.id} className="flex items-center gap-3 bg-[#1a1a1a] border border-[#2e2e2e] rounded-lg p-3">
                    <span className="text-lg font-bold w-6" style={{ color: WINNER_COLORS[i] ?? '#555' }}>{i + 1}</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-sm text-neutral-200">{option.name}</span>
                        <span className="font-bold tabular-nums" style={{ color: WINNER_COLORS[i] ?? '#888' }}>{score}</span>
                      </div>
                      <div className="h-1.5 bg-[#2e2e2e] rounded-full">
                        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${(score / maxScore) * 100}%`, background: WINNER_COLORS[i] ?? '#555' }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
