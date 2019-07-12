import Response from './response/response';
import { Erc721Service } from '../business';

// initializing routes
export function init (router) {
  // public non-fungible tokens
  router
    .route('/nft')
    .post(addNFToken)
    .patch(updateNFToken)
    .get(getNFTokens);

  router.route('/nft/transaction').get(getNFTTransactions);
  router.route('/nft/:token_id').get(getNFToken);

  // private non-fungible tokens
  router
    .route('/token')
    .post(addTokenHandler)
    .get(getTokenHandler)
    .patch(updateTokenHandler);

  router.route('/token/transaction').get(getPrivateTokenTransactions);
}

// public non-fungible tokens
/**
 * This function will add new ERC 721 token in db.
 * req.body {
 *  uri: 'table/t1',
 *  token_id: '0xa23..',
 *  shield_contract_address: '0x12b..',
 *  is_minted: true,
 *  is_received: true,
 *  transferor: 'alice',    [will be only present if is_received = true]
 *  transferor_address: '0x34a'    [will be only present if is_received = true]
 * }
 * 'is_minted' or 'is_received' one at time will be present
 *  depending on new token is minted one or transferred one
 * @param {*} req
 * @param {*} res
 */
async function addNFToken (req, res, next) {
  try {
    const erc721Service = new Erc721Service(req.user.db);
    await erc721Service.addNFToken(req.body);
    const response = new Response(200, { message: 'inserted' }, null);
    res.json(response);
  } catch (err) {
    const response = new Response(500, null, { message: err.message });
    res.status(500).json(response);
    next(err);
  }
}

/**
 * This function will update ERC 721 token in db.
 * req.body {
 *  uri: 'table/t1',
 *  token_id: '0xa23..',
 *  shield_contract_address: '0x12b..',
 *  transferee: 'bob'   [will be only present if is_transferred = true]
 *  transferee_address: '0x34a'   [will be only present if is_transferred = true]
 *  is_transferred: true,
 *  is_burned: true,
 *  is_shielded: true
 * }
 * 'is_transferred' or 'is_burned' or 'is_shielded' - one at time will be present
 *  depending on what kind of operation performend on the token.
 * @param {*} req
 * @param {*} res
 */
async function updateNFToken (req, res, next) {
  try {
    const erc721Service = new Erc721Service(req.user.db);
    await erc721Service.updateNFToken(req.body);
    const response = new Response(200, { message: 'updated' }, null);
    res.json(response);
  } catch (err) {
    const response = new Response(500, null, { message: err.message });
    res.status(500).json(response);
    next(err);
  }
}

/**
 * This method to list down all public NFT Tokens (ERC 721)
 * with or without pagination.
 * if pagination "pageNo" and "limit" will be present
 * otherwise not.
 * req.query {
 *  pageNo: 1,
 *  limit: 5,
 *  shield_contract_address: '0x54C..'
 * }
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
async function getNFTokens (req, res, next) {
  try {
    const erc721Service = new Erc721Service(req.user.db);
    const tokens = await erc721Service.getNFTokens(req.query);
    const response = new Response(200, tokens, null);
    res.json(response);
  } catch (err) {
    const response = new Response(500, null, { message: err.message });
    res.status(500).json(response);
    next(err);
  }
}

/**
 * This function returns all the ERC 721 tokens transactions.
 * req.query {
 *  pageNo: 1,
 *  limit: 5
 * }
 * @param {*} req
 * @param {*} res
 */
async function getNFTTransactions (req, res, next) {
  const erc721Service = new Erc721Service(req.user.db);
  try {
    const transactions = await erc721Service.getNFTTransactions(req.query);
    const response = new Response(200, transactions, null);
    res.json(response);
  } catch (err) {
    const response = new Response(500, null, { message: err.message });
    res.status(500).json(response);
    next(err);
  }
}

/**
 * This function returns a specfic ERC 721 token by token_id, to get its detail.
 * req.params {
 *  token_id: '0xa23..'
 * }
 * @param {*} req
 * @param {*} res
 */
