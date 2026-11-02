import { avatarHref, card, color, escapeXml, starPoints } from '../lib/art.mjs'

/** Bar widths derive from the login, so the barcode is decoration that stays the same between builds. */
function barcode(text, x, y, width, height) {
  const bars = []
  let cursor = x
  let seed = [...text].reduce((sum, letter) => sum * 31 + letter.charCodeAt(0), 7)
  while (cursor < x + width) {
    seed = (seed * 9301 + 49297) % 233280
    const bar = 1 + (seed % 4)
    const gap = 1 + (seed % 3)
    bars.push(`<rect x="${cursor}" y="${y}" width="${bar}" height="${height}"/>`)
    cursor += bar + gap
  }
  return `<g fill="${color.night}">${bars.join('')}</g>`
}

function idPass(profile) {
  const x = 44
  const y = 96
  const width = 252
  const height = 356
  const strap = Array.from({ length: 5 }, (_, index) => `<polygon transform="translate(${x + width / 2} ${10 + index * 15})" points="${starPoints(5)}" fill="${color.night}"/>`).join('')
  return `<g class="swing"><rect x="${x + width / 2 - 11}" y="-2" width="22" height="88" fill="${color.gold}"/>${strap}<rect x="${x + width / 2 - 20}" y="78" width="40" height="24" rx="4" fill="${color.mist}"/>
<rect x="${x}" y="${y}" width="${width}" height="${height}" rx="14" fill="${color.parchment}"/>
<rect x="${x + width / 2 - 22}" y="${y + 8}" width="44" height="7" rx="3.5" fill="${color.night}" opacity=".35"/>
<rect x="${x + 18}" y="${y + 26}" width="${width - 36}" height="170" rx="8" fill="${color.deep}"/>
<image href="${avatarHref()}" x="${x + 18}" y="${y + 26}" width="${width - 36}" height="170" clip-path="url(#photo)" preserveAspectRatio="xMidYMin slice"/>
<text x="${x + 18}" y="${y + 228}" class="t" font-size="23" fill="${color.night}">${escapeXml(profile.name)}</text>
<text x="${x + 18}" y="${y + 251}" class="m" font-size="14.5" fill="${color.deep}">${escapeXml(profile.role)}</text>
<text x="${x + 18}" y="${y + 275}" class="c" font-size="13" fill="${color.night}">${escapeXml(profile.location)}</text>
${barcode(profile.login, x + 18, y + 290, width - 36, 34)}
<text x="${x + 18}" y="${y + 342}" class="c" font-size="12" fill="${color.night}">github.com/${escapeXml(profile.login)}</text></g>`
}

export function passCard(profile, github) {
  const width = 1000
  const height = 480
  const tiles = [
    { value: github.repositories, label: 'repositories' },
    { value: github.contributions, label: 'contributions/year' },
    { value: `${new Date().getFullYear() - profile.since}+`, label: 'years on GitHub' }
  ]
  const tileRow = tiles.map((tile, index) => {
    const x = 352 + index * 202
    return `<rect x="${x}" y="92" width="190" height="104" rx="6" fill="${color.raised}" stroke="${color.line}"/><text x="${x + 18}" y="142" class="t" font-size="38" fill="${color.gold}">${escapeXml(tile.value)}</text><text x="${x + 18}" y="170" class="c" font-size="13.5" fill="${color.mist}">${escapeXml(tile.label)}</text>`
  }).join('')
  const bars = github.languages.map((language, index) => {
    const y = 262 + index * 32
    const full = 370
    return `<text x="352" y="${y + 13}" class="c" font-size="15" fill="${color.parchment}">${escapeXml(language.name)}</text><rect x="480" y="${y}" width="${full}" height="16" rx="3" fill="${color.raised}"/><rect x="480" y="${y}" width="${Math.max(4, (language.percent / 100) * full).toFixed(1)}" height="16" rx="3" fill="${index === 0 ? color.gold : color.turquoise}" class="bar" style="animation-delay:${index * 0.12}s"/><text x="962" y="${y + 13}" text-anchor="end" class="c" font-size="15" fill="${color.mist}">${language.percent}%</text>`
  }).join('')
  const css = `
.swing{transform-origin:170px 0;animation:swing 6s ease-in-out infinite}
@keyframes swing{0%,100%{transform:rotate(-1.2deg)}50%{transform:rotate(1.2deg)}}
.bar{transform-box:fill-box;transform-origin:left;animation:grow 1.1s cubic-bezier(.2,.8,.2,1) both}
@keyframes grow{from{transform:scaleX(0)}to{transform:scaleX(1)}}`
  const defs = `<clipPath id="photo"><rect x="62" y="122" width="216" height="170" rx="8"/></clipPath>`
  const body = `${idPass(profile)}
<text x="352" y="62" class="t" font-size="36" fill="${color.parchment}">From my GitHub</text>
${tileRow}
<text x="352" y="240" class="m" font-size="19" fill="${color.gold}">Code by language, public and private</text>
${bars}`
  return card({
    width,
    height,
    title: `${profile.name}'s developer pass and GitHub figures`,
    desc: `${github.repositories} repositories, ${github.contributions} contributions in the last year. Languages: ${github.languages.map(language => `${language.name} ${language.percent}%`).join(', ')}.`,
    css,
    defs,
    body
  })
}
