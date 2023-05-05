module.exports = {
  ...require('@shared/eslint-presets/server'),
  parserOptions: {
    root: true,
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json'],
  },
}