async function getNFToken (req, res, next) {
  try {
    const erc721Service = new Erc721Service(req.user.db);
    const token = await erc721Service.getNFToken(req.params.token_id);
    const response = new Response(200, { token }, null);
    res.json(response);
  } catch (err) {
    const response = new Response(500, null, { message: err.message });
    res.status(500).json(response);
    next(err);
  }
}

// private non-fungible tokens
/**
 * This function will add new private token in db.
 * req.body {
 *  A: '0xa23..',
 *  tokenUri: 'table/t1',
 *  S_A: '0xE9A313C89C449AF6E630C25AB3ACC0FC3BAB821638E0D55599B518',
 *  z_A: '0xca2c0c099289896be4d72c74f801bed6e4b2cd5297bfcf29325484',
 *  z_A_index: 0,
 *  is_minted: true
 *  is_received: true,
 * }
 * 'is_minted' or 'is_received' one at time will be present
 *  depending on new token is minted one or transferred one
 * @param {*} req
 * @param {*} res
 */
async function addTokenHandler (req, res, next) {
  try {
    const erc721Service = new Erc721Service(req.user.db);
    await erc721Service.addNewToken(req.body);
    const response = new Response(200, { message: 'inserted' }, null);
    res.json(response);
  } catch (err) {
    console.log(err);
    const response = new Response(500, null, { message: err.message });
    res.status(500).json(response);
    next(err);
  }
}

/**
 * This function returns all the available private tokens
 * req.query {
 *  pageNo: 1,
 *  limit: 5
 * }
 * @param {*} req
 * @param {*} res
 */
async function getTokenHandler (req, res, next) {
  const erc721Service = new Erc721Service(req.user.db);
  try {
    const tokens = await erc721Service.getToken(req.query);
    const response = new Response(200, tokens, null);
    res.json(response);
  } catch (err) {
    const response = new Response(500, null, { message: err.message });
    res.status(500).json(response);
    next(err);
  }
}

/**
 * This function will update a private token in db.
 * req.body {
 *  A: '0xa23..',
 *  tokenUri: 'table/t1',
 *  S_A: '0xE9A313C89C449AF6E630C25AB3ACC0FC3BAB821638E0D55599B518',
 *  z_A: '0xca2c0c099289896be4d72c74f801bed6e4b2cd5297bfcf29325484',
 *  z_A_index: 0,
 *  S_B: '0xE9A313C89C449AF6E630C25AB3ACC0FC3BAB821638E0D55599B518',   [will be only present if is_transferred = true]
 *  z_B: '0xca2c0c099289896be4d72c74f801bed6e4b2cd5297bfcf29325484',   [will be only present if is_transferred = true]
 *  z_B_index: 1,                                                      [will be only present if is_transferred = true]
 *  receiver_name: 'bob',                                              [will be only present if is_transferred = true]
 *  pk_B: '0xebbabcc471780d9581451e1b2f03bb54638800dd441d1e5c2344f8',  [will be only present if is_transferred = true]
 *  is_transferred: true,
 *  is_burned: true
 * }
 * 'is_transferred' or 'is_burned' - one at time will be present
 *  depending on what kind of operation performend on the token.
 * @param {*} req
 * @param {*} res
 */
async function updateTokenHandler (req, res, next) {
  const erc721Service = new Erc721Service(req.user.db);
  try {
    await erc721Service.updateToken(req.body);
    const response = new Response(200, { message: 'updated' }, null);
    res.json(response);
  } catch (err) {
    const response = new Response(500, null, { message: err.message });
    res.status(500).json(response);
    next(err);
  }
}

/**
 * This function returns all the private tokens transactions.
 * req.query = { pageNo: 1, limit: 5}
 * @param {*} req
 * @param {*} res
 */
async function getPrivateTokenTransactions (req, res, next) {
  const erc721Service = new Erc721Service(req.user.db);
  try {
    const transactions = await erc721Service.getPrivateTokenTransactions(req.query);
    const response = new Response(200, transactions, null);
    res.json(response);
  } catch (err) {
    const response = new Response(500, null, { message: err.message });
    res.status(500).json(response);
    next(err);
  }
}
