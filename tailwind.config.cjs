/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')

function withOpacityValue(variable) {
  return ({ opacityValue }) => {
    if (opacityValue === undefined) {
      return `hsl(var(${variable}))`
    }
    return `hsl(var(${variable}) / ${opacityValue})`
  }
}

module.exports = {
  // In Tailwind v4, define breakpoints in CSS via `@theme`.
  // Remove `theme.screens` here to avoid conflicts with @theme tokens in index.css.
  theme: {
    extend: {
      colors: {
        'primary-light': withOpacityValue('--primary-light'),
        'primary-dark': withOpacityValue('--primary-dark'),
      },
    },
  }
}
