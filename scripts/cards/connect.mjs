import { card, color, escapeXml, starPoints } from '../lib/art.mjs'

export function connectCard(profile) {
  const width = 1000
  const height = 250
  const tiles = profile.links.map((link, index) => {
    const x = 400 + (index % 2) * 288
    const y = 54 + Math.floor(index / 2) * 90
    return `<rect x="${x}" y="${y}" width="276" height="76" rx="6" fill="${color.raised}" stroke="${color.line}"/><polygon transform="translate(${x + 30} ${y + 38})" points="${starPoints(13)}" fill="${link.fill}"/><text x="${x + 56}" y="${y + 33}" class="m" font-size="18" fill="${color.parchment}">${escapeXml(link.label)}</text><text x="${x + 56}" y="${y + 56}" class="c" font-size="13.5" fill="${color.mist}">${escapeXml(link.title)}</text>`
  }).join('')
  const body = `<text x="44" y="96" class="t" font-size="38" fill="${color.parchment}">Have a project</text>
<text x="44" y="140" class="t" font-size="38" fill="${color.parchment}">in mind?</text>
<text x="44" y="182" class="c" font-size="15.5" fill="${color.mist}">I reply fastest on Telegram.</text>
${tiles}`
  return card({
    width,
    height,
    title: 'Have a project in mind?',
    desc: profile.links.map(link => `${link.label}: ${link.title}.`).join(' '),
    body
  })
}

export function linkButton(link) {
  const width = 172
  const height = 44
  return card({
    width,
    height,
    title: link.label,
    desc: link.title,
    panel: false,
    fonts: ['display'],
    body: `<rect width="${width}" height="${height}" rx="6" fill="${link.fill}"/><text x="${width / 2}" y="29" text-anchor="middle" class="t" font-size="18" fill="${color.night}">${escapeXml(link.label)}</text>`
  })
}
