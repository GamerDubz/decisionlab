import type { Decision } from './types'

const STORAGE_KEY = 'decisionlab'

/** Reads the saved decision from localStorage. Never throws — logs and falls back instead. */
export function loadDecision(): Decision | null {
  if (typeof window === 'undefined') return null
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    if (!saved) return null
    return JSON.parse(saved) as Decision
  } catch (error) {
    console.error('DecisionLab: could not read saved decision from localStorage.', error)
    return null
  }
}

/** Persists the decision to localStorage. Never throws — logs instead (e.g. storage full/blocked). */
export function saveDecision(decision: Decision): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(decision))
  } catch (error) {
    console.error('DecisionLab: could not save the decision to localStorage.', error)
  }
}
