module.exports = {
  env: {
    browser: true,
    node: true,
  },
  extends: [
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
    // allow tsx syntax in ts files
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
    // simple import rules
    'simple-import-sort/imports': 'warn',
    'simple-import-sort/exports': 'warn',
    'import/first': 'warn',
    'import/newline-after-import': 'warn',
    'import/no-duplicates': 'error',
    'react/function-component-definition': 'off',
    // next link fix
    'jsx-a11y/anchor-is-valid': 'off',
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
    'coverage',
    'dist',
    '.turbo',
  ],
}
