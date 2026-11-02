import { card, color, escapeXml, portal, tileCss } from '../lib/art.mjs'

export function heroCard(profile, github) {
  const width = 1000
  const height = 470
  const art = portal({ x: 664, y: 32, width: 304, height: 406 })
  const facts = [
    { value: github.repositories, label: 'repositories' },
    { value: profile.since, label: 'on GitHub since' },
    { value: 'Tashkent', label: 'Uzbekistan' }
  ]
  const factRow = facts.map((fact, index) => {
    const x = 48 + index * 188
    return `<g><text x="${x}" y="398" class="t" font-size="38" fill="${color.gold}">${escapeXml(fact.value)}</text><text x="${x}" y="424" class="c" font-size="14.5" fill="${color.mist}">${escapeXml(fact.label)}</text></g>`
  }).join('')
  const pitch = profile.pitch.map((line, index) => `<text x="48" y="${274 + index * 26}" class="c" font-size="18" fill="${color.mist}">${escapeXml(line)}</text>`).join('')
  const body = `${art.body}
<text x="48" y="74" class="c" font-size="19" fill="${color.turquoise}">Assalomu alaykum, I'm</text>
<text x="46" y="142" class="t" font-size="66" fill="${color.parchment}">${escapeXml(profile.firstName)}</text>
<text x="46" y="202" class="t" font-size="66" fill="${color.parchment}">${escapeXml(profile.lastName)}</text>
<text x="48" y="238" class="m" font-size="22" fill="${color.turquoise}">${escapeXml(profile.role)}</text>
${pitch}
<line x1="48" y1="352" x2="616" y2="352" stroke="${color.line}"/>
${factRow}`
  return card({
    width,
    height,
    title: `${profile.name}, ${profile.role}`,
    desc: `${profile.name} standing in a tiled Timurid portal. ${profile.pitch.join(' ')}`,
    css: tileCss(),
    defs: art.defs,
    body
  })
}
