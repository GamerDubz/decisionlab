import type { ScoredOption } from '@/lib/types'

type BalanceBeamProps = {
  leader?: ScoredOption
  runnerUp?: ScoredOption
}

/**
 * The literal weighing: the beam tilts toward whichever pan is "heavier"
 * (higher-scoring). It's the load-bearing visual of the results section,
 * not decoration — a glance tells you who's ahead before you read a number.
 */
export function BalanceBeam({ leader, runnerUp }: BalanceBeamProps) {
  const diff = leader && runnerUp ? leader.score - runnerUp.score : leader ? 100 : 0
  const angle = Math.max(-11, Math.min(11, diff * 0.22))

  return (
    <div className="flex flex-col items-center gap-3 py-2">
      <svg
        width="240"
        height="118"
        viewBox="0 0 240 118"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="max-w-full"
      >
        <path d="M100 108H140" stroke="var(--color-line)" strokeWidth={3} strokeLinecap="round" />
        <path d="M120 108V38" stroke="var(--color-ink-faint)" strokeWidth={3} strokeLinecap="round" />
        <path d="M120 38L132 54H108L120 38Z" fill="var(--color-ink-faint)" />

        <g
          style={{
            transform: `rotate(${angle}deg)`,
            transformOrigin: '120px 38px',
            transition: 'transform 700ms cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
        >
          <path d="M40 38H200" stroke="var(--color-ink)" strokeWidth={3} strokeLinecap="round" />
          <path d="M40 38V72" stroke="var(--color-ink-faint)" strokeWidth={2} strokeLinecap="round" />
          <path d="M200 38V72" stroke="var(--color-ink-faint)" strokeWidth={2} strokeLinecap="round" />
          <path
            d="M22 72C22 84 30 92 40 92C50 92 58 84 58 72"
            stroke={leader ? 'var(--color-amber-ink)' : 'var(--color-ink-faint)'}
            strokeWidth={2.5}
            strokeLinecap="round"
            fill={leader ? 'var(--color-amber-soft)' : 'transparent'}
          />
          <path
            d="M182 72C182 84 190 92 200 92C210 92 218 84 218 72"
            stroke="var(--color-ink-faint)"
            strokeWidth={2.5}
            strokeLinecap="round"
          />
        </g>
      </svg>

      <div className="flex w-full max-w-[240px] justify-between px-1 text-center">
        <span className="text-xs font-semibold text-[color:var(--color-amber-ink)]">
          {leader ? leader.option.name : '—'}
        </span>
        <span className="text-xs text-[color:var(--color-ink-faint)]">{runnerUp ? runnerUp.option.name : ''}</span>
      </div>
    </div>
  )
}
