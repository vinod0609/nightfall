import commonConfig from './common-config'

module.exports = {
  ...commonConfig,
  zkp: {
    app: {
      host: 'http://zkp_test',
      port: '80',
    },
    rpc: {
      host: 'http://ganache_test',
      port: '8545',
    },
    volume: 'nightfall_zkp_code_test'
  },
};