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
      sans: ['Oswald', 'sans-serif']
    },
    fontSize: {
      // [font-size, line-height]
      xs: ['15px', '20px'],
      sm: ['16px', '24px'],
      base: ['20px', '30px'],
      lg: ['24px', '36px'],
      xl: ['28px', '42px'],
      '2xl': ['28px', '42px']
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
