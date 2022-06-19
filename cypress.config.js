module.exports = {
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
    baseUrl: 'http://localhost:3333',
    specPattern: 'cypress/e2e/**/*.{js,jsx,ts,tsx}',
  },
}
