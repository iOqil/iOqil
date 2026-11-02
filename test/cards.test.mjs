import assert from 'node:assert/strict'
import { readdirSync, readFileSync } from 'node:fs'
import { test } from 'node:test'
import { escapeXml, starPoints } from '../scripts/lib/art.mjs'
import { languageShares, mergeFigures, refreshGithubData } from '../scripts/lib/github.mjs'

const cardsDir = new URL('../cards/', import.meta.url)
const cards = readdirSync(cardsDir).filter(file => file.endsWith('.svg'))
const read = file => readFileSync(new URL(file, cardsDir), 'utf8')

test('every card exists and is described for screen readers', () => {
  for (const name of ['hero', 'caravan', 'build', 'stack', 'pass', 'connect']) assert.ok(cards.includes(`${name}.svg`), name)
  for (const file of cards) assert.match(read(file), /<title>[^<]+<\/title><desc>[^<]+<\/desc>/, file)
})

test('every card has balanced tags', () => {
  for (const file of cards) {
    const open = []
    const source = read(file).replace(/<style>[\s\S]*?<\/style>/g, '').replace(/<(title|desc)>[^<]*<\/\1>/g, '')
    for (const [tag, name] of source.matchAll(/<\/?([a-zA-Z]+)[^>]*>/g)) {
      if (tag.endsWith('/>')) continue
      if (tag.startsWith('</')) assert.equal(open.pop(), name, `${file}: ${tag}`)
      else open.push(name)
    }
    assert.deepEqual(open, [], file)
  }
})

test('cards load nothing from outside, because GitHub blocks it inside <img>', () => {
  for (const file of cards) {
    const source = read(file).replaceAll('xmlns="http://www.w3.org/2000/svg"', '')
    assert.doesNotMatch(source, /(href|src)="https?:/, file)
    assert.doesNotMatch(source, /url\(['"]?https?:/, file)
  }
})

test('a card stays small enough for GitHub to show it quickly', () => {
  for (const file of cards) assert.ok(read(file).length < 200_000, file)
})

const php = { languages: { edges: [{ size: 300, node: { name: 'PHP' } }, { size: 100, node: { name: 'Vue' } }] } }
const vue = { languages: { edges: [{ size: 100, node: { name: 'Vue' } }] } }
const answer = (nodes, totalCount) => ({
  contributionsCollection: { contributionCalendar: { totalContributions: 3, weeks: [{ contributionDays: [{ contributionCount: 1 }, { contributionCount: 2 }] }] } },
  repositories: { totalCount, nodes }
})
const saved = { repositories: 40, languages: [{ name: 'Go', percent: 100 }], contributions: 1, weeks: [1] }

test('language shares add sizes across repositories', () => {
  assert.deepEqual(languageShares([php, vue]), [{ name: 'PHP', percent: 60 }, { name: 'Vue', percent: 40 }])
  assert.deepEqual(languageShares([]), [])
})

test('a token that sees only public repositories keeps the saved totals but refreshes contributions', () => {
  assert.deepEqual(mergeFigures(saved, answer([{ isPrivate: false, ...php }], 21)), { ...saved, contributions: 3, weeks: [3] })
})

test('a token that sees private repositories replaces the totals', () => {
  const next = mergeFigures(saved, answer([{ isPrivate: true, ...php }, { isPrivate: false, ...vue }], 36))
  assert.equal(next.repositories, 36)
  assert.deepEqual(next.languages, [{ name: 'PHP', percent: 60 }, { name: 'Vue', percent: 40 }])
})

test('a failed GitHub request keeps the figures on disk', async (context) => {
  const dataFile = new URL('../data/github.json', import.meta.url)
  const before = readFileSync(dataFile, 'utf8')
  context.mock.method(console, 'warn', () => {})
  context.mock.method(globalThis, 'fetch', async () => new Response('{}', { status: 500 }))
  assert.deepEqual(await refreshGithubData('iOqil', 'token'), JSON.parse(before))
  assert.equal(readFileSync(dataFile, 'utf8'), before)
  assert.deepEqual(await refreshGithubData('iOqil', ''), JSON.parse(before))
})

test('the camel shows one pair of legs when animation is off', () => {
  assert.match(read('caravan.svg'), /\.b\{opacity:0;/)
})

test('language bars use the real percentage, not a scale relative to the largest', () => {
  const data = JSON.parse(readFileSync(new URL('../data/github.json', import.meta.url), 'utf8'))
  const [top] = data.languages
  assert.ok(read('pass.svg').includes(`width="${((top.percent / 100) * 370).toFixed(1)}"`))
})

test('text is escaped and stars have sixteen points', () => {
  assert.equal(escapeXml('<a & "b">'), '&lt;a &amp; &quot;b&quot;&gt;')
  assert.equal(starPoints(10).split(' ').length, 16)
})
