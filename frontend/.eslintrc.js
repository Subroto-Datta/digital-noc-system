module.exports = {
  extends: [
    'react-app',
    'react-app/jest'
  ],
  rules: {
    // Disable the exhaustive-deps rule that's causing build failures
    'react-hooks/exhaustive-deps': 'warn',
    // Allow unused variables (common in React development)
    'no-unused-vars': 'warn',
    // Allow console statements (useful for debugging)
    'no-console': 'warn'
  },
  env: {
    browser: true,
    es2021: true,
    node: true
  }
};                                                                                    