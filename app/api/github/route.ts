import { NextResponse } from 'next/server'
import { projects, site } from '@/data/portfolio'

type ContributionDay = {
  date: string
  count: number | null
  level: number | null
}

type ContributionData = {
  from: string
  to: string
  total: number | null
  complete: boolean
  source: 'github_graphql' | 'github_public_calendar' | 'unavailable'
  days: ContributionDay[]
}

type RepositoryData = {
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

type GitHubRepositoryResponse = {
  name?: string
  full_name?: string
  html_url?: string
  description?: string | null
  language?: string | null
  stargazers_count?: number
  updated_at?: string
}

const DAY = 24 * 60 * 60 * 1000
const CACHE_HEADERS = { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' }

function getGitHubUsername() {
  const configured = process.env.GITHUB_USERNAME?.trim()
  if (configured) return configured

  try {
    const profile = new URL(site.github)
    if (profile.hostname !== 'github.com') return null
    return profile.pathname.split('/').filter(Boolean)[0] ?? null
  } catch {
    return null
  }
}

function getDateRange() {
  const now = new Date()
  const end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()))
  const start = new Date(end.getTime() - 364 * DAY)
  return {
    from: start.toISOString().slice(0, 10),
    to: end.toISOString().slice(0, 10),
    graphqlTo: now.toISOString(),
  }
}

function expectedDates(from: string, to: string) {
  const dates: string[] = []
  const start = new Date(`${from}T00:00:00Z`)
  const end = new Date(`${to}T00:00:00Z`)

  for (const day = new Date(start); day <= end; day.setUTCDate(day.getUTCDate() + 1)) {
    dates.push(day.toISOString().slice(0, 10))
  }

  return dates
}

function normalizedContributionDays(from: string, to: string, supplied: ContributionDay[]) {
  const dates = expectedDates(from, to)
  const byDate = new Map(supplied.map((day) => [day.date, day]))
  const days = dates.map((date) => byDate.get(date) ?? { date, count: null, level: null })
  // A daily count is sufficient to verify the total. The presentation level is
  // deliberately kept separate so a markup-only level change cannot turn an
  // otherwise complete, truthful calendar into an unavailable total.
  const complete = days.every((day) => typeof day.count === 'number')
  const total = complete ? days.reduce((sum, day) => sum + (day.count ?? 0), 0) : null
  return { days, complete, total }
}

function toLevel(level: string) {
  const levels: Record<string, number> = {
    NONE: 0,
    FIRST_QUARTILE: 1,
    SECOND_QUARTILE: 2,
    THIRD_QUARTILE: 3,
    FOURTH_QUARTILE: 4,
  }
  return levels[level] ?? null
}

async function fetchGraphqlContributions(username: string, from: string, to: string, graphqlTo: string): Promise<ContributionData | null> {
  const token = process.env.GITHUB_TOKEN?.trim()
  if (!token) return null

  const query = `query PortfolioContributions($login: String!, $from: DateTime!, $to: DateTime!) {
    user(login: $login) {
      contributionsCollection(from: $from, to: $to) {
        contributionCalendar {
          weeks {
            contributionDays { date contributionCount contributionLevel }
          }
        }
      }
    }
  }`

  try {
    const response = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'User-Agent': 'Gokul-NR-Portfolio GitHub activity',
      },
      body: JSON.stringify({ query, variables: { login: username, from: `${from}T00:00:00Z`, to: graphqlTo } }),
      next: { revalidate: 3600 },
    })

    if (!response.ok) return null

    const payload = await response.json() as {
      data?: { user?: { contributionsCollection?: { contributionCalendar?: { weeks?: Array<{ contributionDays?: Array<{ date?: string, contributionCount?: number, contributionLevel?: string }> }> } } } }
    }
    const sourceDays = payload.data?.user?.contributionsCollection?.contributionCalendar?.weeks?.flatMap((week) => week.contributionDays ?? []) ?? []
    if (!sourceDays.length) return null

    const normalized = normalizedContributionDays(from, to, sourceDays.flatMap((day) => day.date && typeof day.contributionCount === 'number' && day.contributionLevel ? [{ date: day.date, count: day.contributionCount, level: toLevel(day.contributionLevel) }] : []))
    return { from, to, ...normalized, source: 'github_graphql' }
  } catch {
    return null
  }
}

function attribute(attributes: string, name: string) {
  return new RegExp(`\\b${name}="([^"]*)"`, 'i').exec(attributes)?.[1]
}

function parsePublicContributionMarkup(markup: string) {
  const supplied: ContributionDay[] = []
  const cells = markup.matchAll(/<td\b([^>]*)><\/td>\s*<tool-tip\b[^>]*>([\s\S]*?)<\/tool-tip>/gi)

  for (const cell of cells) {
    const [, attributes, tooltip] = cell
    const date = attribute(attributes, 'data-date')
    const level = Number(attribute(attributes, 'data-level'))
    const countMatch = /(\d+)\s+contributions?/i.exec(tooltip)
    const count = countMatch ? Number(countMatch[1]) : /no contributions/i.test(tooltip) ? 0 : null
    if (!date || Number.isNaN(level)) continue
    supplied.push({ date, count, level })
  }

  return supplied
}

