
import commonConfig from './common-config'

module.exports = {
  ...commonConfig,
  zkp: {
    app: {
      host: 'http://zkp',
      port: '80',
    },
    rpc: {
      host: 'http://ganache',
      port: '8545',
    },
    volume: 'nightfall_zkp-code'
  },
};