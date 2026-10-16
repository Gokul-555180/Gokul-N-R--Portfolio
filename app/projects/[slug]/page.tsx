import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, ArrowUpRight, Check, ExternalLink, GitFork } from 'lucide-react'
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
  return project ? { title: project.name, description: project.description } : {}
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params
  const project = getProject(slug)
  if (!project) notFound()

  return <main className="case-page">
    <nav className="case-nav"><Link href="/#projects"><ArrowLeft size={17} /> Selected work</Link><span>CASE STUDY / {project.number}</span></nav>
    <article className="case-panel">
      <header className="case-hero"><div><p className="eyebrow">{project.number} / {project.category}</p><h1>{project.name}</h1><p>{project.description}</p><div className="case-actions"><a className="button button--ink" href={project.source} target="_blank" rel="noreferrer"><GitFork size={17} /> Repository <ArrowUpRight size={16} /></a>{project.demo && <a className="button button--paper" href={project.demo} target="_blank" rel="noreferrer"><ExternalLink size={16} /> Live demo</a>}</div></div><ProjectArt project={project} compact /></header>
      <div className="case-rule" />
      <section className="case-overview" aria-label="Project overview"><article><span>THE PROBLEM</span><p>{project.problem}</p></article><article><span>THE APPROACH</span><p>{project.approach}</p></article><article><span>MY CONTRIBUTION</span><p>{project.contribution}</p></article></section>
      <section className="case-details case-details--implemented"><div><p className="eyebrow">BUILD NOTES</p><h2>What&apos;s implemented.</h2></div><ol className="case-implementation-list">{project.highlights.map((highlight, index) => <li key={highlight}><span>{String(index + 1).padStart(2, '0')}</span><Check size={18} /><p>{highlight}</p></li>)}</ol></section>
      <section className="case-details case-stack"><div><p className="eyebrow">TECHNOLOGY</p><h2>Tools in the <em>build.</em></h2></div><div className="case-stack__items">{project.stack.map((item, index) => <span key={item}><b>{String(index + 1).padStart(2, '0')}</b>{item}</span>)}</div></section>
      <aside className="case-note"><p><strong>Scope note.</strong> {project.limitations}</p></aside>
      <div className="case-footer"><Link href="/#projects"><ArrowLeft size={17} /> Back to work</Link><Link href="/#contact">Start a conversation <ArrowUpRight size={17} /></Link></div>
    </article>
  </main>
}
