module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'plugin:vue/vue3-recommended',
    'eslint:recommended',
    'prettier',
    'prettier/vue',
    'plugin:prettier/recommended',
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
    parser: 'babel-eslint',
  },
  plugins: ['vue'],
  rules: {
    semi: ['error', 'always'],
    'vue/no-multiple-template-root': 'off',
    'import/no-unresolved': 'off',
    'import/extensions': 'off',
    'implicit-arrow-linebreak': 'off',
    'import/prefer-default-export': 'off',
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
        endOfLine: 'auto',
        semi: true,
        trailingComma: 'all',
      },
    ],
    'no-console': 'warn',
    'no-debugger': 'warn',
  },
};
