export type ProjectStatus = 'MVP in progress' | 'Prototype'

export type Project = {
  slug: string
  number: string
  name: string
  shortName: string
  category: string
  status: ProjectStatus
  year: string
  description: string
  problem: string
  solution: string
  contribution: string
  stack: string[]
  highlights: string[]
  source?: string
  accent: 'violet' | 'blue' | 'peach'
  artwork: 'ledger' | 'moderation' | 'route'
}

export const site = {
  name: 'Gokul N. R.',
  shortName: 'Gokul',
  role: 'Computer Science Engineering student',
  school: 'Vidya Academy of Science and Technology, Kerala',
  email: 'gokulnenmini212@gmail.com',
  github: 'https://github.com/Gokul-555180',
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://example.com',
}

// This file is the portfolio CMS. Only publish claims that have a source in a project,
// résumé, certificate, or other record you are ready to stand behind.
export const projects: Project[] = [
  {
    slug: 'gstguard',
    number: '01',
    name: 'GSTGuard',
    shortName: 'GSTGuard',
    category: 'Document intelligence',
    status: 'Prototype',
    year: '2026',
    description: 'An AI-assisted GST invoice-reconciliation and case-management platform built around deterministic checks and human review.',
    problem: 'Accounts teams must reconcile purchase orders and GST invoices while catching tax, quantity, price, and GSTIN discrepancies without losing an audit trail.',
    solution: 'GSTGuard combines PDF/OCR ingestion, structured extraction, deterministic reconciliation, compliance retrieval, and an evidence-led human-review workflow.',
    contribution: 'Built the product as a full-stack document-intelligence workflow, with a Next.js frontend, Django REST services, deterministic Python tools, and governed AI assistance.',
    stack: ['Next.js', 'Django', 'Python', 'Tesseract OCR', 'LangGraph', 'FAISS'],
    highlights: [
      'Separates generative document understanding from deterministic tax calculations and validation.',
      'Routes final approval, rejection, or clarification decisions to a human reviewer.',
      'Records evidence, discrepancy flags, and case progress in an auditable workflow.',
    ],
    source: 'https://github.com/Gokul-555180/gst-invoice-reconciliation',
    accent: 'violet',
    artwork: 'ledger',
  },
  {
    slug: 'mulearn-vast-moderation',
    number: '02',
    name: 'µLearn VAST Moderator',
    shortName: 'VAST Moderator',
    category: 'Event moderation',
    status: 'Prototype',
    year: '2026',
    description: 'A real-time moderation, scoring, and analytics suite for µLearn VAST hackathons, bootcamps, and technical showcases.',
    problem: 'Moderators need one dependable place to award mission XP, apply consistent judging criteria, follow leaderboard changes, and close an event with useful reports.',
    solution: 'The panel combines live event spaces, multi-stage mission scoring, a five-pillar rubric, activity logs, leaderboard sync, and PDF export.',
    contribution: 'Built the React and TypeScript moderation experience, including responsive event operations, scoring flows, visual feedback, and resilient data states.',
    stack: ['React', 'TypeScript', 'Tailwind CSS', 'Firebase', 'Framer Motion', 'jsPDF'],
    highlights: [
      'Keeps a live activity trail for score changes, event locks, and export actions.',
      'Supports Firebase Firestore real-time sync with a browser-local demo fallback.',
      'Generates leaderboard and event-retrospective PDF reports from the client.',
    ],
    accent: 'blue',
    source: 'https://github.com/Gokul-555180/MuLearn-VAST-Moderation',
    artwork: 'moderation',
  },
  {
    slug: 'samadhan',
    number: '03',
    name: 'Samadhan',
    shortName: 'Samadhan',
    category: 'Civic workflow',
    status: 'Prototype',
    year: '2026',
    description: 'A transport-grievance workflow concept that turns a passenger report into a structured case people can follow.',
    problem: 'Public transport complaints can be hard to structure, route to the responsible group, and track once they are submitted.',
    solution: 'Samadhan offers a guided reporting flow, route-aware case information, tracking views, and administrator-facing review surfaces.',
    contribution: 'Contributed to the product interface for report creation, routing, case tracking, and administrative review states.',
    stack: ['React', 'TypeScript', 'Vite', 'REST APIs', 'Supabase'],
    highlights: [
      'Covers report categories including routes, vehicles, staff, and service issues.',
      'Has public tracking and administrative case-review interfaces.',
      'Presented as a prototype workflow, not as a government production deployment.',
    ],
    source: 'https://github.com/Gokul-555180/Aanavandi-hackathon',
    accent: 'peach',
    artwork: 'route',
  },
]

export const skillGroups = [
  {
    id: 'interface',
    label: 'Interface kit',
    code: 'INV-01',
    summary: 'Turning practical flows into clear, responsive interfaces.',
    items: ['HTML', 'CSS', 'JavaScript', 'TypeScript', 'React', 'Tailwind CSS'],
  },
  {
    id: 'systems',
    label: 'Systems shelf',
    code: 'INV-02',
    summary: 'The supporting pieces behind a dependable web experience.',
    items: ['Node.js', 'Express', 'REST APIs', 'Google Sheets API', 'MongoDB', 'SQL'],
  },
  {
    id: 'applied',
    label: 'Applied lab',
    code: 'INV-03',
    summary: 'Exploring assistive technologies where trust and feedback matter.',
    items: ['Python', 'AI / LLM integration', 'OCR', 'Tesseract', 'ZXing'],
  },
  {
    id: 'workbench',
    label: 'Workbench',
    code: 'INV-04',
    summary: 'Tools I use to ship, iterate, and keep the work legible.',
    items: ['Git', 'GitHub', 'Figma', 'Vite', 'C', 'C++', 'Java'],
  },
] as const

export const journey = [
  {
    marker: 'NOW',
    title: 'Building useful systems',
    detail: 'Developing product ideas that connect software, AI assistance, and thoughtful interface design.',
  },
  {
    marker: 'B.TECH',
    title: 'Computer Science & Engineering',
    detail: 'Studying Computer Science and Engineering at Vidya Academy of Science and Technology, Kerala.',
  },
  {
    marker: 'LOG',
    title: 'Learning by shipping',
    detail: 'Using project work to explore access to information, event operations, civic workflows, and polished product interactions.',
  },
]

export const currentDesk = {
  building: 'GSTGuard — a human-governed document-intelligence workflow for GST invoice reconciliation.',
  learning: 'How deterministic rules, document intelligence, and useful human-in-the-loop controls can work together.',
  note: 'Update this status directly in data/portfolio.ts when your focus changes.',
}

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug)
}
