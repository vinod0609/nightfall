import { COLLECTIONS } from '../common/constants';

export default class PublicTokenTransactionService {
  constructor (_db) {
    this.db = _db;
  }

  insertTransaction ({
    uri,
    token_id,
    shield_contract_address,
    type,
    transferor,
    transferor_address,
    transferee,
    transferee_address,
  }) {
    return this.db.saveData(COLLECTIONS.PUBLIC_TOKEN_TRANSACTION, {
      uri,
      token_id,
      shield_contract_address,
      type,
      transferor,
      transferor_address,
      transferee,
      transferee_address,
    });
  }

  getTransactions (query) {
    const { pageNo, limit } = query;
    return this.db.getDbData(
      COLLECTIONS.PUBLIC_TOKEN_TRANSACTION,
      {},
      undefined,
      { created_at: -1 },
      parseInt(pageNo),
      parseInt(limit),
    );
  }
}
