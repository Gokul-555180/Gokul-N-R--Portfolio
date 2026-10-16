export type ProjectArtwork = 'invoice' | 'portal' | 'lab'

export type Project = {
  slug: string
  number: string
  name: string
  shortName: string
  category: string
  year: string
  description: string
  problem: string
  approach: string
  contribution: string
  stack: string[]
  highlights: string[]
  limitations: string
  source: string
  demo?: string
  artwork: ProjectArtwork
}

export const site = {
  name: 'Gokul N. R.',
  role: 'Computer Science and Engineering student',
  school: 'Vidya Academy of Science and Technology',
  email: 'gokulnenmini212@gmail.com',
  github: 'https://github.com/Gokul-555180',
  linkedin: process.env.NEXT_PUBLIC_LINKEDIN_URL ?? 'https://www.linkedin.com/in/gokulnr0212/',
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://example.com',
}

export const projects: Project[] = [
  {
    slug: 'gst-invoice-reconciliation',
    number: '01',
    name: 'GST Invoice Reconciliation',
    shortName: 'GSTGuard',
    category: 'Document intelligence',
    year: '2026',
    description: 'An AI-assisted workflow for reconciling purchase orders and GST invoices while keeping validation and final decisions accountable.',
    problem: 'Accounts teams need to compare purchase orders and GST invoices without losing visibility into GSTIN, quantity, tax-rate, and total discrepancies.',
    approach: 'The application ingests a PO and invoice, extracts structured data from PDFs or OCR, runs deterministic comparisons, retrieves relevant GST guidance, and presents evidence to a reviewer.',
    contribution: 'Built the full-stack reconciliation flow: a Next.js review interface, Django REST services, Python validation tools, document processing, and an evidence-led case workflow.',
    stack: ['Next.js', 'React', 'TypeScript', 'Django REST Framework', 'Python', 'MySQL', 'Redis', 'Celery', 'Gemini', 'LangGraph', 'FAISS', 'Tesseract OCR'],
    highlights: [
      'Uses pypdf first and Tesseract OCR as a fallback for scanned documents.',
      'Keeps GSTIN, line-item, tax, quantity, and amount checks in deterministic Python tools.',
      'Places final approve, reject, and clarification decisions behind an authenticated human-review step.',
    ],
    limitations: 'The repository includes an evaluation framework, but its official labeled benchmark dataset is still required; this portfolio does not make accuracy or production-adoption claims.',
    source: 'https://github.com/Gokul-555180/gst-invoice-reconciliation',
    demo: 'https://gst-reconciliation-ten.vercel.app',
    artwork: 'invoice',
  },
  {
    slug: 'samadhan-grievance-portal',
    number: '02',
    name: 'Samadhan Grievance Portal',
    shortName: 'SAMADHAN',
    category: 'Public transport workflow',
    year: '2026',
    description: 'A prototype for making public-transport complaints easier to file, route to a depot, and follow through a clear status journey.',
    problem: 'Passengers need a straightforward way to report transport issues and understand where a complaint goes after it has been submitted.',
    approach: 'The React application separates a passenger-facing reporting and tracking flow from protected depot operations, with web, voice, and WhatsApp-oriented intake paths represented in the interface.',
    contribution: 'Contributed to the product interface for multilingual complaint intake, tracking, reference numbers, depot-facing review screens, escalation views, and related responsive states.',
    stack: ['React', 'TypeScript', 'Vite', 'React Router', 'Framer Motion', 'Lucide React'],
    highlights: [
      'Includes routes for filing, reviewing, tracking, and viewing a public complaint dashboard.',
      'Provides a separate protected depot area for complaints, escalations, and notifications.',
      'Models passenger intake through web and voice screens, alongside a WhatsApp-oriented reporting path in the product design.',
    ],
    limitations: 'The repository is a frontend prototype with mock-oriented service layers and no published deployment link, so it is not presented as an authority-operated service.',
    source: 'https://github.com/Gokul-555180/Aanavandi-hackathon',
    artwork: 'portal',
  },
  {
    slug: 'virtual-science-lab',
    number: '03',
    name: 'Virtual Science Lab',
    shortName: 'LabSphere',
    category: 'Interactive education',
    year: '2026',
    description: 'A browser-based CBSE virtual laboratory that turns practical-science concepts into guided, interactive learning experiences.',
    problem: 'Students benefit from a safe, repeatable way to practise laboratory concepts, observe readings, and record work outside a physical lab.',
    approach: 'LabSphere presents a React learning interface with experiment browsing, observation tables, quizzes, printable reports, and focused simulations for electricity, titration, microscopy, and program tracing.',
    contribution: 'Built and composed the React and TypeScript experience, including the simulation interfaces, progress-oriented views, observation systems, and accessible learning controls.',
    stack: ['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'Framer Motion', 'Canvas Confetti', 'Lucide React'],
    highlights: [
      "Implements an Ohm's Law circuit with adjustable readings and a V–I graph.",
      'Implements acid-base titration controls with pH feedback, recorded observations, and a curve view.',
      'Also includes biology microscope and computer-science tracing interfaces, plus observation and quiz surfaces.',
    ],
    limitations: 'The repository lists fuller platform ideas such as authentication, teacher workflows, and 3D apparatus as roadmap work; these are not represented here as complete features.',
    source: 'https://github.com/Gokul-555180/LabSphere---Virtual-Science-Lab',
    demo: 'https://labspherevirtuallab.vercel.app',
    artwork: 'lab',
  },
]

export const skillGroups = [
  {
    title: 'Frontend',
    detail: 'Used to make project workflows clear, responsive, and approachable—from navigation through interactive learning controls.',
    items: ['React', 'Next.js', 'TypeScript', 'JavaScript', 'HTML', 'CSS', 'Tailwind CSS', 'Framer Motion'],
    evidence: { label: 'Virtual Science Lab', slug: 'virtual-science-lab' },
  },
  {
    title: 'Backend & data',
    detail: 'Used to support document processing, validation, and the data flows behind practical application interfaces.',
    items: ['Python', 'Django', 'Django REST Framework', 'Node.js', 'Express', 'REST APIs', 'MySQL', 'MongoDB', 'Redis', 'SQL', 'Google Sheets API'],
    evidence: { label: 'GST Invoice Reconciliation', slug: 'gst-invoice-reconciliation' },
  },
  {
    title: 'AI integration',
    detail: 'Applied to document-intelligence work where context, deterministic checks, and human review each have a clear role.',
    items: ['Gemini', 'LangGraph', 'FAISS', 'Pydantic', 'Tesseract OCR', 'RAG workflows'],
    evidence: { label: 'GST Invoice Reconciliation', slug: 'gst-invoice-reconciliation' },
  },
  {
    title: 'Tools & learning',
    detail: 'Tools used or actively explored in public work.',
    items: ['Git', 'GitHub', 'Figma', 'Vite', 'Docker', 'C', 'C++', 'Java'],
    evidence: { label: 'Samadhan Grievance Portal', slug: 'samadhan-grievance-portal' },
  },
] as const

export const journey = [
  {
    marker: '2025',
    title: 'Started publishing project work',
    detail: 'Began sharing small web and learning projects publicly on GitHub, making iteration part of the learning process.',
  },
  {
    marker: '2026',
    title: 'Document intelligence in practice',
    detail: 'Developed GSTGuard as a human-governed workflow that combines extraction, deterministic validation, RAG, and case review.',
  },
  {
    marker: '2026',
    title: 'Education and civic product exploration',
    detail: 'Built interface prototypes around interactive science learning and clearer public-transport grievance workflows.',
  },
  {
    marker: 'CURRENT',
    title: 'CSE studies and student community',
    detail: 'Studying Computer Science and Engineering at VAST while contributing to technical work connected with the VAST µLearn community.',
  },
  {
    marker: 'NOW',
    title: 'Learning by building',
    detail: 'Continuing to connect useful software, AI-assisted workflows, and thoughtful interface design through hands-on project work.',
  },
] as const

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug)
}
