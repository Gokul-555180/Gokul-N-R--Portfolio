import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, ArrowUpRight, Check, GitFork, Layers3 } from 'lucide-react'
import { notFound } from 'next/navigation'
import { ProjectArt } from '@/components/project-art'
import { getProject, projects } from '@/data/portfolio'

type ProjectPageProps = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return projects.map(({ slug }) => ({ slug }))
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params
  const project = getProject(slug)
  if (!project) return {}
  return { title: project.name, description: project.description }
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params
  const project = getProject(slug)
  if (!project) notFound()

  return <main className="project-page">
    <nav className="project-page__nav"><Link href="/#projects"><ArrowLeft size={17} /> Back to level select</Link><span>CASE FILE / {project.number}</span></nav>
    <article className="project-case site-container">
      <header className="project-case__hero">
        <div><p className="section-kicker">{project.number} / {project.category.toUpperCase()}</p><p className="case-status"><i /> {project.status} <span>·</span> {project.year}</p><h1>{project.name}</h1><p className="case-lede">{project.description}</p>{project.source && <a className="primary-button case-source" href={project.source} target="_blank" rel="noreferrer"><GitFork size={17} /> View source repository <ArrowUpRight size={17} /></a>}</div>
        <ProjectArt project={project} compact />
      </header>
      <div className="case-divider" />
      <section className="case-overview" aria-label="Project overview"><div><span>THE PROBLEM</span><p>{project.problem}</p></div><div><span>THE APPROACH</span><p>{project.solution}</p></div><div><span>MY CONTRIBUTION</span><p>{project.contribution}</p></div></section>
      <section className="case-section"><div><p className="section-kicker">BUILD NOTES</p><h2>What&apos;s in this level.</h2></div><ul className="case-highlights">{project.highlights.map((item) => <li key={item}><Check size={17} />{item}</li>)}</ul></section>
      <section className="case-section case-stack"><div><p className="section-kicker">TOOLKIT</p><h2>Built with<br /><em>intention.</em></h2></div><div className="case-stack__items">{project.stack.map((item, index) => <span key={item}><b>{String(index + 1).padStart(2, '0')}</b>{item}</span>)}</div></section>
      <aside className="case-honesty"><Layers3 size={20} /><p><strong>Scope note.</strong> This case file is deliberately specific about what is implemented, in progress, or dependent on configuration. It does not imply public deployment, adoption, or outcomes that are not verified.</p></aside>
      <div className="case-next"><Link href="/#projects">Return to all projects <ArrowLeft size={17} /></Link><Link href="/#contact">Start a conversation <ArrowUpRight size={17} /></Link></div>
    </article>
  </main>
}
