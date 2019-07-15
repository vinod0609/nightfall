import { exec } from 'child_process';
import { getProps } from '../config';
import { COLLECTIONS } from '../common/constants';
import { userMapper } from '../mappers';

const { mongo } = getProps();

function updateUserRole () {
  return new Promise(function (resolve, reject) {
    exec(
      `mongo nightfall --host=mongo -u ${mongo.admin} -p ${
        mongo.adminPassword
      } setup-mongo-acl-for-new-users.js`,
      function (err) {
        if (err) return reject(err);
        return resolve();
      },
    );
  });
}

export default class AccountService {
  constructor (_db) {
    this.db = _db;
  }

  /**
   * This function returns a user matching a public key
   * @param {object} options - an object containing public key
   * @returns {object} a user document matching the public key
   */
  getUser (options) {
    return this.db.findOne(COLLECTIONS.USER, options);
  }

  /**
   * This function will create a user document
   * @param {object} data - data contains user details
   * @returns {object} a user object
   */
  async createAccount (data) {
    const mappedData = await userMapper(data);
    await this.db.addUser(data.name, data.password);
    await updateUserRole();
    return this.db.saveData(COLLECTIONS.USER, mappedData);
  }

  /**
   * This function will return all the user collection
   * @returns {array} a user collection
   */
  async getUsers () {
    return this.db.getData(COLLECTIONS.USER, {});
  }

  /**
   * This fucntion is used to add private ethereum accounts to a public account
   * @param {string} account - public accunt
   * @param {object} privateAccountDetails - contains ethereum private account and password
   * @returns {string} a account
   */
  async updateUserWithPrivateAccount (privateAccountDetails) {
    const updateData = {
      $push: {
        accounts: {
          address: privateAccountDetails.address,
          password: privateAccountDetails.password,
        },
      },
    };
    await this.db.updateData(COLLECTIONS.USER, {}, updateData);
    return privateAccountDetails.address;
  }

  /**
   * This function will return all the private ethereum accounts assocated with a public ethereum account
   * @param {object} headers - req object header
   * @returns {array} all private accounts
   */
  getPrivateAccounts (headers) {
    const condition = { address: headers.address };
    return this.db.getData(COLLECTIONS.USER, condition);
  }

  /**
   * This function is used to get details of a private acocunts
   * @param {string} account - private ethereum account
   * @returns {object} a matched private account details
   */
  async getPrivateAccountDetails (account) {
    const condition = {
      'accounts.address': account,
    };
    const projection = {
      'accounts.$': 1,
    };
    const [{ accounts }] = await this.db.getData(COLLECTIONS.USER, condition, projection);
    return accounts[0];
  }

  updateWhisperIdentity (shhIdentity) {
    return this.db.updateData(
      COLLECTIONS.USER,
      {},
      {
        shh_identity: shhIdentity,
      },
    );
  }

  async getWhisperIdentity () {
    const users = await this.db.getData(COLLECTIONS.USER);
    const shhIdentity = users[0].shh_identity || '';
    return Promise.resolve({ shhIdentity });
  }

  async addCoinShieldContractAddress ({ contract_name, contract_address }) {
    await this.db.updateData(
      COLLECTIONS.USER,
      {
        'coin_shield_contracts.contract_address': { $ne: contract_address },
      },
      {
        $push: {
          coin_shield_contracts: {
            contract_name,
            contract_address,
          },
        },
      },
    );
    await this.selectCoinShieldContractAddress({ contract_address });
  }

  async updateCoinShieldContractAddress ({
    contract_name,
    contract_address,
    isSelected,
    isCoinShieldPreviousSelected,
  }) {
    await this.db.updateData(
      COLLECTIONS.USER,
      {
        'coin_shield_contracts.contract_address': contract_address,
      },
      {
        $set: {
          [contract_name !== undefined
            ? 'coin_shield_contracts.$.contract_name'
            : undefined]: contract_name,
        },
      },
    );
    if (isSelected) await this.selectCoinShieldContractAddress({ contract_address });
    else if (isCoinShieldPreviousSelected)
      await this.selectCoinShieldContractAddress({ contract_address: null });
  }

  selectCoinShieldContractAddress ({ contract_address }) {
    return this.db.updateData(
      COLLECTIONS.USER,
      {},
      {
        selected_coin_shield_contract: contract_address,
      },
    );
  }

  async deleteCoinShieldContractAddress ({ contract_address }) {
    await this.db.updateData(
      COLLECTIONS.USER,
      {},
      {
        $pull: {
          coin_shield_contracts: { contract_address },
        },
      },
    );

    const toUpdate = await this.db.findOne(COLLECTIONS.USER, {
      selected_coin_shield_contract: contract_address,
    });

    if (!toUpdate) return null;
    await this.selectCoinShieldContractAddress({ contract_address: null });
    return toUpdate;
  }

  async addTokenShieldContractAddress ({ contract_name, contract_address }) {
    await this.db.updateData(
      COLLECTIONS.USER,
      {
        'token_shield_contracts.contract_address': { $ne: contract_address },
      },
      {
        $push: {
          token_shield_contracts: {
            contract_name,
            contract_address,
          },
        },
      },
    );
    await this.selectTokenShieldContractAddress({ contract_address });
  }

  async updateTokenShieldContractAddress ({
    contract_name,
    contract_address,
    isSelected,
    isTokenShieldPreviousSelected,
  }) {
    await this.db.updateData(
      COLLECTIONS.USER,
      {
        'token_shield_contracts.contract_address': contract_address,
      },
      {
        $set: {
          [contract_name !== undefined
            ? 'token_shield_contracts.$.contract_name'
            : undefined]: contract_name,
        },
      },
    );
    if (isSelected) await this.selectTokenShieldContractAddress({ contract_address });
    else if (isTokenShieldPreviousSelected)
      await this.selectTokenShieldContractAddress({ contract_address: null });
  }

  selectTokenShieldContractAddress ({ contract_address }) {
    return this.db.updateData(
      COLLECTIONS.USER,
      {},
      {
        selected_token_shield_contract: contract_address,
      },
    );
  }

  async deleteTokenShieldContractAddress ({ contract_address }) {
    await this.db.updateData(
      COLLECTIONS.USER,
      {},
      {
        $pull: {
          token_shield_contracts: { contract_address },
        },
      },
    );

    const toUpdate = await this.db.findOne(COLLECTIONS.USER, {
      selected_token_shield_contract: contract_address,
    });

    if (!toUpdate) return null;
    await this.selectTokenShieldContractAddress({ contract_address: null });
    return toUpdate;
  }
}
