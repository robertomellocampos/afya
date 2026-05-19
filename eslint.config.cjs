const { FlatCompat } = require('@eslint/eslintrc');
const js = require('@eslint/js');
const path = require('path');

const compat = new FlatCompat({
  baseDirectory: __dirname,
  resolvePluginsRelativeTo: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

const legacyConfig = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'prettier'],
  rules: {
    'no-shadow': 'off',
    'no-console': 'warn',
    'no-restricted-import': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/no-non-null-assertions': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/ban-types': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/no-shadow': ['error'],
    'import/no-unresolved': 'off',
    'import/no-extraneous-dependencies': 'off',
    'import/extensions': 'off',
    'import/prefer-default-export': 'off',
    '@typescript-eslint/no-namespace': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
        destructuredArrayIgnorePattern: '^_',
        ignoreRestSiblings: true,
      },
    ],
    '@typescript-eslint/no-unused-expressions': ['error', { allowTernary: true }],
    '@typescript-eslint/no-useless-constructor': 'error',
    'no-unreachable': 'error',
    'no-unreachable-loop': 'error',
    'no-useless-return': 'error',
    'no-lone-blocks': 'error',
    'no-extra-bind': 'error',
    'no-extra-label': 'error',
    'no-useless-rename': 'error',
    'no-self-compare': 'error',
    '@typescript-eslint/no-useless-empty-export': 'error',
  },
  settings: {
    'import/resolver': {
      typescript: {},
    },
  },
  ignorePatterns: ['replace-gc-envs.js'],
};

module.exports = [
  ...compat.config(legacyConfig),
  {
    files: ['prisma/seeds/**/*.ts'],
    rules: {
      'no-console': 'off',
    },
  },
];
