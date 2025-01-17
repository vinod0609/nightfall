import request from 'request';
import config from 'config';

const url = config.get('database.url');

const requestWrapper = options =>
  new Promise(function promiseHandler(resolve, reject) {
    request(options, function responseHandler(err, res, body) {
      if (err || res.statusCode === 500) {
        return reject(err || res.body);
      }
      return resolve(body.data);
    });
  });

/*
 * rest calls to database microservice
 */
export default {
  // insert user data intro user collection
  createAccount(body) {
    const options = {
      url: `${url}/createAccount`,
      method: 'POST',
      json: true,
      body,
    };
    return requestWrapper(options);
  },

  // verify password while fetching from user collection
  login(body) {
    const options = {
      url: `${url}/login`,
      method: 'POST',
      body,
      json: true,
    };
    return requestWrapper(options);
  },

  // fetch logged in user info from. user collection
  fetchUser({ name }, qs) {
    const options = {
      url: `${url}/user`,
      method: 'GET',
      json: true,
      headers: { name },
      qs,
    };
    return requestWrapper(options);
  },

  // add anonymous one time used account to user collection
  updateUserWithPrivateAccount({ name }, body) {
    const options = {
      url: `${url}/privateAccount`,
      method: 'POST',
      headers: { name },
      json: true,
      body,
    };
    return requestWrapper(options);
  },

  // get user's whisper key from user collection
  getWhisperIdentity({ name }) {
    const options = {
      url: `${url}/user/whisperIdentity`,
      method: 'GET',
      headers: { name },
      json: true,
    };
    return requestWrapper(options);
  },

  // update user's whisper key in user collection
  updateWhisperIdentity({ name }, body) {
    const options = {
      url: `${url}/user/whisperIdentity`,
      method: 'PATCH',
      headers: { name },
      json: true,
      body,
    };
    return requestWrapper(options);
  },

  // insert non-fungible token info in nft collection
  addNFToken({ name }, body) {
    const options = {
      url: `${url}/nft`,
      method: 'POST',
      json: true,
      headers: { name },
      body,
    };
    return requestWrapper(options);
  },

  // update non-fungible token info in nft collection
  updateNFToken({ name }, body) {
    const options = {
      url: `${url}/nft`,
      method: 'PATCH',
      json: true,
      headers: { name },
      body,
    };
    return requestWrapper(options);
  },

  // fetch non-fungible token by tokenId.
  getNFTokenByTokenId({ name }, tokenId) {
    const options = {
      url: `${url}/nft/`,
      method: 'GET',
      json: true,
      headers: { name },
      qs: { tokenId },
    };
    return requestWrapper(options);
  },

  // fetch non-fungible tokens
  getNFTokens({ name }, qs) {
    const options = {
      url: `${url}/nft`,
      method: 'GET',
      json: true,
      headers: { name },
      qs,
    };
    return requestWrapper(options);
  },

  // insert non-fungible token commitment info in nft_commitment collection
  addToken({ name }, body) {
    const options = {
      url: `${url}/token`,
      method: 'POST',
      json: true,
      headers: { name },
      body,
    };
    return requestWrapper(options);
  },

  // update non-fungible token commitment info in nft_commitment collection
  updateToken({ name }, body) {
    const options = {
      url: `${url}/token`,
      method: 'PATCH',
      json: true,
      headers: { name },
      body,
    };
    return requestWrapper(options);
  },

  // insert fungible token trantion info in ft_transaction collection
  addFTTransaction({ name }, body) {
    const options = {
      url: `${url}/ft/transaction`,
      method: 'POST',
      json: true,
      headers: { name },
      body,
    };
    return requestWrapper(options);
  },

  // insert fungible token commitment info in ft_commitment collection
  addCoin({ name }, body) {
    const options = {
      url: `${url}/coin`,
      method: 'POST',
      json: true,
      headers: { name },
      body,
    };
    return requestWrapper(options);
  },

  // update fungible token commitment info in ft_commitment collection
  updateCoin({ name }, body) {
    const options = {
      url: `${url}/coin`,
      method: 'PATCH',
      json: true,
      headers: { name },
      body,
    };
    return requestWrapper(options);
  },

  // insert fungible token commitment transaction info in ft_commitment_transaction collection
  addCoinTransaction({ name }, body) {
    const options = {
      url: `${url}/coin/transaction`,
      method: 'POST',
      json: true,
      headers: { name },
      body,
    };
    return requestWrapper(options);
  },

  // insert new coin shield contract info for user in user collection
  addCoinShieldContractAddress({ name }, body) {
    const options = {
      url: `${url}/user/coinShield`,
      method: 'POST',
      headers: { name },
      json: true,
      body,
    };
    return requestWrapper(options);
  },

  // update coin shield contract info for user in user collection
  updateCoinShieldContractAddress({ name }, body) {
    const options = {
      url: `${url}/user/coinShield`,
      method: 'PUT',
      headers: { name },
      json: true,
      body,
    };
    return requestWrapper(options);
  },

  // delete coin shield contract info for user from user collection
  deleteCoinShieldContractAddress({ name }, qs) {
    const options = {
      url: `${url}/user/coinShield`,
      method: 'DELETE',
      headers: { name },
      json: true,
      qs,
    };
    return requestWrapper(options);
  },

  // insert new token shield contract info for user in user collection
  addTokenShieldContractAddress({ name }, body) {
    const options = {
      url: `${url}/user/tokenShield`,
      method: 'POST',
      headers: { name },
      json: true,
      body,
    };
    return requestWrapper(options);
  },

  // update token shield contract info for user in user collection
  updateTokenShieldContractAddress({ name }, body) {
    const options = {
      url: `${url}/user/tokenShield`,
      method: 'PUT',
      headers: { name },
      json: true,
      body,
    };
    return requestWrapper(options);
  },

  // delete token shield contract info for user from user collection
  deleteTokenShieldContractAddress({ name }, qs) {
    const options = {
      url: `${url}/user/tokenShield`,
      method: 'DELETE',
      headers: { name },
      json: true,
      qs,
    };
    return requestWrapper(options);
  },
};
