// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  ssr: true,
  devtools: { enabled: false },
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
  },
});
