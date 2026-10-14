import type { Project } from '@/data/portfolio'

type ProjectArtProps = {
  project: Pick<Project, 'accent' | 'artwork' | 'shortName' | 'number'>
  compact?: boolean
}

export function ProjectArt({ project, compact = false }: ProjectArtProps) {
  return (
    <div className={`project-art project-art--${project.accent} ${compact ? 'project-art--compact' : ''}`} aria-hidden="true">
      <div className="project-art__grid" />
      <span className="project-art__serial">LVL / {project.number}</span>

      {project.artwork === 'ledger' && <>
        <span className="ledger-sheet ledger-sheet--back" />
        <span className="ledger-sheet ledger-sheet--front"><i /><i /><i /><b>GST</b></span>
        <span className="ledger-scan" />
        <span className="project-art__tag">RECONCILE</span>
      </>}

      {project.artwork === 'moderation' && <>
        <span className="moderation-ring moderation-ring--one" />
        <span className="moderation-ring moderation-ring--two" />
        <span className="moderation-core">XP</span>
        <span className="moderation-node moderation-node--one" />
        <span className="moderation-node moderation-node--two" />
        <span className="project-art__tag">LIVE SCORE</span>
      </>}

      {project.artwork === 'route' && <>
        <span className="route-line"><i /><i /><i /><i /></span>
        <span className="route-bus">● ●</span>
        <span className="project-art__tag">CASE ROUTED</span>
      </>}

      <span className="project-art__name">{project.shortName}</span>
    </div>
  )
}