function yearSegments(from: string, to: string) {
  const segments: Array<{ from: string, to: string }> = []
  const startYear = Number(from.slice(0, 4))
  const endYear = Number(to.slice(0, 4))

  for (let year = startYear; year <= endYear; year += 1) {
    segments.push({
      from: year === startYear ? from : `${year}-01-01`,
      to: year === endYear ? to : `${year}-12-31`,
    })
  }

  return segments
}

async function fetchPublicContributions(username: string, from: string, to: string): Promise<ContributionData> {
  try {
    const responses = await Promise.all(yearSegments(from, to).map(async (segment) => {
      const response = await fetch(`https://github.com/users/${username}/contributions?from=${segment.from}&to=${segment.to}`, {
        headers: {
          Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'User-Agent': 'Gokul-NR-Portfolio GitHub activity',
        },
        next: { revalidate: 3600 },
      })
      if (!response.ok) throw new Error(`GitHub calendar returned ${response.status}`)
      return parsePublicContributionMarkup(await response.text())
    }))
    const supplied = responses.flat()

    const normalized = normalizedContributionDays(from, to, supplied)
    return { from, to, ...normalized, source: normalized.days.some((day) => day.count !== null) ? 'github_public_calendar' : 'unavailable' }
  } catch {
    return { from, to, total: null, complete: false, source: 'unavailable', days: [] }
  }
}

function repositoryCoordinates(source: string) {
  try {
    const url = new URL(source)
    const [owner, name] = url.pathname.split('/').filter(Boolean)
    return owner && name ? { owner, name } : null
  } catch {
    return null
  }
}

async function fetchRepository(coordinates: { owner: string, name: string }): Promise<{ repository: RepositoryData, languages: Record<string, number> } | null> {
  try {
    const endpoint = `https://api.github.com/repos/${coordinates.owner}/${coordinates.name}`
    const [repositoryResponse, languageResponse] = await Promise.all([
      fetch(endpoint, { headers: { Accept: 'application/vnd.github+json', 'User-Agent': 'Gokul-NR-Portfolio repository display' }, next: { revalidate: 3600 } }),
      fetch(`${endpoint}/languages`, { headers: { Accept: 'application/vnd.github+json', 'User-Agent': 'Gokul-NR-Portfolio repository display' }, next: { revalidate: 3600 } }),
    ])
    if (!repositoryResponse.ok) return null

    const repository = await repositoryResponse.json() as GitHubRepositoryResponse
    if (!repository.name || !repository.full_name || !repository.html_url || !repository.updated_at) return null
    const languages = languageResponse.ok ? await languageResponse.json() as Record<string, number> : {}

    return {
      repository: {
        name: repository.name,
        fullName: repository.full_name,
        htmlUrl: repository.html_url,
        description: repository.description ?? null,
        language: repository.language ?? null,
        stars: repository.stargazers_count ?? 0,
        updatedAt: repository.updated_at,
      },
      languages,
    }
  } catch {
    return null
  }
}

function languageDistribution(languageMaps: Array<Record<string, number>>) {
  const totals = new Map<string, number>()
  for (const languages of languageMaps) {
    for (const [name, bytes] of Object.entries(languages)) {
      totals.set(name, (totals.get(name) ?? 0) + bytes)
    }
  }

  const totalBytes = Array.from(totals.values()).reduce((sum, bytes) => sum + bytes, 0)
  if (!totalBytes) return []
  return Array.from(totals.entries())
    .sort(([, first], [, second]) => second - first)
    .slice(0, 5)
    .map(([name, bytes]) => ({ name, bytes, percent: Math.round((bytes / totalBytes) * 100) }))
    .filter((language) => language.percent > 0)
}

export async function GET() {
  const username = getGitHubUsername()
  if (!username) {
    return NextResponse.json({ available: false, message: 'A GitHub username has not been configured.' }, { status: 503, headers: { 'Cache-Control': 'no-store' } })
  }

  const { from, to, graphqlTo } = getDateRange()
  const [graphql, repositoryResults] = await Promise.all([
    fetchGraphqlContributions(username, from, to, graphqlTo),
    Promise.all(projects.slice(0, 3).map((project) => {
      const coordinates = repositoryCoordinates(project.source)
      return coordinates ? fetchRepository(coordinates) : Promise.resolve(null)
    })),
  ])
  const contributions = graphql ?? await fetchPublicContributions(username, from, to)
  const verifiedRepositories = repositoryResults.filter((item): item is { repository: RepositoryData, languages: Record<string, number> } => item !== null)

  return NextResponse.json({
    available: contributions.source !== 'unavailable' || verifiedRepositories.length > 0,
    username,
    profileUrl: `https://github.com/${username}`,
    contributions,
    repositories: verifiedRepositories.map((item) => item.repository),
    languages: languageDistribution(verifiedRepositories.map((item) => item.languages)),
    fetchedAt: new Date().toISOString(),
  }, { headers: CACHE_HEADERS })
}
