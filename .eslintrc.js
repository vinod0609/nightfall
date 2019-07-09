module.exports = {
  extends: ['codfish', 'codfish/docker', 'codfish/dapp'],
  root: true,
  rules: {
    'no-console': 'off',
    'space-before-function-paren': 'off',
    'no-use-before-define': 'off',
    // 'prettier/prettier': 'off',   // make prettier config off
    'quotes': ['error', 'single'],
    'comma-dangle': ['error', 'always'],
  }
};
