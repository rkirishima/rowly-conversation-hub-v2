import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Shonan/海 (Sea) Color Palette
        'shonan': {
          'navy': '#001f3f',      // 深紺 (Deep Navy)
          'teal': '#0db4d4',      // 青緑 (Teal)
          'sky': '#1da3d8',       // 空色 (Sky Blue)
          'white': '#f8f9fa',     // 白 (White)
          'sand': '#e8dcc8',      // 砂色 (Sand)
          'dark': '#1a2332',      // 濃い灰 (Dark Gray)
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
