import { newCriterionId, newOptionId, type Decision } from './types'

export function createDefaultDecision(): Decision {
  const cost = newCriterionId()
  const quality = newCriterionId()
  const speed = newCriterionId()

  return {
    title: 'My Decision',
    criteria: [
      { id: cost, name: 'Cost', weight: 8 },
      { id: quality, name: 'Quality', weight: 9 },
      { id: speed, name: 'Speed', weight: 6 },
    ],
    options: [
      {
        id: newOptionId(),
        name: 'Option A',
        pros: 'Affordable',
        cons: 'Slower',
        scores: { [cost]: 8, [quality]: 5, [speed]: 4 },
      },
      {
        id: newOptionId(),
        name: 'Option B',
        pros: 'Fast delivery',
        cons: 'More expensive',
        scores: { [cost]: 4, [quality]: 6, [speed]: 8 },
      },
    ],
  }
}
