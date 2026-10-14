'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import {
  ArrowDownRight,
  ArrowUpRight,
  Box,
  ChevronRight,
  Code2,
  Compass,
  GitFork,
  Mail,
  Menu,
  MousePointer2,
  RotateCcw,
  X,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { currentDesk, journey, projects, site, skillGroups } from '@/data/portfolio'
import { ProjectArt } from '@/components/project-art'
import { BlockBlaster } from '@/components/block-blaster'

const WorldScene = dynamic(() => import('@/components/world-scene'), {
  ssr: false,
  loading: () => <div className="grid h-full place-items-center bg-[radial-gradient(circle_at_55%_52%,#393c64_0%,#171a2b_68%)] text-6xl text-[var(--lavender)]">⌂</div>,
})

const MiniScene = dynamic(() => import('@/components/mini-scene'), {
  ssr: false,
  loading: () => <div className="mini-scene__loading">○</div>,
})

const sections = [
  ['world', 'World'],
  ['about', 'About'],
  ['projects', 'Projects'],
  ['skills', 'Skills'],
  ['journey', 'Journey'],
  ['contact', 'Contact'],
] as const

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function BootSequence({ onComplete }: { onComplete: () => void }) {
  const shouldReduce = useReducedMotion()
  const [stage, setStage] = useState(0)

  useEffect(() => {
    if (shouldReduce) { onComplete(); return }
    const steps = [
      window.setTimeout(() => setStage(1), 260),
      window.setTimeout(() => setStage(2), 700),
      window.setTimeout(onComplete, 1450),
    ]
    return () => steps.forEach(window.clearTimeout)
  }, [onComplete, shouldReduce])

  return <motion.div className="boot-screen" initial={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: .28 } }}>
    <button className="boot-skip" onClick={onComplete}>Skip intro <ArrowUpRight size={14} /></button>
    <div className="boot-console" aria-live="polite">
      <p className="boot-eyebrow">SYSTEM / PORTFOLIO_OS</p>
      <p className="boot-title">GOKUL.EXE</p>
      <div className="boot-lines">
        <p>INITIALIZING CREATIVE MODE... <span>✓</span></p>
        {stage >= 1 && <p>LOADING PROJECT ARCHIVE... <span>✓</span></p>}
        {stage >= 2 && <p className="text-[var(--peach)]">WELCOME TO MY WORLD.</p>}
      </div>
    </div>
  </motion.div>
}

function Header({ quickView, setQuickView }: { quickView: boolean, setQuickView: (value: boolean) => void }) {
  const [open, setOpen] = useState(false)
  const navigate = (id: string) => { scrollTo(id); setOpen(false) }

  return <header className="site-header">
    <button className="brand" onClick={() => navigate('world')} aria-label="Return to the beginning">GOKUL<span>.EXE</span></button>
    <nav className="desktop-nav" aria-label="Primary navigation">
      {sections.map(([id, label]) => <button key={id} onClick={() => navigate(id)}>{label}</button>)}
    </nav>
    <div className="header-actions">
      <button className="view-switch" onClick={() => setQuickView(!quickView)} aria-pressed={quickView}>
        <span className={quickView ? 'bg-[var(--sky)]' : ''} /> {quickView ? 'Explore' : 'Quick view'}
      </button>
      <button className="mobile-menu" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="mobile-navigation">
        {open ? <X size={20} /> : <Menu size={21} />}<span className="sr-only">Toggle navigation</span>
      </button>
    </div>
    <AnimatePresence>{open && <motion.nav id="mobile-navigation" className="mobile-navigation" initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -14 }} aria-label="Mobile navigation">
      {sections.map(([id, label]) => <button key={id} onClick={() => navigate(id)}>{label}<ArrowDownRight size={17} /></button>)}
    </motion.nav>}</AnimatePresence>
  </header>
}

