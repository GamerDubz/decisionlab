'use client'

import { useState, useCallback, useEffect, useMemo } from 'react'

type Criterion = {
  id: string
  name: string
  weight: number
}

type Option = {
  id: string
  name: string
  pros: string
  cons: string
  scores: Record<string, number>
}

type Decision = {
  title: string
  description: string
  criteria: Criterion[]
  options: Option[]
}

const genId = () => Math.random().toString(36).slice(2, 8)

const SAMPLE_TECH_STACK: Decision = {
  title: 'Next-Gen Web Architecture Framework',
  description: 'Evaluating modern frontend frameworks for our flagship client product',
  criteria: [
    { id: 'c1', name: 'Developer Velocity & DX', weight: 9 },
    { id: 'c2', name: 'Performance & Lighthouse Score', weight: 8 },
    { id: 'c3', name: 'Ecosystem & Library Support', weight: 10 },
    { id: 'c4', name: 'Deployment & Edge Infrastructure', weight: 7 },
    { id: 'c5', name: 'Learning Curve & Hiring Pool', weight: 6 },
  ],
  options: [
    {
      id: 'o1',
      name: 'Next.js (App Router)',
      pros: 'Huge community, Server Components, Vercel zero-config edge, easy hiring',
      cons: 'Turbopack edge cases, opinionated caching model',
      scores: { c1: 9, c2: 8, c3: 10, c4: 10, c5: 9 },
    },
    {
      id: 'o2',
      name: 'Remix / React Router v7',
      pros: 'Standard Web Fetch APIs, resilient nested routing, simple data loaders',
      cons: 'Smaller package ecosystem, fewer drop-in starters',
      scores: { c1: 8, c2: 9, c3: 7, c4: 8, c5: 7 },
    },
    {
      id: 'o3',
      name: 'Astro (Content & Islands)',
      pros: 'Zero-JS default HTML, stellar performance scores, multi-framework islands',
      cons: 'Less suited for heavy client-side stateful applications',
      scores: { c1: 8, c2: 10, c3: 6, c4: 8, c5: 8 },
    },
  ],
}

function calcScore(option: Option, criteria: Criterion[]): { pct: number; weightedTotal: number; maxTotal: number } {
  let total = 0
  let maxTotal = 0
  criteria.forEach((c) => {
    const score = option.scores[c.id] ?? 5
    total += score * c.weight
    maxTotal += 10 * c.weight
  })
  const pct = maxTotal === 0 ? 0 : Math.round((total / maxTotal) * 100)
  return { pct, weightedTotal: total, maxTotal }
}

