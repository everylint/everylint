// add error rules
// pass config, add merge with default one

export default {
  // useEslintrc: false,
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
  },
  env: {
    browser: true,
    node: true,
  },
  extends: 'eslint:recommended',
  plugins: ['markdown', 'html'],
  rules: {
    'no-console': 'error',
  }
};