function Hero({ quickView }: { quickView: boolean }) {
  const shouldReduce = useReducedMotion()
  const [resetKey, setResetKey] = useState(0)
  const selectStation = (id: 'projects' | 'about' | 'contact') => scrollTo(id)

  return <section id="world" className={`hero-section ${quickView ? 'hero-section--quick' : ''}`} aria-labelledby="hero-heading">
    <div className="hero-stage" aria-hidden="true">
      <WorldScene onStationSelect={selectStation} resetKey={resetKey} />
    </div>
    <div className="hero-shade" aria-hidden="true" />
    <div className="site-container hero-layout">
      <motion.div className="hero-copy" initial={shouldReduce ? false : { opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .65, delay: .18 }}>
        <p className="eyebrow"><span className="live-dot" /> OPEN TO THE NEXT QUEST</p>
        <h1 id="hero-heading">Hey, I&apos;m <em>Gokul.</em></h1>
        <p className="hero-lede">I build thoughtful digital experiences at the intersection of software, AI and design.</p>
        <p className="hero-caption">Computer Science Engineering <i /> Developer <i /> UI/UX Enthusiast</p>
        <div className="hero-cta">
          <button className="primary-button" onClick={() => scrollTo('about')}>Explore my world <ArrowDownRight size={18} /></button>
          <button className="secondary-button" onClick={() => scrollTo('projects')}>View my projects <ChevronRight size={18} /></button>
        </div>
      </motion.div>
      <div className="hero-controls">
        {!quickView && <div className="scene-hint"><MousePointer2 size={14} /><span>DRAG TO EXPLORE · SELECT A BEACON</span></div>}
        <button className="reset-scene" onClick={() => setResetKey((key) => key + 1)}><RotateCcw size={14} /> Reset view</button>
      </div>
    </div>
    <button className="hero-contact" onClick={() => scrollTo('contact')}>Get in touch <ArrowDownRight size={16} /></button>
  </section>
}

function Reveal({ children, className = '' }: { children: React.ReactNode, className?: string }) {
  const shouldReduce = useReducedMotion()
  return <motion.div className={className} initial={shouldReduce ? false : { opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .2 }} transition={{ duration: .58, ease: [0.22, 1, 0.36, 1] }}>
    {children}
  </motion.div>
}

function AboutSection() {
  return <section id="about" className="section section-light about-section" aria-labelledby="about-heading">
    <div className="site-container two-col">
      <Reveal><p className="section-kicker">01 / PLAYER PROFILE</p><h2 id="about-heading">A curious builder<br />with a practical streak.</h2></Reveal>
      <Reveal className="about-copy">
        <p className="about-lede">I&apos;m {site.name}, a {site.role} at {site.school}. I like making complex, everyday tasks feel calmer, clearer, and more approachable.</p>
        <p>I&apos;m interested in useful software, AI-assisted experiences, polished interfaces, and the small design decisions that help a product make sense from the first click.</p>
        <a className="inline-link" href={site.github} target="_blank" rel="noreferrer">Visit my GitHub <ArrowUpRight size={16} /></a>
      </Reveal>
    </div>
    <Reveal className="site-container profile-layout">
      <article className="profile-card">
        <div className="profile-card__top"><span className="pixel-text">PROFILE UNLOCKED</span><span>LVL 01</span></div>
        <div className="profile-card__stamp"><Box size={30} strokeWidth={1.5} /></div>
        <h3>Gokul N. R.</h3>
        <p>{site.role}<br />{site.school}</p>
        <div className="profile-tags"><span>Useful software</span><span>AI experiences</span><span>Interface design</span><span>Problem-solving</span></div>
        <div className="profile-card__bottom"><span>STATUS: BUILDING</span><span>KERALA, INDIA</span></div>
      </article>
    </Reveal>
  </section>
}

function ProjectSection() {
  return <section id="projects" className="section projects-section" aria-labelledby="projects-heading">
    <div className="site-container project-heading">
      <Reveal><p className="section-kicker">02 / LEVEL SELECT</p><h2 id="projects-heading">Choose your<br /><em>next level.</em></h2></Reveal>
      <Reveal><p>Selected project records with their real scope left intact. Open a case file for the problem, solution, contribution, and technical notes.</p></Reveal>
    </div>
    <div className="site-container project-grid">
      {projects.map((project, index) => <Reveal key={project.slug} className="project-card-wrap">
        <article className="project-card" style={{ transitionDelay: `${index * 60}ms` }}>
          <ProjectArt project={project} />
          <div className="project-card__body">
            <div className="project-card__meta"><span>{project.category}</span><span>{project.status}</span></div>
            <h3>{project.name}</h3>
            <p>{project.description}</p>
            <div className="tech-row">{project.stack.slice(0, 3).map((item) => <span key={item}>{item}</span>)}</div>
            <Link className="project-link" href={`/projects/${project.slug}`}>Open case file <ArrowUpRight size={17} /></Link>
          </div>
        </article>
      </Reveal>)}
    </div>
    <div className="site-container archive-note"><Code2 size={17} /><p>More experiments are in the workshop. The main archive only shows work I can describe responsibly today.</p></div>
  </section>
}

