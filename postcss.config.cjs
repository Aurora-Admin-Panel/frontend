const isProd = process.env.NODE_ENV === 'production'

module.exports = {
  plugins: {
    '@tailwindcss/postcss': {},
    ...(isProd ? { cssnano: { preset: 'default' } } : {}),
  },
}
