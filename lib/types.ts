/**
 * Domain types for DecisionLab's weighted-scoring matrix.
 *
 * Ids are branded so a `CriterionId` and an `OptionId` can never be
 * swapped by accident, even though both are plain strings at runtime.
 */
type Brand<T, B extends string> = T & { readonly __brand: B }

export type CriterionId = Brand<string, 'CriterionId'>
export type OptionId = Brand<string, 'OptionId'>

/** Score a user assigns an option for one criterion, always 1-10. */
export type ScoreValue = number

export type Criterion = {
  id: CriterionId
  name: string
  /** How much this criterion counts toward the total, 1 (barely) - 10 (decisive). */
  weight: number
}

export type Option = {
  id: OptionId
  name: string
  pros: string
  cons: string
  scores: Record<CriterionId, ScoreValue>
}

export type Decision = {
  title: string
  criteria: Criterion[]
  options: Option[]
}

export type ScoredOption = {
  option: Option
  /** Weighted percentage score, 0-100. */
  score: number
}

const ID_ALPHABET = 'abcdefghijklmnopqrstuvwxyz0123456789'

function randomId(): string {
  let out = ''
  for (let i = 0; i < 12; i += 1) {
    out += ID_ALPHABET[Math.floor(Math.random() * ID_ALPHABET.length)]
  }
  return out
}

export function newCriterionId(): CriterionId {
  return randomId() as CriterionId
}

export function newOptionId(): OptionId {
  return randomId() as OptionId
}
