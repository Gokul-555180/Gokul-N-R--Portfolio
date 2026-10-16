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

export function DoodleBeagle({ className = '' }: DoodleProps) {
  return <svg className={`beagle-doodle ${className}`} viewBox="0 0 420 300" aria-hidden="true">
    <path d="M50 229c31-16 70-22 119-18 37 3 73 17 112 14 41-3 66-22 90-8 22 13 17 47-12 54H91c-31 0-59-13-60-42 0-12 7-23 19-28Z" fill="#f5ebdd" stroke="#171717" strokeWidth="3" strokeLinejoin="round" />
    <path d="M216 134c30-35 92-32 120-4 18 18 23 56 4 76-20 21-55 15-78 10l-46-13c-30-9-32-45 0-69Z" fill="#f5ebdd" stroke="#171717" strokeWidth="3" strokeLinejoin="round" />
    <path d="M265 142c-14-26-6-57 19-67 24-10 55 7 53 31-1 22-23 36-45 46Z" fill="#171717" stroke="#171717" strokeWidth="3" strokeLinejoin="round" />
    <path d="M248 179c17 5 42 7 58 1" fill="none" stroke="#171717" strokeWidth="3" strokeLinecap="round" />
    <circle cx="279" cy="155" r="4" fill="#171717" />
    <circle cx="329" cy="176" r="6" fill="#171717" />
    <path d="M229 205c25 9 55 14 85 10" fill="none" stroke="#1454a4" strokeWidth="8" strokeLinecap="round" />
    <circle cx="267" cy="213" r="7" fill="#d7b56e" stroke="#171717" strokeWidth="2" />
    <path d="M104 204c24-27 64-27 91 0l-15 38H88l16-38Z" fill="#1454a4" stroke="#171717" strokeWidth="3" strokeLinejoin="round" />
    <path d="M85 241h111" stroke="#171717" strokeWidth="3" strokeLinecap="round" />
    <path d="M127 184c5-19 17-32 36-40M146 180c8-16 20-26 36-31" fill="none" stroke="#d7b56e" strokeWidth="3" strokeLinecap="round" />
    <path d="M65 270h297" stroke="#171717" strokeWidth="3" strokeLinecap="round" />
    <path d="M71 279h164M258 279h93" stroke="#1454a4" strokeWidth="3" strokeLinecap="round" opacity=".72" />
    <path d="M361 67c8-10 17-10 23 0M376 45c8-10 17-10 23 0" fill="none" stroke="#1454a4" strokeWidth="3" strokeLinecap="round" />
  </svg>
}
