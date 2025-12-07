const { defineConfig } = require('cypress');
const fs = require('fs');
const path = require('path');
const allureWriter = require('@shelex/cypress-allure-plugin/writer');

// Load environment-specific config
function loadEnvConfig(configFile) {
  const envConfigPath = path.resolve(__dirname, `cypress/config/${configFile}.json`);
  if (fs.existsSync(envConfigPath)) {
    return JSON.parse(fs.readFileSync(envConfigPath, 'utf-8'));
  }
  return {};
}

module.exports = defineConfig({
  // Project settings
  projectId: process.env.CYPRESS_PROJECT_ID || '',
  
  // Viewport settings
  viewportWidth: 1920,
  viewportHeight: 1080,
  
  // Timeouts
  defaultCommandTimeout: 10000,
  pageLoadTimeout: 60000,
  requestTimeout: 15000,
  responseTimeout: 30000,
  
  // Retries
  retries: {
    runMode: 2,
    openMode: 0
  },
  
  // Screenshots and Videos
  screenshotsFolder: 'cypress/screenshots',
  screenshotOnRunFailure: true,
  trashAssetsBeforeRuns: true,
  video: true,
  videosFolder: 'cypress/videos',
  videoCompression: 32,
  
  // Reporter configuration
  reporter: 'cypress-multi-reporters',
  reporterOptions: {
    reporterEnabled: 'mochawesome',
    mochawesomeReporterOptions: {
      reportDir: 'cypress/reports/mocha',
      quite: true,
      overwrite: false,
      html: false,
      json: true
    }
  },
  
  // Environment variables
  env: {
    allure: true,
    allureResultsPath: 'allure-results',
    grepFilterSpecs: true,
    grepOmitFiltered: true
  },
  
  e2e: {
    setupNodeEvents(on, config) {
      // Load environment-specific configuration
      const configFile = config.env.configFile || 'qa';
      const envConfig = loadEnvConfig(configFile);
      config = { ...config, ...envConfig };
      
      // Allure reporter setup
      allureWriter(on, config);
      
      // Register grep plugin
      require('@cypress/grep/src/plugin')(config);
      
      // Task for reading YAML files
      on('task', {
        readYamlFile(filePath) {
          const yaml = require('js-yaml');
          const absolutePath = path.resolve(__dirname, filePath);
          if (fs.existsSync(absolutePath)) {
            const fileContents = fs.readFileSync(absolutePath, 'utf8');
            return yaml.load(fileContents);
          }
          throw new Error(`YAML file not found: ${absolutePath}`);
        },
        
        log(message) {
          console.log(message);
          return null;
        },
        
        clearDownloads() {
          const downloadsFolder = path.resolve(__dirname, 'cypress/downloads');
          if (fs.existsSync(downloadsFolder)) {
            fs.readdirSync(downloadsFolder).forEach(file => {
              fs.unlinkSync(path.join(downloadsFolder, file));
            });
          }
          return null;
        }
      });
      
      // Screenshot on failure with custom naming
      on('after:screenshot', (details) => {
        console.log('Screenshot taken:', details.path);
        return details;
      });
      
      return config;
    },
    
    baseUrl: process.env.CYPRESS_BASE_URL || 'https://example.com',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/e2e.js',
    fixturesFolder: 'cypress/fixtures',
    experimentalRunAllSpecs: true,
    experimentalMemoryManagement: true,
    numTestsKeptInMemory: 5
  }
});
