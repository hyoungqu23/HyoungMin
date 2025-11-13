module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'next/core-web-vitals',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'unused-imports', 'import'],
  rules: {
    '@typescript-eslint/consistent-type-imports': 'warn',
    'unused-imports/no-unused-imports': 'warn',
    'import/order': ['warn', { 'newlines-between': 'always', alphabetize: { order: 'asc' } }],
    'no-console': ['warn', { allow: ['error', 'warn'] }],
  },
  overrides: [{ files: ['**/*.mdx'], parser: 'eslint-mdx' }],
};

