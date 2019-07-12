import { COLLECTIONS } from '../common/constants';

export default class TokenTransactionService {
  constructor (_db) {
    this.db = _db;
  }

  insertTransaction ({
    type,
    token_uri,
    token_id,
    salt,
    token_commitment,
    token_commitment_index,
    transferee,
    transferee_public_key,
    transferee_salt,
    transferee_token_commitment,
    transferee_token_commitment_index,
  }) {
    return this.db.saveData(COLLECTIONS.TOKEN_TRANSACTION, {
      type,
      token_uri,
      token_id,
      salt,
      token_commitment,
      token_commitment_index,
      transferee,
      transferee_public_key,
      transferee_salt,
      transferee_token_commitment,
      transferee_token_commitment_index,
    });
  }

  getTransactions (query) {
    const { pageNo, limit } = query;
    return this.db.getDbData (
      COLLECTIONS.TOKEN_TRANSACTION,
      {},
      undefined,
      { created_at: -1 },
      parseInt(pageNo),
      parseInt(limit),
    );
  }
}
