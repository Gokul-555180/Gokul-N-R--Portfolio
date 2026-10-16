import type { Project } from '@/data/portfolio'

type ProjectArtProps = {
  project: Pick<Project, 'artwork' | 'shortName' | 'number'>
  compact?: boolean
}

export function ProjectArt({ project, compact = false }: ProjectArtProps) {
  return (
    <div className={`project-art project-art--${project.artwork} ${compact ? 'project-art--compact' : ''}`} aria-label={`Illustrated interface preview for ${project.shortName}`}>
      <div className="project-art__grain" />
      <span className="project-art__serial">PROJECT / {project.number}</span>

      {project.artwork === 'invoice' && <div className="art-invoice">
        <div className="invoice-back" />
        <div className="invoice-sheet">
          <span className="invoice-logo">GSTGUARD</span>
          <i /><i /><i /><i /><i />
          <div className="invoice-verdict"><b>REVIEW</b><span>3 flags found</span></div>
        </div>
        <div className="invoice-inspector"><span>CASE / 0148</span><b>₹ 84,500</b><i /><i /><i /></div>
        <span className="art-tag">DOCUMENT REVIEW</span>
      </div>}

      {project.artwork === 'portal' && <div className="art-portal">
        <div className="portal-window">
          <div className="portal-top"><b>SAMADHAN</b><span>Track a complaint</span></div>
          <div className="portal-body"><div className="portal-stops"><i /><i /><i /><i /></div><div className="portal-route"><span>REPORT</span><b>→</b><span>DEPOT</span><b>→</b><span>TRACK</span></div><div className="portal-reference">REF / SMD-2084</div></div>
        </div>
        <div className="portal-ticket"><small>STATUS</small><b>In review</b><span>Assigned to depot</span></div>
        <span className="art-tag">PASSENGER FLOW</span>
      </div>}

      {project.artwork === 'lab' && <div className="art-lab">
        <div className="lab-window"><div className="lab-nav"><b>LabSphere</b><span>Physics / Ohm&apos;s law</span></div><div className="lab-work"><div className="lab-circuit"><i /><i /><i /><i /></div><div className="lab-chart"><span /><span /><span /><svg viewBox="0 0 100 52" aria-hidden="true"><polyline points="5,45 32,33 55,21 88,7" /></svg></div></div></div>
        <div className="lab-note"><span>V = I × R</span><b>Observation 05</b></div>
        <span className="art-tag">INTERACTIVE LAB</span>
      </div>}

      <span className="project-art__name">{project.shortName}</span>
    </div>
  )
}
