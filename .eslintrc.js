module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: ['standard'],
  rules: {
    'no-redeclare': 2,
    eqeqeq: 2,
    'no-mixed-spaces-and-tabs': 'off',
    'no-tabs': 'off',
    'no-console': 'off',
    'no-debugger': 'off'
  },
  parserOptions: {
    parser: 'babel-eslint'
  },
  overrides: [
    {
      files: [
        '**/__tests__/*.{j,t}s?(x)',
        '**/tests/unit/**/*.spec.{j,t}s?(x)'
      ]
    }
  ]
}
