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
  // In Tailwind v4, content is detected automatically. Keep config for theme extensions.
  theme: {
    screens: {
      ssm: '320px',
      xs: '475px',
      ...defaultTheme.screens,
    },
    extend: {
      colors: {
        'primary-light': withOpacityValue('--primary-light'),
        'primary-dark': withOpacityValue('--primary-dark'),
      },
    },
  },
  daisyui: {
    themes: [
      {
        "aurora-classic": {
          "primary": "#7E3AF2",
          "secondary": "#7E3AF2",
          "accent": "#7E3AF2",
          "neutral": "#24262D",
          "base-100": "#FFFFFF",
          "info": "#3ABFF8",
          "success": "#4ADE80",
          "success-content": "#4ADE80",
          "warning": "#FACC15",
          "warning-content": "#FACC15",
          "error": "#F87171",
          "error-content": "#F87171",

          "base-100": "#ffffff",

          "--primary-light": "hsl(var(--p) / 0.8)",
          "--primary-dark": "hsl(var(--p) / 1.2)",
          "--rounded-box": "1rem",
          "--rounded-btn": "0.5rem",
          "--rounded-badge": "1.9rem",
          "--animation-btn": "0.25s",
          "--animation-input": "0.2s",
          "--btn-text-case": "uppercase",
          "--btn-focus-scale": "0.95",
          "--border-btn": "1px",
          "--tab-border": "1px",
          "--tab-radius": "0.5rem",
        },
        "monochrome": {
          primary: "#8eb6f5",
          secondary: "#c58fff",
          accent: "#f58ee0",
          neutral: "#fdfdfe",
          "base-100": "#0F1014",
          info: "#1166f0",
          success: "#69f56e",
          warning: "#ffbb88",
          error: "#ff03cc",
        },
        "moonlight": {
          primary: "#626983",
          secondary: "#7C829D",
          accent: "#999EB2",
          neutral: "#E2E4ED",
          "base-100": "#0F1014",
          info: "#1166f0",
          success: "#69f56e",
          warning: "#ffbb88",
          error: "#ff03cc",
        },
        "midnight": {
          primary: "#EE8679",
          secondary: "#F8D2C9",
          accent: "#5BA2D0",
          neutral: "#DEE0EF",
          "base-100": "#151726",
          info: "#94B8FF",
          success: "#33ddbe",
          warning: "#f6c33f",
          error: "#F87272",
        },
        "sunset": {
          primary: "#EE8679",
          secondary: "#F8D2C9",
          accent: "#5BA2D0",
          neutral: "#DEE0EF",
          "base-100": "#151726",
          info: "#94B8FF",
          success: "#33ddbe",
          warning: "#f6c33f",
          error: "#F87272",
        },
        "morning": {
          primary: '#D26A5D',
          secondary: '#F19A8E',
          accent: '#3788BE',
          neutral: '#4E5377',
          'base-100': '#FDFDFE',
          info: '#7397DE',
          success: '#33ddbe',
          warning: '#f6c33f',
          error: '#F87272',
        }
      },
      "light", "dark", "cupcake", "bumblebee", "emerald", "corporate", "synthwave", "retro", "cyberpunk", "valentine", "halloween", "garden", "forest", "aqua", "lofi", "pastel", "fantasy", "wireframe", "black", "luxury", "dracula", "cmyk", "autumn", "business", "acid", "lemonade", "night", "coffee", "winter"
    ]
  }
}
