import { readFileSync, writeFileSync } from 'node:fs'

const dataFile = new URL('../../data/github.json', import.meta.url)

const query = `query($login: String!) { user(login: $login) {
  contributionsCollection { contributionCalendar { totalContributions weeks { contributionDays { contributionCount } } } }
  repositories(ownerAffiliations: OWNER, isFork: false, first: 100, orderBy: { field: PUSHED_AT, direction: DESC }) {
    totalCount
    nodes { isPrivate languages(first: 10, orderBy: { field: SIZE, direction: DESC }) { edges { size node { name } } } }
  }
} }`

const readSaved = () => JSON.parse(readFileSync(dataFile, 'utf8'))

/** Share of each language across all repositories. Only totals leave this function, never a repository name. */
export function languageShares(repositories, limit = 6) {
  const sizes = new Map()
  for (const repository of repositories) {
    for (const { size, node } of repository.languages.edges) sizes.set(node.name, (sizes.get(node.name) || 0) + size)
  }
  const total = [...sizes.values()].reduce((sum, size) => sum + size, 0)
  if (!total) return []
  return [...sizes.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([name, size]) => ({ name, percent: Math.round((size / total) * 1000) / 10 }))
}

/**
 * The default Actions token only sees public repositories, so repository and language totals change only when
 * the run can see private ones too: a PROFILE_TOKEN secret, or running this script locally with your own token.
 */
export function mergeFigures(saved, { contributionsCollection: { contributionCalendar: calendar }, repositories }) {
  const seesPrivate = repositories.nodes.some(repository => repository.isPrivate)
  return {
    repositories: seesPrivate ? repositories.totalCount : saved.repositories,
    languages: seesPrivate ? languageShares(repositories.nodes) : saved.languages,
    contributions: calendar.totalContributions,
    weeks: calendar.weeks.map(week => week.contributionDays.reduce((sum, day) => sum + day.contributionCount, 0))
  }
}

/** Refreshes the saved figures. A failed request keeps the last good ones. */
export async function refreshGithubData(login, token) {
  const saved = readSaved()
  if (!token) return saved
  try {
    const response = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json', 'User-Agent': 'iOqil-profile' },
      body: JSON.stringify({ query, variables: { login } })
    })
    const answer = await response.json()
    if (!response.ok || answer.errors || !answer.data?.user) throw new Error(`GitHub answered ${response.status}`)
    const next = mergeFigures(saved, answer.data.user)
    writeFileSync(dataFile, `${JSON.stringify(next, null, 2)}\n`)
    return next
  } catch (error) {
    console.warn(`Keeping the saved GitHub figures: ${error.message}`)
    return saved
  }
}
