module.exports = {
  env: {
    browser: true,
    node: true,
  },
  extends: [
    'next',
    'airbnb',
    'airbnb-typescript',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'prettier',
  ],
  plugins: ['@typescript-eslint', 'import', 'simple-import-sort'],
  settings: {
    next: {
      rootDir: ['apps/*/', 'packages/*/'],
    },
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
        project: ['apps/*/tsconfig.json'],
      },
    },
  },
  rules: {
    // suppress errors for missing semicolons
    semi: ['error', 'never'],
    '@typescript-eslint/semi': 'off',
    'no-unexpected-multiline': 'error',
    // suppress errors for missing 'import React' in files
    'react/react-in-jsx-scope': 'off',
    // allow tsx syntax in ts files (for next.js project)
    'react/jsx-filename-extension': [1, { extensions: ['.ts', '.tsx'] }],
    // suppress errors for props spreading
    'react/jsx-props-no-spreading': 'off',
    // suppress errors for tailwindcss being only in devDeps
    'import/no-extraneous-dependencies': 'off',
    // suppress errors for nested ternaries
    'no-nested-ternary': 'off',
    'no-param-reassign': 'off',
    // export styling
    'import/prefer-default-export': 'off',
    // next
    '@next/next/no-html-link-for-pages': 'off',
    '@next/next/no-img-element': 'off',
    // simple import rules
    'simple-import-sort/imports': 'warn',
    'simple-import-sort/exports': 'warn',
    'import/first': 'warn',
    'import/newline-after-import': 'warn',
    'import/no-duplicates': 'error',
    // fix for next link
    'jsx-a11y/anchor-is-valid': 'off',
    'import/no-import-module-exports': 'off',
    'react/no-unescaped-entities': 'off',
    // dumb
    'react-hooks/exhaustive-deps': 'off',
  },
  overrides: [
    {
      // 3) Now we enable eslint-plugin-testing-library rules or preset only for matching files!
      env: {
        jest: true,
      },
      files: [
        '**/__tests__/**/*.[jt]src?(x)',
        '**/?(*.)+(spec|test).[jt]src?(x)',
      ],
      extends: ['plugin:testing-library/react', 'plugin:jest/recommended'],
      rules: {
        'import/no-extraneous-dependencies': [
          'off',
          { devDependencies: ['**/?(*.)+(spec|test).[jt]src?(x)'] },
        ],
      },
    },
  ],
  ignorePatterns: [
    '**/*.js',
    '**/*.json',
    'node_modules',
    'public',
    'styles',
    '.next',
    'coverage',
    'dist',
    '.turbo',
  ],
}
