import { card, color, escapeXml } from '../lib/art.mjs'

const chipWidth = text => Math.round(text.length * 9.4 + 30)

export function stackCard(profile) {
  const width = 1000
  const rowHeight = 74
  const height = 104 + profile.stack.length * rowHeight
  const rows = profile.stack.map((group, index) => {
    const y = 96 + index * rowHeight
    let x = 176
    const chips = group.items.map((item) => {
      const w = chipWidth(item)
      const chip = `<g><rect x="${x}" y="${y}" width="${w}" height="44" rx="4" fill="${color.raised}" stroke="${color.line}"/><text x="${x + w / 2}" y="${y + 28}" text-anchor="middle" class="c" font-size="15.5" fill="${color.parchment}">${escapeXml(item)}</text></g>`
      x += w + 10
      return chip
    }).join('')
    return `<text x="40" y="${y + 29}" class="m" font-size="20" fill="${color.gold}">${escapeXml(group.title)}</text>${chips}`
  }).join('')
  const css = `.beam{animation:beam 7s ease-in-out infinite}@keyframes beam{0%,15%{transform:translateX(-320px)}70%,100%{transform:translateX(1080px)}}`
  const defs = `<linearGradient id="beamFill" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${color.turquoise}" stop-opacity="0"/><stop offset=".5" stop-color="${color.turquoise}" stop-opacity=".16"/><stop offset="1" stop-color="${color.turquoise}" stop-opacity="0"/></linearGradient><clipPath id="inside"><rect width="${width}" height="${height}" rx="16"/></clipPath>`
  const body = `<text x="40" y="60" class="t" font-size="36" fill="${color.parchment}">What I work with</text>
${rows}
<g clip-path="url(#inside)"><rect class="beam" x="0" y="0" width="260" height="${height}" fill="url(#beamFill)"/></g>`
  return card({
    width,
    height,
    title: 'What I work with',
    desc: profile.stack.map(group => `${group.title}: ${group.items.join(', ')}.`).join(' '),
    css,
    defs,
    body
  })
}
