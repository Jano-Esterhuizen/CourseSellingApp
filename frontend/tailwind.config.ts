import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: ["class"],
  theme: {
    extend: {
      animation: {
        grid: "grid 15s linear infinite",
        'spin': 'spin 2s linear infinite',
      },
      keyframes: {
        grid: {
          "0%": { transform: "translateY(0)" },
          "100%": { transform: "translateY(calc(50% + 50px))" },
        },
        'spin': {
          from: {
            transform: 'rotate(0deg)',
          },
          to: {
            transform: 'rotate(360deg)',
          },
        },
      },
    },
  },
  plugins: [],
}
export default config 