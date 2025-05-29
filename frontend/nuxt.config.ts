// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  ssr: false,
  devtools: { enabled: false },
  modules: [
    "@pinia/nuxt"
  ],
  app: {
    head: {
      link: [
        {
          rel: 'stylesheet',
          href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css'
        }
      ]
    }
  },
  vite: {
    server: {
      watch: {
        usePolling: true, // Required for HMR to work in Docker
      },
      hmr: {
        host: 'localhost',  // Adjust if necessary (e.g., frontend)
        port: 3000,
      },
    },
    plugins: [
      // Disable vite-plugin-checker to avoid vue-tsc dependency
      {
        name: 'disable-checker',
        config() {
          return {
            checker: false
          }
        }
      }
    ]
  },
  typescript: {
    typeCheck: false, // Disable type checking during development
    strict: true,
    shim: false
  }
});
