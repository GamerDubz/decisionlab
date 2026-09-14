import type { Criterion, Decision, Option, ScoredOption } from './types'

export const MIN_SCORE = 1
export const MAX_SCORE = 10
/** Score assumed for a cell the user hasn't touched yet — the midpoint, not a penalty. */
export const DEFAULT_SCORE = 5

export function clampScore(value: number): number {
  if (Number.isNaN(value)) return DEFAULT_SCORE
  return Math.min(MAX_SCORE, Math.max(MIN_SCORE, Math.round(value)))
}

export function clampWeight(value: number): number {
  if (Number.isNaN(value)) return MIN_SCORE
  return Math.min(MAX_SCORE, Math.max(MIN_SCORE, Math.round(value)))
}

/**
 * Weighted percentage (0-100) an option earns across all criteria.
 * Untouched cells default to the midpoint so a fresh option isn't
 * unfairly punished before it's been scored.
 */
export function calcScore(option: Option, criteria: Criterion[]): number {
  let total = 0
  let maxTotal = 0
  for (const criterion of criteria) {
    const score = option.scores[criterion.id] ?? DEFAULT_SCORE
    total += score * criterion.weight
    maxTotal += MAX_SCORE * criterion.weight
  }
  return maxTotal === 0 ? 0 : Math.round((total / maxTotal) * 100)
}

/** All options scored and ranked highest-first. */
export function rankOptions(decision: Decision): ScoredOption[] {
  return decision.options
    .map((option) => ({ option, score: calcScore(option, decision.criteria) }))
    .sort((a, b) => b.score - a.score)
}
