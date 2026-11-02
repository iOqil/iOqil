import { card, color, escapeXml, starPoints } from '../lib/art.mjs'

/** Rosette of nested eight-pointed stars: the card's one moving thing. */
function rosette(cx, cy) {
  const ring = (radius, fill, extra = '') => `<polygon points="${starPoints(radius)}" fill="${fill}" stroke="${color.gold}" stroke-opacity=".7" ${extra}/>`
  const petals = Array.from({ length: 8 }, (_, index) => `<g transform="rotate(${index * 45}) translate(0 -112)"><polygon points="${starPoints(22)}" fill="${index % 2 ? color.deep : color.lapis}" stroke="${color.gold}" stroke-opacity=".6"/></g>`).join('')
  return `<g transform="translate(${cx} ${cy})"><g class="spin">${petals}</g>${ring(88, color.deep)}${ring(66, color.lapis)}<g class="spin back">${ring(44, color.night)}</g>${ring(22, color.turquoise)}</g>`
}

export function buildCard(profile) {
  const width = 1000
  const height = 410
  const rows = profile.build.map((row, index) => {
    const y = 120 + index * 76
    return `<polygon transform="translate(372 ${y - 7})" points="${starPoints(11)}" fill="${color.gold}"/><text x="396" y="${y}" class="t" font-size="23" fill="${color.parchment}">${escapeXml(row.title)}</text><text x="396" y="${y + 28}" class="c" font-size="15.5" fill="${color.mist}">${escapeXml(row.text)}</text>`
  }).join('')
  const goal = profile.goal.map((line, index) => `<text x="396" y="${344 + index * 24}" class="c" font-size="16" fill="${color.turquoise}">${escapeXml(line)}</text>`).join('')
  const body = `${rosette(182, 205)}
<text x="372" y="66" class="t" font-size="36" fill="${color.parchment}">What I build</text>
${rows}
<line x1="372" y1="330" x2="372" y2="374" stroke="${color.gold}" stroke-width="2"/>
${goal}`
  return card({
    width,
    height,
    title: 'What I build',
    desc: profile.build.map(row => `${row.title}: ${row.text}.`).join(' '),
    css: `.spin{animation:spin 60s linear infinite}.back{animation-direction:reverse;animation-duration:40s}@keyframes spin{to{transform:rotate(360deg)}}`,
    body
  })
}
