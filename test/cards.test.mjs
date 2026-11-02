import assert from 'node:assert/strict'
import { readdirSync, readFileSync } from 'node:fs'
import { test } from 'node:test'
import { escapeXml, starPoints } from '../scripts/lib/art.mjs'
import { languageShares } from '../scripts/lib/github.mjs'

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

test('language shares add sizes across repositories and hide repository names', () => {
  const shares = languageShares([
    { name: 'secret-one', languages: { edges: [{ size: 300, node: { name: 'PHP' } }, { size: 100, node: { name: 'Vue' } }] } },
    { name: 'secret-two', languages: { edges: [{ size: 100, node: { name: 'Vue' } }] } }
  ])
  assert.deepEqual(shares, [{ name: 'PHP', percent: 60 }, { name: 'Vue', percent: 40 }])
  assert.doesNotMatch(JSON.stringify(shares), /secret/)
  assert.deepEqual(languageShares([]), [])
})

test('text is escaped and stars have sixteen points', () => {
  assert.equal(escapeXml('<a & "b">'), '&lt;a &amp; &quot;b&quot;&gt;')
  assert.equal(starPoints(10).split(' ').length, 16)
})
