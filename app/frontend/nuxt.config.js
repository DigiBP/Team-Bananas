const API_BASE_URL = 'https://digisailors.ch/'

export default {
  // Target: https://go.nuxtjs.dev/config-target
  target: 'server', // we use 'server' target so that the app has a server-side that can run a http-proxy for API requests

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'Digisailors HR Buddy',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1'
      },
      {
        hid: 'description',
        name: 'description',
        content: 'Digisailors HR Buddy is a HR an assistant agent for a fictive company.'
      }
    ],
    link: [
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;600&display=swap' },
      { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
      { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [],

  loading: {
    color: 'blue',
    height: '5px'
  },

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    { src: '~/plugins/vue-numeral-filter.js', ssr: false }
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    // https://go.nuxtjs.dev/stylelint
    '@nuxtjs/stylelint-module',
    // https://go.nuxtjs.dev/tailwindcss
    '@nuxtjs/tailwindcss',
    // https://www.npmjs.com/package/@nuxtjs/fontawesome
    ['@nuxtjs/fontawesome', {
      icons: {
        solid: true
      }
    }]
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    '@nuxtjs/proxy', // use proxy against all APIs to circumvent CORS validation issues
    '@nuxtjs/style-resources',
    '@nuxtjs/toast'
  ],

  // server middleware with API proxies
  serverMiddleware: [
    // Will register file from project server-middleware directory to handle /server-middleware/* requires
    { path: '/api/ai', handler: '~/server-middleware/ai/api.js' },
    { path: '/api/camunda', handler: '~/server-middleware/camunda/api.js' },
    { path: '/api/camunda/message', handler: '~/server-middleware/camunda/api-message.js' },
    { path: '/api/store', handler: '~/server-middleware/store/api-init.js' },
    { path: '/api/store', handler: '~/server-middleware/store/api-employees.js' },
    { path: '/api/store', handler: '~/server-middleware/store/api-job-ads.js' },
    { path: '/api/publish', handler: '~/server-middleware/publish/api.js' }
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {},

  // config for module: @nuxtjs/proxy - see https://github.com/nuxt-community/proxy-module
  proxy: {
    // API request 1: search semantically related publications
    '/api/v1/search': {
      target: API_BASE_URL,
      pathRewrite: {
        '^/api/v1': ''
      },
      ws: false,
      secure: false,
      proxyTimeout: 60000,
      timeout: 60000,
      followRedirects: false
    },
    '/api/v1/refine': {
      target: API_BASE_URL,
      pathRewrite: {
        '^/api/v1': ''
      },
      ws: false,
      secure: false,
      proxyTimeout: 60000,
      timeout: 60000,
      followRedirects: false
    },
    '/api/v1/resolve': {
      target: API_BASE_URL,
      pathRewrite: {
        '^/api/v1': ''
      },
      ws: false,
      secure: false,
      proxyTimeout: 60000,
      timeout: 60000,
      followRedirects: false
    }
  },

  styleResources: {},

  toast: {
    position: 'top-right' // default position for toasts
  },

  // Nuxt router config
  router: {
    base: '/'
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    babel: {
      plugins: [
        ['@babel/plugin-proposal-private-methods', { loose: true }]
      ]
    },
    postcss: {
      plugins: {
        'postcss-custom-properties': false
      }
    }
  }
}
