import { writeFileSync } from 'node:fs'
import { profile } from './profile.mjs'
import { refreshGithubData } from './lib/github.mjs'
import { heroCard } from './cards/hero.mjs'
import { caravanCard } from './cards/caravan.mjs'
import { buildCard } from './cards/build.mjs'
import { stackCard } from './cards/stack.mjs'
import { passCard } from './cards/pass.mjs'
import { connectCard, linkButton } from './cards/connect.mjs'

const github = await refreshGithubData(profile.login, process.env.GITHUB_TOKEN)

const cards = {
  hero: heroCard(profile, github),
  caravan: caravanCard(profile, github),
  build: buildCard(profile),
  stack: stackCard(profile),
  pass: passCard(profile, github),
  connect: connectCard(profile),
  ...Object.fromEntries(profile.links.map(link => [`link-${link.id}`, linkButton(link)]))
}

for (const [name, svg] of Object.entries(cards)) {
  writeFileSync(new URL(`../cards/${name}.svg`, import.meta.url), svg)
}
