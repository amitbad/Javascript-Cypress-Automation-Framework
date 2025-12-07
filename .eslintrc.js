module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
    'cypress/globals': true
  },
  extends: [
    'eslint:recommended',
    'plugin:cypress/recommended'
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  plugins: [
    'cypress'
  ],
  rules: {
    'no-unused-vars': 'warn',
    'no-console': 'off',
    'cypress/no-unnecessary-waiting': 'warn',
    'cypress/assertion-before-screenshot': 'warn',
    'cypress/no-assigning-return-values': 'error',
    'cypress/no-async-tests': 'error'
  },
  globals: {
    cy: 'readonly',
    Cypress: 'readonly',
    expect: 'readonly',
    assert: 'readonly'
  }
};
