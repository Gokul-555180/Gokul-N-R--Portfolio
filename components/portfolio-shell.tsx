'use client'

import Link from 'next/link'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowDownRight, ArrowUpRight, GitFork, Mail, Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { journey, projects, site, skillGroups } from '@/data/portfolio'
import { DoodleArrow, DoodleCircle, DoodleConnection, DoodleRectangle, DoodleSpark, DoodleUnderline } from '@/components/editorial-doodles'
import { GitHubActivitySection } from '@/components/github-activity-section'
import { ProjectArt } from '@/components/project-art'

const navigation = [
  ['home', 'Home'],
  ['about', 'About'],
  ['projects', 'Projects'],
  ['skills', 'Skills'],
  ['journey', 'Journey'],
  ['github', 'GitHub'],
  ['contact', 'Contact'],
] as const

function Reveal({ children, className = '', delay = 0 }: { children: React.ReactNode, className?: string, delay?: number }) {
  const reduced = useReducedMotion()
  return <motion.div className={className} initial={false} whileInView={reduced ? undefined : { opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.18 }} transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}>{children}</motion.div>
}

function Navigation() {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('home')
  const reduced = useReducedMotion()
  useEffect(() => {
    const sections = navigation.map(([id]) => document.getElementById(id)).filter((section): section is HTMLElement => Boolean(section))
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
      if (visible) setActive(visible.target.id)
    }, { rootMargin: '-24% 0px -62% 0px', threshold: [0.08, 0.28, 0.55] })
    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])
  return <header className="editorial-nav">
    <a className="wordmark" href="#home">GOKUL N. R.<i /></a>
    <nav className="desktop-nav" aria-label="Primary navigation">
      {navigation.map(([id, label], index) => <a key={id} href={`#${id}`} className={active === id ? 'is-active' : undefined} aria-current={active === id ? 'page' : undefined}><small>{String(index + 1).padStart(2, '0')}.</small> {label}</a>)}
    </nav>
    <span className="nav-note">CSE STUDENT <ArrowDownRight size={16} /></span>
    <button className="menu-button" onClick={() => setOpen((isOpen) => !isOpen)} aria-expanded={open} aria-controls="mobile-navigation"><span className="menu-button__label">{open ? 'Close' : 'Menu'}</span><AnimatePresence initial={false} mode="wait"><motion.span key={open ? 'close' : 'menu'} className="menu-button__icon" initial={reduced ? false : { opacity: 0, rotate: -45, scale: .72 }} animate={reduced ? undefined : { opacity: 1, rotate: 0, scale: 1 }} exit={reduced ? undefined : { opacity: 0, rotate: 45, scale: .72 }} transition={{ duration: .16, ease: [0.22, 1, 0.36, 1] }}>{open ? <X size={18} /> : <Menu size={19} />}</motion.span></AnimatePresence></button>
    <AnimatePresence initial={false}>
      {open && <motion.nav id="mobile-navigation" className="mobile-nav" aria-label="Mobile navigation" initial={reduced ? false : { opacity: 0, y: -10, clipPath: 'inset(0 0 100% 0)' }} animate={reduced ? undefined : { opacity: 1, y: 0, clipPath: 'inset(0 0 0% 0)' }} exit={reduced ? undefined : { opacity: 0, y: -8, clipPath: 'inset(0 0 100% 0)' }} transition={{ duration: .26, ease: [0.22, 1, 0.36, 1] }}>
        {navigation.map(([id, label], index) => <motion.a key={id} href={`#${id}`} onClick={() => setOpen(false)} aria-current={active === id ? 'page' : undefined} initial={reduced ? false : { opacity: 0, x: -7 }} animate={reduced ? undefined : { opacity: 1, x: 0 }} transition={{ duration: .22, delay: reduced ? 0 : .035 + index * .025, ease: [0.22, 1, 0.36, 1] }}>{label}<ArrowDownRight size={17} /></motion.a>)}
      </motion.nav>}
    </AnimatePresence>
  </header>
}

function Hero() {
  const reduced = useReducedMotion()
  return <section id="home" className="hero-panel panel" aria-labelledby="hero-heading">
    <Navigation />
    <div className="hero-grid">
      <motion.div className="hero-copy" initial={false} animate={reduced ? undefined : { y: 0 }} transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}>
        <p className="eyebrow hero-index">01 / HELLO</p>
        <h1 id="hero-heading"><span>Hey, I&apos;m</span><strong>Gokul.</strong></h1>
        <div className="hero-introduction"><p className="hero-mantra">BUILD<br />LEARN<br />IMPROVE<br />REPEAT</p><div><p className="hero-lede">Hey, I&apos;m Gokul. I build useful software, explore AI, and turn real-world problems into practical digital experiences.</p><div className="hero-actions"><a className="button button--ink" href="#projects">View projects <ArrowDownRight size={17} /></a><a className="button button--paper" href="#contact">Get in touch <ArrowDownRight size={17} /></a></div></div></div>
        <div className="hero-facts"><span>{site.role}</span><i /><span>{site.school}</span></div>
      </motion.div>
      <motion.figure className="hero-scene hero-scene--static" initial={false} animate={reduced ? undefined : { opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}>
        <img className="hero-workstation" src="/images/gokul-retro-workstation.webp" width="1280" height="853" alt="A retro developer workstation with a CRT monitor, keyboard, books, notebook, mouse, and desk tools." />
        <figcaption className="scene-caption">SOFTWARE / AI / INTERFACES</figcaption>
      </motion.figure>
      <aside className="hero-side-note"><span>DEVELOPER<br />AI EXPLORER<br />PROBLEM SOLVER<br />CSE @ VAST</span></aside>
      <div className="hero-wedge" aria-hidden="true" />
    </div>
  </section>
}

