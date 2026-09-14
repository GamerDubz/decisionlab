import { RotateCcw } from 'lucide-react'
import { Logo } from './Logo'

type HeaderProps = {
  title: string
  onTitleChange: (title: string) => void
  onReset: () => void
}

export function Header({ title, onTitleChange, onReset }: HeaderProps) {
  return (
    <header className="mb-10 flex flex-wrap items-start justify-between gap-4 border-b border-[color:var(--color-line)] pb-6">
      <div className="flex items-start gap-3">
        <Logo size={34} className="mt-1 shrink-0 text-[color:var(--color-ink)]" />
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[color:var(--color-ink-faint)]">
            DecisionLab
          </p>
          <input
            type="text"
            value={title}
            onChange={(event) => onTitleChange(event.target.value)}
            className="-ml-0.5 mt-0.5 min-w-[12ch] bg-transparent px-0.5 text-2xl font-extrabold text-[color:var(--color-ink)] outline-none border-b-2 border-transparent focus-visible:border-[color:var(--color-amber-ink)]"
            aria-label="Decision title"
          />
          <p className="mt-1 text-[15px] text-[color:var(--color-ink-soft)]">
            Weigh your options against what actually matters.
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={onReset}
        className="flex min-h-11 items-center gap-1.5 rounded-sm border border-[color:var(--color-line)] px-3.5 text-sm text-[color:var(--color-ink-soft)] transition-colors hover:border-[color:var(--color-rust)] hover:text-[color:var(--color-rust)]"
      >
        <RotateCcw size={15} aria-hidden="true" />
        Reset
      </button>
    </header>
  )
}
