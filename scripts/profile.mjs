// Everything the cards say about the owner. Keep it true: the figures on the cards come from data/github.json.
export const profile = {
  login: 'iOqil',
  name: 'Oqil Imomnazarov',
  firstName: 'Oqil',
  lastName: 'Imomnazarov',
  role: 'Full-stack software engineer',
  location: 'Tashkent, Uzbekistan',
  since: 2023,
  pitch: ['I turn hard business problems into fast, secure', 'and easy-to-use web products with Vue, Nuxt,', 'Laravel and solid database design.'],
  build: [
    { title: 'Products from zero', text: 'MVPs, e-commerce platforms and corporate websites' },
    { title: 'Systems that run a business', text: 'CRM, ERP, student information and point-of-sale software' },
    { title: 'Connections and automation', text: 'API integrations, payment flows and Telegram bots' }
  ],
  goal: ['The goal is not just to build a website. It is to build', 'a product that helps your business grow.'],
  stack: [
    { title: 'Frontend', items: ['Vue 3', 'Nuxt', 'TypeScript', 'Tailwind CSS', 'Pinia', 'Figma'] },
    { title: 'Backend', items: ['PHP', 'Laravel', 'Node.js', 'Python', 'REST APIs', 'JWT'] },
    { title: 'Data', items: ['MySQL', 'PostgreSQL', 'Prisma', 'SQLite'] },
    { title: 'Delivery', items: ['Git', 'GitHub Actions', 'Docker', 'Linux VPS', 'Cloudflare', 'Postman'] }
  ],
  links: [
    { id: 'site', label: 'ioqil.uz', title: 'Website', fill: '#3CCFC3' },
    { id: 'telegram', label: 'Telegram', title: '@Oqil_Imomnazarov', fill: '#E7B24A' },
    { id: 'email', label: 'Email', title: 'contact@ioqil.uz', fill: '#EFE8D8' },
    { id: 'github', label: 'GitHub', title: 'github.com/iOqil', fill: '#7FA6E0' }
  ]
}
