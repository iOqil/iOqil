import { readFileSync } from 'node:fs'

const root = new URL('../../', import.meta.url)

export const color = {
  night: '#0A1420',
  glaze: '#10202F',
  raised: '#16293A',
  line: '#274054',
  lapis: '#2B5FA8',
  deep: '#173A6B',
  turquoise: '#3CCFC3',
  gold: '#E7B24A',
  parchment: '#EFE8D8',
  mist: '#A7B8C6'
}

const base64 = path => readFileSync(new URL(path, root)).toString('base64')
const fontFace = (family, file, weight) => `@font-face{font-family:'${family}';font-weight:${weight};src:url(data:font/woff2;base64,${base64(`assets/fonts/${file}`)}) format('woff2')}`

export const avatarHref = () => `data:image/webp;base64,${base64('assets/avatar.webp')}`

export const escapeXml = value => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')

const baseCss = `
.t{font-family:'Tektur','Segoe UI',Helvetica,Arial,sans-serif;font-weight:700}
.m{font-family:'Tektur','Segoe UI',Helvetica,Arial,sans-serif;font-weight:500}
.c{font-family:'JetBrains Mono',ui-monospace,Menlo,Consolas,monospace}
@media (prefers-reduced-motion:reduce){*{animation:none!important}}`

/** Wraps a card body in a standalone SVG. GitHub shows these through <img>, so fonts and images must be embedded. */
export function card({ width, height, title, desc, css = '', defs = '', body, panel = true, fonts = ['display', 'medium', 'code'] }) {
  const faces = [
    fonts.includes('display') && fontFace('Tektur', 'tektur-700.woff2', 700),
    fonts.includes('medium') && fontFace('Tektur', 'tektur-500.woff2', 500),
    fonts.includes('code') && fontFace('JetBrains Mono', 'jetbrains-mono-400.woff2', 400)
  ].filter(Boolean).join('')
  const background = panel
    ? `<rect x=".5" y=".5" width="${width - 1}" height="${height - 1}" rx="16" fill="url(#panel)" stroke="${color.line}"/>`
    : ''
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" role="img" aria-label="${escapeXml(title)}"><title>${escapeXml(title)}</title><desc>${escapeXml(desc)}</desc><defs><style>${faces}${baseCss}${css}</style><linearGradient id="panel" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${color.glaze}"/><stop offset="1" stop-color="${color.night}"/></linearGradient>${defs}</defs>${background}${body}</svg>\n`
}

/** Points of an eight-pointed star whose tips touch a square cell of size 2 * radius. */
export function starPoints(radius) {
  const inner = radius * 0.7654
  return Array.from({ length: 16 }, (_, index) => {
    const angle = (Math.PI / 8) * index - Math.PI / 2
    const length = index % 2 === 0 ? radius : inner
    return `${(Math.cos(angle) * length).toFixed(1)},${(Math.sin(angle) * length).toFixed(1)}`
  }).join(' ')
}

/** Star-and-cross tile field, the classic Timurid glaze pattern. Stars light up in a wave from (originX, originY). */
export function tileField({ id, x, y, width, height, cell, originX, originY, pace = 0.012 }) {
  const stars = []
  const cols = Math.ceil(width / cell)
  const rows = Math.ceil(height / cell)
  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      const cx = x + cell / 2 + col * cell
      const cy = y + cell / 2 + row * cell
      const delay = (Math.hypot(cx - originX, cy - originY) * pace).toFixed(2)
      const tone = (row + col) % 2 === 0 ? 'tile-a' : 'tile-b'
      stars.push(`<use href="#${id}" x="${cx}" y="${cy}" class="tile ${tone}" style="animation-delay:${delay}s"/>`)
    }
  }
  return stars.join('')
}

export const tileDefs = (id, cell) => `<polygon id="${id}" points="${starPoints(cell / 2 - 0.5)}"/>`

export const tileCss = (duration = 9) => `
.tile{stroke:${color.gold};stroke-width:.6;stroke-opacity:.5;animation:tile ${duration}s ease-in-out infinite}
.tile-a{fill:${color.lapis}}
.tile-b{fill:${color.deep}}
@keyframes tile{0%,100%{opacity:.55}12%{opacity:1}30%{opacity:.55}}`

/** Four-centred arch of a Timurid portal: a soft shoulder rising to a sharp point. */
export function archPath({ x, y, width, height, spring }) {
  const left = x
  const right = x + width
  const middle = x + width / 2
  const bottom = y + height
  const shoulder = y + spring
  const rise = shoulder - y
  return `M${left},${bottom}L${left},${shoulder}C${left},${shoulder - rise * 0.6} ${middle - width * 0.2},${y + rise * 0.24} ${middle},${y}C${middle + width * 0.2},${y + rise * 0.24} ${right},${shoulder - rise * 0.6} ${right},${shoulder}L${right},${bottom}Z`
}

/** A tiled portal with the photo standing in its arch. */
export function portal({ x, y, width, height, cell = 34 }) {
  const margin = 30
  const niche = { x: x + margin, y: y + 18, width: width - margin * 2, height: height - 18, spring: 150 }
  const arch = archPath(niche)
  const photo = niche.width * 1.3
  const defs = `${tileDefs('star', cell)}
<clipPath id="frame"><rect x="${x}" y="${y}" width="${width}" height="${height}" rx="6"/></clipPath>
<clipPath id="niche"><path d="${arch}"/></clipPath>
<linearGradient id="nicheFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${color.deep}"/><stop offset="1" stop-color="${color.night}"/></linearGradient>
<linearGradient id="fade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${color.night}" stop-opacity="0"/><stop offset="1" stop-color="${color.night}"/></linearGradient>`
  const body = `<g clip-path="url(#frame)"><rect x="${x}" y="${y}" width="${width}" height="${height}" fill="${color.night}"/>${tileField({ id: 'star', x, y, width, height, cell, originX: x + width / 2, originY: y + 90 })}</g>
<path d="${arch}" fill="url(#nicheFill)"/>
<image href="${avatarHref()}" x="${niche.x + (niche.width - photo) / 2}" y="${y + height - photo}" width="${photo}" height="${photo}" clip-path="url(#niche)" preserveAspectRatio="xMidYMax meet"/>
<rect x="${niche.x}" y="${y + height - 70}" width="${niche.width}" height="70" fill="url(#fade)"/>
<path d="${arch}" fill="none" stroke="${color.gold}" stroke-width="2.5"/>
<rect x="${x}" y="${y}" width="${width}" height="${height}" rx="6" fill="none" stroke="${color.gold}" stroke-opacity=".55"/>`
  return { defs, body }
}
