import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Shonan Coastal Theme
        'shonan': {
          'navy': '#0D3B66',      // Primary Navy
          'teal': '#1E5F74',      // Secondary Teal
          'sky': '#7BA7BC',       // Accent Sky
          'sand': '#EAD7BB',      // Background Sand
          'sand-light': '#F5F3EE', // Light Sand
          'text-dark': '#2C2C2C', // Text Dark
          'divider': '#D4D0C8',   // Divider
        },
      },
      backgroundImage: {
        'shonan-gradient': 'linear-gradient(135deg, #001f3f 0%, #0db4d4 100%)',
      },
    },
  },
  plugins: [],
}
export default config