function SkillsSection() {
  const [active, setActive] = useState(0)
  const selected = skillGroups[active]
  return <section id="skills" className="section skills-section" aria-labelledby="skills-heading">
    <div className="site-container two-col skills-heading">
      <Reveal><p className="section-kicker">03 / INVENTORY</p><h2 id="skills-heading">Things I&apos;ve put<br />in the <em>toolbelt.</em></h2></Reveal>
      <Reveal><p>Technology here means used, studied, or actively explored. No arbitrary percentage bars—just a practical map of the tools behind the work.</p></Reveal>
    </div>
    <Reveal className="site-container inventory-shell">
      <div className="inventory-tabs" role="tablist" aria-label="Skill inventory categories">
        {skillGroups.map((group, index) => <button role="tab" aria-selected={index === active} key={group.id} onClick={() => setActive(index)}><span>{group.code}</span><strong>{group.label}</strong><ChevronRight size={17} /></button>)}
      </div>
      <div className="inventory-panel" role="tabpanel">
        <p className="pixel-text">{selected.code} / {selected.label}</p>
        <p className="inventory-summary">{selected.summary}</p>
        <div className="skill-cards">{selected.items.map((item, index) => <motion.span key={item} initial={{ opacity: 0, scale: .92 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: index * .045 }}>{item}</motion.span>)}</div>
        <p className="inventory-hint">Choose a shelf to browse the collection.</p>
      </div>
    </Reveal>
  </section>
}

function JourneySection() {
  return <section id="journey" className="section journey-section" aria-labelledby="journey-heading">
    <div className="site-container"><Reveal><p className="section-kicker">04 / QUEST LOG</p><h2 id="journey-heading">The route so far.</h2></Reveal>
      <div className="quest-list">{journey.map((entry, index) => <Reveal key={entry.title}><article className="quest-entry"><span className="quest-number">{String(index + 1).padStart(2, '0')}</span><span className="quest-marker">{entry.marker}</span><div><h3>{entry.title}</h3><p>{entry.detail}</p></div></article></Reveal>)}</div>
    </div>
  </section>
}

function DeskSection() {
  return <section className="section desk-section" aria-labelledby="desk-heading">
    <div className="site-container desk-layout"><Reveal><p className="section-kicker">05 / SAVE POINT</p><h2 id="desk-heading">Currently at<br />the <em>desk.</em></h2></Reveal>
      <Reveal><article className="terminal-card"><div className="terminal-card__bar"><span /><span /><span /><p>gokul@workstation: ~/now</p></div><div className="terminal-card__body"><p><i>$</i> currently-building</p><strong>{currentDesk.building}</strong><p><i>$</i> currently-learning</p><strong>{currentDesk.learning}</strong><small>// {currentDesk.note}</small></div></article></Reveal>
    </div>
  </section>
}

function ContactSection() {
  return <section id="contact" className="section contact-section" aria-labelledby="contact-heading">
    <div className="site-container contact-layout"><Reveal><p className="section-kicker">06 / FINAL LEVEL</p><h2 id="contact-heading">Every good adventure<br />starts <em>somewhere.</em></h2><p className="contact-copy">Have an interesting idea, a project to build, or an opportunity to discuss? Let&apos;s talk.</p></Reveal>
      <Reveal><div className="contact-console"><div className="mini-scene mini-scene--portal" aria-hidden="true"><MiniScene variant="portal" /></div><a href={`mailto:${site.email}`}><Mail size={19} /><span>{site.email}</span><ArrowUpRight size={17} /></a><a href={site.github} target="_blank" rel="noreferrer"><GitFork size={19} /><span>GitHub / Gokul-555180</span><ArrowUpRight size={17} /></a><p className="pixel-text">CONNECTION READY</p></div></Reveal>
    </div>
  </section>
}

export function PortfolioShell() {
  const [intro, setIntro] = useState(false)
  const [quickView, setQuickView] = useState(false)

  useEffect(() => setIntro(!sessionStorage.getItem('gokul-exe-visited')), [])
  const endIntro = () => { sessionStorage.setItem('gokul-exe-visited', 'true'); setIntro(false) }

  return <>
    <a className="skip-link" href="#main-content">Skip to content</a>
    <AnimatePresence>{intro && <BootSequence onComplete={endIntro} />}</AnimatePresence>
    <Header quickView={quickView} setQuickView={setQuickView} />
    <main id="main-content">
      <Hero quickView={quickView} />
      <BlockBlaster />
      <AboutSection />
      <ProjectSection />
      <SkillsSection />
      <JourneySection />
      <DeskSection />
      <ContactSection />
    </main>
    <footer className="site-footer"><div className="site-container"><span>© {new Date().getFullYear()} {site.name}</span><button onClick={() => { sessionStorage.removeItem('gokul-exe-visited'); scrollTo('world') }}><Compass size={14} /> Reboot world</button><span>Made with curiosity</span></div></footer>
  </>
}