export default function DecisionLabPage() {
  const [decision, setDecision] = useState<Decision>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('decisionlab_v2')
        if (saved) return JSON.parse(saved)
      } catch {}
    }
    return SAMPLE_TECH_STACK
  })

  const [copied, setCopied] = useState(false)

  useEffect(() => {
    try {
      localStorage.setItem('decisionlab_v2', JSON.stringify(decision))
    } catch {}
  }, [decision])

  const update = useCallback((patch: Partial<Decision>) => setDecision((d) => ({ ...d, ...patch })), [])

  const addCriterion = () =>
    update({
      criteria: [
        ...decision.criteria,
        { id: genId(), name: `New Criterion ${decision.criteria.length + 1}`, weight: 7 },
      ],
    })

  const removeCriterion = (id: string) => {
    if (decision.criteria.length <= 1) return
    update({ criteria: decision.criteria.filter((c) => c.id !== id) })
  }

  const addOption = () =>
    update({
      options: [
        ...decision.options,
        { id: genId(), name: `Option ${String.fromCharCode(65 + decision.options.length)}`, pros: '', cons: '', scores: {} },
      ],
    })

  const removeOption = (id: string) => {
    if (decision.options.length <= 1) return
    update({ options: decision.options.filter((o) => o.id !== id) })
  }

  const updateCriterion = (id: string, patch: Partial<Criterion>) =>
    update({ criteria: decision.criteria.map((c) => (c.id === id ? { ...c, ...patch } : c)) })

  const updateOption = (id: string, patch: Partial<Option>) =>
    update({ options: decision.options.map((o) => (o.id === id ? { ...o, ...patch } : o)) })

  const setScore = (optId: string, critId: string, val: number) =>
    update({
      options: decision.options.map((o) =>
        o.id === optId ? { ...o, scores: { ...o.scores, [critId]: val } } : o
      ),
    })

  // Ranked scores
  const rankedResults = useMemo(() => {
    return decision.options
      .map((o) => ({
        option: o,
        ...calcScore(o, decision.criteria),
      }))
      .sort((a, b) => b.pct - a.pct)
  }, [decision.options, decision.criteria])

  const champion = rankedResults[0]
  const runnerUp = rankedResults[1]
  const margin = runnerUp ? champion.pct - runnerUp.pct : 0

  const copySummaryReport = () => {
    const lines = [
      `🎯 Decision Matrix Report: ${decision.title}`,
      `Description: ${decision.description || 'N/A'}`,
      '------------------------------------------------',
      `🏆 WINNER: ${champion?.option.name} (${champion?.pct}% Score)`,
      margin > 0 ? `Margin of victory: +${margin}% over ${runnerUp?.option.name}` : '',
      '',
      'Ranked Standings:',
      ...rankedResults.map((r, i) => `#${i + 1}. ${r.option.name} — ${r.pct}% (${r.weightedTotal}/${r.maxTotal} pts)`),
      '',
      'Weighted Criteria Considered:',
      ...decision.criteria.map((c) => `• ${c.name} (Weight: ${c.weight}/10)`),
    ]
    navigator.clipboard.writeText(lines.filter(Boolean).join('\n'))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col pb-16">
      {/* Top Navigation */}
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-md px-6 py-3.5 shadow-xs">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 via-purple-600 to-amber-500 p-0.5 shadow-sm shadow-violet-500/20 flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <svg className="w-5 h-5 text-violet-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 3v18" />
                  <path d="M6 8l12-3" />
                  <path d="M6 8a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />
                  <path d="M18 5a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />
                </svg>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold tracking-tight text-slate-900">
                  Decision<span className="text-violet-600">Lab</span>
                </h1>
                <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-violet-50 text-violet-700 border border-violet-200">
                  Weighted Matrix
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Multi-criteria analytical matrix & rational option scorecard
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setDecision(SAMPLE_TECH_STACK)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Load Sample Matrix
            </button>
            <button
              onClick={copySummaryReport}
              className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-sm transition-all hover:scale-[1.02] flex items-center gap-1.5 cursor-pointer"
            >
              <span>{copied ? '✓ Report Copied!' : '📋 Export Summary Report'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl w-full mx-auto p-4 sm:p-8 flex-1 space-y-6">
        {/* Title Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-2">
          <input
            type="text"
            value={decision.title}
            onChange={(e) => update({ title: e.target.value })}
            placeholder="Decision Goal (e.g. Choosing Database for 2026)"
            className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 w-full border-b border-transparent hover:border-slate-300 focus:border-violet-500 outline-none transition-colors"
          />
          <input
            type="text"
            value={decision.description}
            onChange={(e) => update({ description: e.target.value })}
            placeholder="Brief context or key decision drivers..."
            className="text-xs sm:text-sm text-slate-500 w-full border-b border-transparent hover:border-slate-200 focus:border-violet-500 outline-none"
          />
        </div>

        {/* Champion Winner Spotlight Card */}
        {champion && (
          <div className="bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-violet-600/20 flex flex-wrap items-center justify-between gap-6">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-amber-300 border border-white/20 text-xs font-bold uppercase tracking-wider">
                <span>👑</span>
                <span>Top Recommended Choice</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight mt-1">
                {champion.option.name}
              </h2>
              {champion.option.pros && (
                <p className="text-xs sm:text-sm text-violet-100/90 max-w-xl">
                  {champion.option.pros}
                </p>
              )}
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 text-right min-w-[170px]">
              <span className="text-[11px] uppercase font-semibold text-violet-200 block">
                Weighted Score
              </span>
              <span className="text-4xl font-black font-mono text-white tracking-tight mt-0.5 block">
                {champion.pct}%
              </span>
              {margin > 0 && (
                <span className="text-[11px] text-amber-300 font-semibold block mt-1">
                  +{margin}% over runner-up
                </span>
              )}
            </div>
          </div>
        )}

        {/* Two-Column Layout: Criteria Weights (5 cols) & Options Scorecards (7 cols) */}
        <div className="grid lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Criteria & Weights (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-base text-slate-900 tracking-tight">
                  Evaluation Criteria
                </h3>
                <p className="text-xs text-slate-500">Weight each metric by priority (1 - 10)</p>
              </div>
              <button
                onClick={addCriterion}
                className="px-3 py-1.5 rounded-xl bg-violet-50 hover:bg-violet-100 text-violet-700 text-xs font-semibold border border-violet-200 transition-colors cursor-pointer"
              >
                + Add Criterion
              </button>
            </div>

            <div className="space-y-3">
              {decision.criteria.map((c) => {
                const weightLabel = c.weight >= 9 ? 'Critical' : c.weight >= 7 ? 'High' : c.weight >= 5 ? 'Medium' : 'Low'
                const weightColor =
                  c.weight >= 9
                    ? 'bg-rose-50 text-rose-700 border-rose-200'
                    : c.weight >= 7
                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                    : 'bg-slate-100 text-slate-600 border-slate-200'

                return (
                  <div key={c.id} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/70 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <input
                        type="text"
                        value={c.name}
                        onChange={(e) => updateCriterion(c.id, { name: e.target.value })}
                        className="font-semibold text-xs text-slate-800 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-violet-500 outline-none w-full"
                      />
                      <div className="flex items-center gap-1.5">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${weightColor}`}>
                          {weightLabel}
                        </span>
                        {decision.criteria.length > 1 && (
                          <button
                            onClick={() => removeCriterion(c.id)}
                            className="text-slate-300 hover:text-rose-500 text-xs p-1"
                            title="Remove criterion"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min={1}
                        max={10}
                        step={1}
                        value={c.weight}
                        onChange={(e) => updateCriterion(c.id, { weight: Number(e.target.value) })}
                        className="w-full accent-violet-600"
                      />
                      <span className="text-xs font-mono font-bold text-violet-700 w-8 text-right">
                        {c.weight}/10
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Right Column: Options Scorecards (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
              <div>
                <h3 className="font-bold text-sm text-slate-900 tracking-tight">
                  Options Under Evaluation ({decision.options.length})
                </h3>
                <p className="text-xs text-slate-500">Rate each option on a scale of 1 to 10 for every criterion</p>
              </div>
              <button
                onClick={addOption}
                className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-sm transition-all cursor-pointer"
              >
                + Add Option
              </button>
            </div>

            <div className="space-y-4">
              {decision.options.map((opt, oIdx) => {
                const scoreResult = calcScore(opt, decision.criteria)
                const isWinner = champion?.option.id === opt.id

                return (
                  <div
                    key={opt.id}
                    className={`bg-white rounded-3xl p-6 border transition-all ${
                      isWinner
                        ? 'border-violet-400 ring-2 ring-violet-500/20 shadow-md'
                        : 'border-slate-200/80 shadow-sm hover:shadow-md'
                    }`}
                  >
                    {/* Option Header */}
                    <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-slate-400">
                            #{oIdx + 1}
                          </span>
                          <input
                            type="text"
                            value={opt.name}
                            onChange={(e) => updateOption(opt.id, { name: e.target.value })}
                            placeholder="Option Name"
                            className="text-lg font-bold text-slate-900 border-b border-transparent hover:border-slate-300 focus:border-violet-500 outline-none"
                          />
                          {isWinner && (
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-300">
                              🏆 Leading
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <span className="text-2xl font-black font-mono tracking-tight text-violet-700">
                            {scoreResult.pct}%
                          </span>
                          <span className="text-[10px] text-slate-400 block">
                            {scoreResult.weightedTotal}/{scoreResult.maxTotal} pts
                          </span>
                        </div>
                        {decision.options.length > 1 && (
                          <button
                            onClick={() => removeOption(opt.id)}
                            className="text-slate-300 hover:text-rose-500 text-xs p-1"
                            title="Remove option"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Criteria Ratings Sliders */}
                    <div className="py-4 space-y-3">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Criterion Ratings (1 - 10)
                      </span>
                      <div className="grid sm:grid-cols-2 gap-3">
                        {decision.criteria.map((c) => {
                          const rating = opt.scores[c.id] ?? 5
                          return (
                            <div key={c.id} className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                              <div className="flex justify-between text-xs mb-1">
                                <span className="font-medium text-slate-700 truncate max-w-[140px]">
                                  {c.name}
                                </span>
                                <span className="font-mono font-bold text-violet-700">
                                  {rating}/10
                                </span>
                              </div>
                              <input
                                type="range"
                                min={1}
                                max={10}
                                step={1}
                                value={rating}
                                onChange={(e) => setScore(opt.id, c.id, Number(e.target.value))}
                                className="w-full accent-violet-600"
                              />
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    {/* Pros & Cons notes */}
                    <div className="pt-3 border-t border-slate-100 grid sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block mb-1">
                          ✓ Key Advantages (Pros)
                        </span>
                        <input
                          type="text"
                          value={opt.pros}
                          onChange={(e) => updateOption(opt.id, { pros: e.target.value })}
                          placeholder="e.g. Fast setup, low cost, active community..."
                          className="w-full bg-emerald-50/40 border border-emerald-200/60 rounded-xl p-2 text-slate-700 outline-none focus:ring-1 focus:ring-emerald-500"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-rose-700 uppercase tracking-wider block mb-1">
                          ✕ Trade-offs & Risks (Cons)
                        </span>
                        <input
                          type="text"
                          value={opt.cons}
                          onChange={(e) => updateOption(opt.id, { cons: e.target.value })}
                          placeholder="e.g. Vendor lock-in, steeper learning curve..."
                          className="w-full bg-rose-50/40 border border-rose-200/60 rounded-xl p-2 text-slate-700 outline-none focus:ring-1 focus:ring-rose-500"
                        />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
