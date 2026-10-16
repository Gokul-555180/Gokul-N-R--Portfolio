type DoodleProps = { className?: string }

export function DoodleArrow({ className = '' }: DoodleProps) {
  return <svg className={`doodle doodle-arrow ${className}`} viewBox="0 0 130 76" fill="none" aria-hidden="true">
    <path d="M5 17c26 4 40 18 57 36 16 17 34 20 58 16" />
    <path d="m103 56 17 12-13 4" />
    <path d="M7 22c24 4 40 19 55 36" opacity=".48" />
  </svg>
}

export function DoodleUnderline({ className = '' }: DoodleProps) {
  return <svg className={`doodle doodle-underline ${className}`} viewBox="0 0 150 20" fill="none" aria-hidden="true">
    <path d="M4 11c36-7 75-9 142-3" />
    <path d="M10 15c42-4 84-5 124-1" opacity=".42" />
  </svg>
}

export function DoodleSpark({ className = '' }: DoodleProps) {
  return <svg className={`doodle doodle-spark ${className}`} viewBox="0 0 70 70" fill="none" aria-hidden="true">
    <path d="M35 4v19M35 47v19M4 35h19M47 35h19M13 13l13 13M44 44l13 13M57 13 44 26M26 44 13 57" />
    <circle cx="35" cy="35" r="7" />
  </svg>
}

export function DoodleCircle({ className = '' }: DoodleProps) {
  return <svg className={`doodle doodle-circle ${className}`} viewBox="0 0 62 62" fill="none" aria-hidden="true">
    <path d="M52 13C41 1 21 2 10 13 0 24 2 44 14 53c13 10 32 7 40-6 8-12 6-25-2-34Z" />
    <path d="M49 16C39 6 22 5 12 16" opacity=".42" />
  </svg>
}

export function DoodleRectangle({ className = '' }: DoodleProps) {
  return <svg className={`doodle doodle-rectangle ${className}`} viewBox="0 0 122 74" preserveAspectRatio="none" fill="none" aria-hidden="true">
    <path d="M9 12c26-5 71-7 103 1 4 17 2 35-1 49-32 7-70 5-104-1-3-16-2-34 2-49Z" />
    <path d="M13 16c27-4 67-6 95 0" opacity=".4" />
  </svg>
}

export function DoodleConnection({ className = '' }: DoodleProps) {
  return <svg className={`doodle doodle-connection ${className}`} viewBox="0 0 160 120" fill="none" aria-hidden="true">
    <path d="M16 13c18 18 20 36 43 45 25 10 42-5 57 11 10 10 12 25 29 37" />
    <circle cx="16" cy="13" r="4" />
    <circle cx="59" cy="58" r="4" />
    <circle cx="116" cy="69" r="4" />
    <circle cx="145" cy="106" r="4" />
  </svg>
}
