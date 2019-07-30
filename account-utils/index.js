/* eslint-disable import/prefer-default-export */

import Web3 from 'web3';

const web3 = new Web3(new Web3.providers.HttpProvider('http://ganache:8545'));

export const getEthAccounts = () => web3.eth.getAccounts();
