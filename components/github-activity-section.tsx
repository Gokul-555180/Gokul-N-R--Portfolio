'use client'

import { ArrowUpRight, GitFork, Star } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { site } from '@/data/portfolio'

type ContributionDay = {
  date: string
  count: number | null
  level: number | null
}

type ContributionPayload = {
  from: string
  to: string
  total: number | null
  complete: boolean
  source: 'github_graphql' | 'github_public_calendar' | 'unavailable'
  days: ContributionDay[]
}

type Repository = {
  name: string
  fullName: string
  htmlUrl: string
  description: string | null
  language: string | null
  stars: number
  updatedAt: string
}

type LanguageSlice = {
  name: string
  bytes: number
  percent: number
}

type GithubResponse = {
  available: boolean
  username: string
  profileUrl: string
  contributions: ContributionPayload
  repositories: Repository[]
  languages: LanguageSlice[]
}

type CalendarCell = ContributionDay & {
  inRange: boolean
  week: number
  weekday: number
}

const DAY = 24 * 60 * 60 * 1000
const dateFormatter = new Intl.DateTimeFormat('en', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' })
const shortDateFormatter = new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' })
const monthFormatter = new Intl.DateTimeFormat('en', { month: 'short', timeZone: 'UTC' })

function dateFromString(value: string) {
  return new Date(`${value}T00:00:00Z`)
}

function contributionLabel(day: ContributionDay) {
  const date = dateFormatter.format(dateFromString(day.date))
  if (day.count === null) return `${date} — activity data unavailable`
  return `${date} — ${day.count} contribution${day.count === 1 ? '' : 's'}`
}

function buildCalendar(contributions: ContributionPayload) {
  const dates = new Map(contributions.days.map((day) => [day.date, day]))
  const from = dateFromString(contributions.from)
  const to = dateFromString(contributions.to)
  const start = new Date(from)
  start.setUTCDate(start.getUTCDate() - start.getUTCDay())
  const end = new Date(to)
  end.setUTCDate(end.getUTCDate() + (6 - end.getUTCDay()))
  const cells: CalendarCell[] = []
  const monthMarkers = new Map<number, string>()

  for (let day = new Date(start), index = 0; day <= end; day.setUTCDate(day.getUTCDate() + 1), index += 1) {
    const date = day.toISOString().slice(0, 10)
    const inRange = day >= from && day <= to
    const contribution = dates.get(date) ?? { date, count: null, level: null }
    const week = Math.floor(index / 7)
    const weekday = day.getUTCDay()
    cells.push({ ...contribution, inRange, week, weekday })

    if (inRange && (date === contributions.from || day.getUTCDate() === 1) && !monthMarkers.has(week)) {
      monthMarkers.set(week, monthFormatter.format(day))
    }
  }

  return { cells, monthMarkers, weeks: Math.ceil(cells.length / 7) }
}

function formatRange(contributions: ContributionPayload) {
  return `${shortDateFormatter.format(dateFromString(contributions.from))} — ${shortDateFormatter.format(dateFromString(contributions.to))}`
}

function formatUpdated(value: string) {
  return `Updated ${shortDateFormatter.format(new Date(value))}`
}

function ContributionMap({ contributions }: { contributions: ContributionPayload }) {
  const { cells, monthMarkers, weeks } = useMemo(() => buildCalendar(contributions), [contributions])
  const [activeDay, setActiveDay] = useState<ContributionDay | null>(null)

  return <>
    <div className="github-map-shell">
      <div className="github-map-scroll" tabIndex={0} aria-label="GitHub contribution calendar. Scroll horizontally to inspect dates on smaller screens.">
        <div className="github-map-inner">
          <div className="github-month-row" style={{ gridTemplateColumns: `repeat(${weeks}, 11px)` }} aria-hidden="true">
            {Array.from(monthMarkers.entries()).map(([week, month]) => <span key={`${week}-${month}`} style={{ gridColumn: week + 1 }}>{month}</span>)}
          </div>
          <div className="github-map-body">
            <div className="github-weekdays" aria-hidden="true"><span>Mon</span><span>Wed</span><span>Fri</span></div>
            <div className="github-cells" style={{ gridTemplateColumns: `repeat(${weeks}, 11px)` }}>
              {cells.map((day) => day.inRange ? <button key={day.date} type="button" className={`github-cell github-cell--${day.level ?? 'unknown'}`} style={{ gridColumn: day.week + 1, gridRow: day.weekday + 1 }} aria-label={contributionLabel(day)} onFocus={() => setActiveDay(day)} onMouseEnter={() => setActiveDay(day)} onMouseLeave={() => setActiveDay(null)} /> : <span key={day.date} className="github-cell github-cell--outside" style={{ gridColumn: day.week + 1, gridRow: day.weekday + 1 }} aria-hidden="true" />)}
            </div>
          </div>
        </div>
      </div>
    </div>
    <p className="github-tooltip" role="status" aria-live="polite">{activeDay ? contributionLabel(activeDay) : 'Hover or focus a day for its exact public contribution count.'}</p>
  </>
}

function RepositoryList({ repositories }: { repositories: Repository[] }) {
  if (!repositories.length) return <p className="github-empty">Repository details are temporarily unavailable. The project links above remain available.</p>

  return <div className="github-repositories">
    {repositories.map((repository, index) => <a key={repository.fullName} href={repository.htmlUrl} target="_blank" rel="noreferrer" className="github-repository">
      <span className="github-repository__number">{String(index + 1).padStart(2, '0')}</span>
      <div className="github-repository__content"><div className="github-repository__title"><b>{repository.name}</b><small>{repository.language ?? 'Language not listed'}</small></div>{repository.description && <p>{repository.description}</p>}<span className="github-repository__metadata"><Star size={12} aria-hidden="true" /> {repository.stars} {repository.stars === 1 ? 'star' : 'stars'} <i /> {formatUpdated(repository.updatedAt)}</span></div>
      <ArrowUpRight size={17} aria-hidden="true" />
    </a>)}
  </div>
}

function LanguageMix({ languages }: { languages: LanguageSlice[] }) {
  if (!languages.length) return null
  return <aside className="github-languages" aria-label="Language distribution across listed repositories"><p className="eyebrow">SELECTED REPOSITORY CODE MIX</p><div className="github-language-bar" aria-hidden="true">{languages.map((language, index) => <i key={language.name} className={`github-language-bar__${index + 1}`} style={{ width: `${language.percent}%` }} />)}</div><div className="github-language-list">{languages.map((language) => <span key={language.name}><b>{language.name}</b><small>{language.percent}% of bytes</small></span>)}</div><p className="github-languages__note">A code-byte mix across the listed repositories—not a measure of proficiency.</p></aside>
}

export function GitHubActivitySection() {
  const [data, setData] = useState<GithubResponse | null>(null)
  const [status, setStatus] = useState<'loading' | 'error'>('loading')

  useEffect(() => {
    const controller = new AbortController()
    fetch('/api/github', { signal: controller.signal })
      .then(async (response) => {
        const payload = await response.json() as GithubResponse
        if (!response.ok || !payload.available) throw new Error('GitHub data is unavailable')
        setData(payload)
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'AbortError') return
        setStatus('error')
      })

    return () => controller.abort()
  }, [])

  const total = data?.contributions.total
  const hasCalendar = data?.contributions.source !== 'unavailable'

  return <section id="github" className="panel github-panel" aria-labelledby="github-heading">
    <div className="github-heading"><div><p className="eyebrow">06 / GITHUB / OPEN SOURCE</p><h2 id="github-heading"><em>Built</em><br />in public.</h2></div><p>A little record of what I&apos;ve been working on—drawn from public GitHub data.</p></div>
    {data && hasCalendar ? <>
      <div className="github-summary"><div><span>PAST 12 MONTHS</span><b>{total === null ? 'Calendar total is being verified' : `${total} public contribution${total === 1 ? '' : 's'}`}</b><small>{formatRange(data.contributions)}</small></div><a href={data.profileUrl} target="_blank" rel="noreferrer">View GitHub <ArrowUpRight size={17} /></a></div>
      <ContributionMap contributions={data.contributions} />
      <div className="github-legend" aria-label="Contribution intensity legend"><span>Less active</span><i className="github-cell--0" /><i className="github-cell--1" /><i className="github-cell--2" /><i className="github-cell--3" /><i className="github-cell--4" /><span>More active</span></div>
      {!data.contributions.complete && <p className="github-data-note">Some daily contribution values were unavailable, so no total is displayed.</p>}
      <div className="github-work"><div><p className="eyebrow">THINGS I&apos;VE BEEN BUILDING</p><h3>Repository notes.</h3><RepositoryList repositories={data.repositories} /></div><LanguageMix languages={data.languages.filter((language) => language.percent > 0)} /></div>
    </> : <div className="github-status"><p>{status === 'loading' ? 'Loading public GitHub activity…' : 'GitHub contribution activity is temporarily unavailable.'}</p><a href={site.github} target="_blank" rel="noreferrer"><GitFork size={16} /> Visit GitHub <ArrowUpRight size={16} /></a></div>}
  </section>
}
