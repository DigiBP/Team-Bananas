/**
 * config override for tailwindcss, see:
 *  - https://tailwindcss.nuxtjs.org/tailwind/config
 *  - https://tailwindcss.com/docs/configuration
 */
module.exports = {
  purge: {
    content: [
      'components/**/*.vue',
      'layouts/**/*.vue',
      'pages/**/*.vue',
      'plugins/**/*.js',
      'nuxt.config.js'
    ]
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    fontFamily: {
      sans: ['Inter', 'sans-serif']
    },
    fontSize: {
      // [font-size, line-height]
      xs: ['12px', '18px'],
      sm: ['13px', '22px'],
      base: ['16px', '24px'],
      lg: ['20px', '28px'],
      xl: ['24px', '30px'],
      '2xl': ['30px', '36px']
    },
    extend: {
      colors: {
        digisailor: {
          default: '#6e4843',
          accent: '#43696e'
        }
      }
    }
  },
  variants: {
    extend: {}
  },
  plugins: []
}
