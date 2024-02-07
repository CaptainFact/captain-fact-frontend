const { defineConfig } = require('cypress')

module.exports = defineConfig({
  projectId: 'iivzis',
  videoUploadOnPasses: false,
  env: {
    CYPRESS_API_URL: 'http://localhost:4000',
    CYPRESS_USERNAME: 'Captain',
    CYPRESS_EMAIL: 'admin@captainfact.io',
    CYPRESS_PASSWORD: 'password',
    CYPRESS_ENVIRONMENT: 'dev',
  },
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      return require('./cypress/plugins/index.js')(on, config)
    },
    baseUrl: 'http://localhost:3333',
    specPattern: 'cypress/e2e/**/*.{js,jsx,ts,tsx}',
  },
})