function SectionHeading({ number, title, children }: { number: string, title: React.ReactNode, children?: React.ReactNode }) {
  return <div className="section-heading"><div><p className="eyebrow">{number}</p><h2>{title}</h2></div>{children && <div className="section-heading__copy">{children}</div>}</div>
}

function WorkSection() {
  return <section id="projects" className="panel work-panel" aria-labelledby="work-heading">
    <Reveal><SectionHeading number="02 / SELECTED WORK" title={<><em>Selected</em><br />work.</>}><p>A collection of projects built to solve real problems, explore ideas, and put technology to practical use.</p></SectionHeading></Reveal>
    <div className="section-kicker"><p>Three project case studies, each documented from the actual repository.</p><DoodleUnderline /></div>
    <div className="project-grid">
      {projects.map((project, index) => <Reveal key={project.slug} delay={index * 0.07}>
        <article className="editorial-project">
          <ProjectArt project={project} />
          <div className="editorial-project__body"><div className="project-meta"><span>{project.number} / {project.category}</span><span>{project.year}</span></div><h3>{project.name}</h3><p>{project.description}</p><div className="project-actions"><Link href={`/projects/${project.slug}`} className="text-link">Case study <ArrowUpRight size={16} /></Link><a href={project.source} className="text-link" target="_blank" rel="noreferrer">Repository <GitFork size={15} /></a></div></div>
        </article>
      </Reveal>)}
    </div>
    <div className="work-closing"><DoodleCircle /><p>Three problems. Three approaches to useful software.</p></div>
  </section>
}

function AboutSection() {
  return <section id="about" className="panel about-panel" aria-labelledby="about-heading">
    <Reveal><SectionHeading number="03 / ABOUT" title={<><em>About</em><br />the work.</>} /></Reveal>
    <div className="about-grid">
      <Reveal className="about-copy"><p className="lead-copy">I&apos;m Gokul N. R., a Computer Science and Engineering student at Vidya Academy of Science and Technology.</p><p>I enjoy taking practical problems beyond the idea stage—connecting reliable systems, AI integration, and thoughtful interfaces so the result is easier for people to understand and use.</p><ol className="about-principles"><li><span>01</span><p><b>Useful by default.</b> Build around a real need, not just a feature list.</p></li><li><span>02</span><p><b>Thoughtful by design.</b> Make complex workflows clearer to navigate and review.</p></li><li><span>03</span><p><b>Always iterating.</b> Learn through implementation, feedback, and refinement.</p></li></ol><div className="about-actions"><a className="text-link" href={site.github} target="_blank" rel="noreferrer">Visit GitHub <ArrowUpRight size={17} /></a></div></Reveal>
      <Reveal className="about-composition"><div className="about-arch" /><div className="about-orbit" /><div className="about-rules"><i /><i /><i /></div><div className="about-paper"><span>THE PRACTICE</span><b>Useful<br />software,<br /><em>carefully</em><br />made.</b><small>VAST / CSE</small></div><div className="about-note">DESIGN<br />+<br />ENGINEERING</div><div className="about-map" aria-hidden="true"><span>DOCUMENTS</span><span>SYSTEMS</span><span>EXPERIENCES</span></div><p className="about-caption">SOFTWARE, AI &amp; INTERFACES<br />WITH INTENT.</p><DoodleConnection className="about-connection" /><DoodleRectangle className="about-rectangle" /><DoodleSpark className="about-doodle" /></Reveal>
    </div>
  </section>
}

