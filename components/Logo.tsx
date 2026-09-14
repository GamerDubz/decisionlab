type LogoProps = {
  size?: number
  className?: string
}

/**
 * DecisionLab's mark: a balance mid-weigh — beam tilted, not level, because
 * the tool is for decisions still being weighed, not ones already settled.
 * Pure geometric strokes so it reads cleanly from a 16px favicon up to a
 * 512px splash mark.
 */
export function Logo({ size = 32, className }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="DecisionLab"
    >
      {/* base */}
      <path d="M11 29H21" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
      {/* stem */}
      <path d="M16 29V7" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
      {/* fulcrum */}
      <path d="M16 7L21.5 16.5H10.5L16 7Z" fill="currentColor" />
      {/* beam, tilted mid-weigh */}
      <path d="M5 11.5L27 6" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
      {/* hangers */}
      <path d="M5 11.5V17.5" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" />
      <path d="M27 6V13.5" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" />
      {/* left pan, resting low */}
      <path
        d="M1 17.5C1 20.5 3.5 22.5 5 22.5C6.5 22.5 9 20.5 9 17.5"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
      />
      {/* right pan, still rising */}
      <path
        d="M23.5 13.5C23.5 15.5 25 17 27 17C29 17 30.5 15.5 30.5 13.5"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
      />
      {/* the accent: the pivot point where the call gets made */}
      <circle cx="16" cy="7" r="1.75" fill="var(--color-amber, currentColor)" />
    </svg>
  )
}
