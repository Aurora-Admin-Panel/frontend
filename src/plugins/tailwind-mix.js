import plugin from 'tailwindcss/plugin'

const varFromToken = (token) => {
  const t = String(token || '').trim()
  if (!t) return 'transparent'
  return t.startsWith('--') ? `var(${t})` : `var(--color-${t})`
}

const pct = (p) => {
  const s = String(p ?? '').trim()
  return s.endsWith('%') ? s : `${s}%`
}

export default plugin.withOptions(
  () => {
    return function ({ matchUtilities }) {
      const ruleFrom = (value, prop) => {
        const [a, pa = '50', b, pb = '50'] = String(value).split(',')
        return {
          [prop]: `color-mix(in oklch shorter hue, ${varFromToken(a)} ${pct(pa)}, ${varFromToken(b)} ${pct(pb)})`,
        }
      }

      matchUtilities(
        {
          'text-mix': (value) => ruleFrom(value, 'color'),
          'bg-mix': (value) => ruleFrom(value, 'backgroundColor'),
          'border-mix': (value) => ruleFrom(value, 'borderColor'),
        },
        { type: 'any' }
      )
    }
  },
  () => ({})
)

