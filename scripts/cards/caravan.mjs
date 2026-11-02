import { card, color } from '../lib/art.mjs'

const palette = { C: '#D9A860', D: '#A8763A', K: '#2A1B0E', L: '#3CCFC3', W: '#EFE8D8', G: '#E7B24A', R: '#B5433C' }

const top = [
  '...................DD...',
  '...................CCCC.',
  '...................CKCCC',
  '...................CCCCD',
  '...................CC...',
  '......LLLLL........CC...',
  '......LLLLL.......CC....',
  '...CC..WWW..CC....CC....',
  '..CCCCGGGGGCCCC..CCC....',
  '.CCCCCRRRRRCCCCCCCCC....',
  '.CCCCCGGGGGCCCCCCCC.....',
  'DCCCCCCCCCCCCCCCCCC.....',
  'D.CDDDDDDDDDDDDDDC......'
]
const legsApart = [
  '..CC..CC......CC..CC....',
  '..CC..CC......CC..CC....',
  '.CC....CC....CC....CC...',
  '.CC....CC....CC....CC...',
  '.CC....CC....CC....CC...',
  '.DD....DD....DD....DD...'
]
const legsTogether = [
  '...CC.CC......CC.CC.....',
  '...CC.CC......CC.CC.....',
  '...CCCC........CCCC.....',
  '....CCC........CCC......',
  '....CC..........CC......',
  '....DD..........DD......'
]

const pixels = (rows, size) => rows.flatMap((row, y) => [...row].flatMap((cell, x) => (
  palette[cell] ? [`<rect x="${x * size}" y="${y * size}" width="${size + 0.3}" height="${size + 0.3}" fill="${palette[cell]}"/>`] : []
))).join('')

const shade = (count) => {
  if (count === 0) return '#1B3346'
  if (count < 3) return '#1F6F73'
  if (count < 8) return '#2AA39B'
  return color.turquoise
}

/** A Bactrian camel carrying a laptop across the owner's real weekly contributions. */
export function caravanCard(profile, github) {
  const width = 1000
  const height = 124
  const groundY = 104
  const size = 4
  const start = -100
  const weeks = github.weeks.slice(-52)
  const step = width / weeks.length
  const walk = 18
  const ground = weeks.map((count, index) => {
    const x = index * step
    const delay = (((x - start - 50) / (width - start)) * walk).toFixed(2)
    return `<g transform="translate(${x.toFixed(1)} ${groundY})"><rect width="${(step - 4).toFixed(1)}" height="14" rx="3" fill="${shade(count)}"/><rect width="${(step - 4).toFixed(1)}" height="14" rx="3" fill="${color.gold}" class="lit" style="animation-delay:${delay}s"/></g>`
  }).join('')
  const css = `
.walk{animation:walk ${walk}s linear infinite}
@keyframes walk{from{transform:translateX(${start}px)}to{transform:translateX(${width}px)}}
.a{animation:a .5s steps(1) infinite}.b{opacity:0;animation:b .5s steps(1) infinite}
@keyframes a{0%{opacity:1}50%{opacity:0}}
@keyframes b{0%{opacity:0}50%{opacity:1}}
.lit{opacity:0;animation:lit ${walk}s linear infinite}
@keyframes lit{0%{opacity:0}1%{opacity:.85}9%{opacity:0}100%{opacity:0}}`
  const legsY = size * top.length
  const body = `${ground}<g class="walk"><g transform="translate(0 ${groundY - size * (top.length + legsApart.length)})">${pixels(top, size)}<g class="a"><g transform="translate(0 ${legsY})">${pixels(legsApart, size)}</g></g><g class="b"><g transform="translate(0 ${legsY})">${pixels(legsTogether, size)}</g></g></g></g>`
  return card({
    width,
    height,
    title: 'A camel carrying a laptop walks across a year of contributions',
    desc: `Each square is one week of ${profile.login}'s GitHub activity over the last year.`,
    css,
    body,
    panel: false,
    fonts: []
  })
}