function SkillsSection() {
  const [active, setActive] = useState(0)
  const reduced = useReducedMotion()
  const selected = skillGroups[active]
  const selectSkill = (next: number) => {
    const index = (next + skillGroups.length) % skillGroups.length
    setActive(index)
    document.getElementById(`skill-tab-${index}`)?.focus()
  }
  return <section id="skills" className="panel skills-panel" aria-labelledby="skills-heading">
    <Reveal><SectionHeading number="04 / SKILLS" title={<><em>Skills</em> &<br />tools.</>}><p>Technologies documented in public project work or actively explored. No rating bars—just useful context.</p></SectionHeading></Reveal>
    <div className="skills-explorer"><div className="skills-tabs" role="tablist" aria-label="Technology categories">{skillGroups.map((group, index) => <button id={`skill-tab-${index}`} key={group.title} role="tab" aria-selected={active === index} aria-controls="skills-panel-content" tabIndex={active === index ? 0 : -1} onClick={() => setActive(index)} onKeyDown={(event) => { if (event.key === 'ArrowDown' || event.key === 'ArrowRight') { event.preventDefault(); selectSkill(index + 1) } if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') { event.preventDefault(); selectSkill(index - 1) } }}><span>0{index + 1}</span>{group.title}<ArrowDownRight size={15} /></button>)}</div><AnimatePresence initial={false} mode="wait"><motion.div id="skills-panel-content" key={selected.title} className="skills-panel-content" role="tabpanel" aria-labelledby={`skill-tab-${active}`} initial={reduced ? false : { opacity: 0, y: 9 }} animate={reduced ? undefined : { opacity: 1, y: 0 }} exit={reduced ? undefined : { opacity: 0, y: -6 }} transition={{ duration: .26, ease: [0.22, 1, 0.36, 1] }}><div className="skills-copy"><p className="eyebrow">0{active + 1} / {selected.title}</p><h3>{selected.title}</h3><p>{selected.detail}</p><div className="skill-pills">{selected.items.map((item, index) => <motion.span key={item} initial={reduced ? false : { opacity: 0, y: 5 }} animate={reduced ? undefined : { opacity: 1, y: 0 }} transition={{ duration: .2, delay: reduced ? 0 : .07 + index * .035, ease: [0.22, 1, 0.36, 1] }}>{item}</motion.span>)}</div><Link className="skills-evidence" href={`/projects/${selected.evidence.slug}`}>Seen in {selected.evidence.label} <ArrowUpRight size={15} /></Link></div><SkillSchematic /></motion.div></AnimatePresence></div>
  </section>
}

function SkillSchematic() {
  return <div className="skills-schematic" aria-hidden="true"><span>HOW I THINK ABOUT THE WORK</span><svg viewBox="0 0 330 105" fill="none"><path d="M45 53h104M181 53h104M148 53l11-9m-11 9 11 9m126 0 11-9m-11 9 11 9" /><circle cx="45" cy="53" r="8" /><circle cx="165" cy="53" r="8" /><circle cx="285" cy="53" r="8" /></svg><div><b>INTERFACE</b><b>APPLICATION LOGIC</b><b>DATA</b></div></div>
}

function JourneySection() {
  return <section id="journey" className="panel journey-panel" aria-labelledby="journey-heading">
    <Reveal><SectionHeading number="05 / JOURNEY" title={<><em>In</em><br />progress.</>}><p>A few grounded milestones from the ongoing route—kept factual, concise, and open-ended.</p></SectionHeading></Reveal>
    <div className="journey-intro"><p>A compact log of studies, community, and project work.</p><span>ONGOING / OPEN TO WHAT&apos;S NEXT</span></div>
    <div id="journey-log" className="journey-list">
      <DoodleConnection className="journey-connector" />
      {journey.map((entry, index) => <Reveal key={entry.title} delay={index * 0.08}><article className="journey-entry"><span>{entry.marker}</span><div><h3>{entry.title}</h3><p>{entry.detail}</p></div><b>{String(index + 1).padStart(2, '0')}</b></article></Reveal>)}
    </div>
  </section>
}

function ContactSection() {
  return <section id="contact" className="panel contact-panel" aria-labelledby="contact-heading">
    <Reveal><SectionHeading number="07 / CONTACT" title={<><em>Let&apos;s</em><br />talk.</>} /></Reveal>
    <div className="contact-grid"><Reveal className="contact-invitation"><p className="contact-copy">Have a software project, collaboration, or opportunity in mind? I&apos;d be glad to hear about it.</p><p className="contact-note">CURRENT FOCUS / USEFUL SOFTWARE, AI-ASSISTED WORKFLOWS &amp; THOUGHTFUL INTERFACES</p><DoodleArrow className="contact-doodle" /></Reveal><Reveal className={`contact-links${site.linkedin ? '' : ' contact-links--two'}`}><a href={`mailto:${site.email}`}><Mail size={18} /><span>Email</span><ArrowUpRight size={16} /></a><a href={site.github} target="_blank" rel="noreferrer"><GitFork size={18} /><span>GitHub</span><ArrowUpRight size={16} /></a>{site.linkedin && <a href={site.linkedin} target="_blank" rel="noreferrer"><span aria-hidden="true">in</span><span>LinkedIn</span><ArrowUpRight size={16} /></a>}</Reveal></div>
    <footer className="footer"><span>© {new Date().getFullYear()} {site.name}</span><span>Built with a focus on useful things.</span></footer>
  </section>
}

export function PortfolioShell() {
  return <div className="portfolio-page"><span className="margin-letter margin-letter--one" aria-hidden="true">G</span><span className="margin-letter margin-letter--two" aria-hidden="true">R</span><span className="margin-slab" aria-hidden="true" /><a className="skip-link" href="#main-content">Skip to content</a><main id="main-content" className="portfolio-column"><Hero /><WorkSection /><AboutSection /><SkillsSection /><JourneySection /><GitHubActivitySection /><ContactSection /></main></div>
}
