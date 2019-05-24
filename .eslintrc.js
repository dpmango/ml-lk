module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: ['plugin:vue/essential', '@vue/airbnb', 'prettier', 'prettier/vue'],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'global-require': 0,
    'max-len': 0,
    'arrow-parens': 0,
    'no-param-reassign': ['error', { props: false }],
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
};
