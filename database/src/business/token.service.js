import { COLLECTIONS } from '../common/constants';
import tokenMapper from '../mappers/token';
import { Erc721TransactionService, Erc721CommitmentTransactionService } from '.';

export default class TokenService {
  constructor (_db) {
    this.db = _db;
    this.erc721TransactionService = new Erc721TransactionService(_db);
    this.erc721CommitmentTransactionService = new Erc721CommitmentTransactionService(_db);
  }

  // nft
  async addNFToken (data) {
    const { is_received } = data;
    await this.db.saveData(COLLECTIONS.PUBLIC_TOKEN, data);

    if (is_received)
      return this.erc721TransactionService.insertTransaction({
        ...data,
        type: 'received',
      });

    return this.erc721TransactionService.insertTransaction({
      ...data,
      type: 'minted',
    });
  }

  async updateNFToken (data) {
    const { token_id, is_burned, is_shielded } = data;

    await this.db.updateData(
      COLLECTIONS.PUBLIC_TOKEN,
      {
        token_id,
        is_transferred: { $exists: false },
        is_shielded: false,
      },
      { $set: data },
    );

    if (is_burned)
      return this.erc721TransactionService.insertTransaction({
        ...data,
        type: 'burned',
      });
    if (is_shielded)
      return this.erc721TransactionService.insertTransaction({
        ...data,
        type: 'shielded',
      });

    return this.erc721TransactionService.insertTransaction({
      ...data,
      type: 'transferred',
    });
  }

  getNFTokens (query) {
    if (!query || !query.pageNo || !query.limit) {
      return this.db.getData(COLLECTIONS.PUBLIC_TOKEN, {
        shield_contract_address: query.shield_contract_address
          ? query.shield_contract_address
          : null,
        is_transferred: { $exists: false },
        is_burned: { $exists: false },
        is_shielded: false,
      });
    }
    const { pageNo, limit } = query;
    return this.db.getDbData(
      COLLECTIONS.PUBLIC_TOKEN,
      {
        shield_contract_address: query.shield_contract_address
          ? query.shield_contract_address
          : null,
        is_transferred: { $exists: false },
        is_burned: { $exists: false },
        is_shielded: false,
      },
      undefined,
      { created_at: -1 },
      parseInt(pageNo),
      parseInt(limit),
    );
  }

  getNFToken (token_id) {
    return this.db.findOne(COLLECTIONS.PUBLIC_TOKEN, {
      token_id,
      is_transferred: { $exists: false },
    });
  }

  getNFTTransactions (query) {
    return this.erc721TransactionService.getTransactions(query);
  }

  // private token
  async addNewToken (data) {
    await this.db.saveData(COLLECTIONS.TOKEN, tokenMapper(data));

    const { is_received } = data;

    if (is_received)
      return this.erc721CommitmentTransactionService.insertTransaction({
        ...tokenMapper(data),
        type: 'received',
      });

    return this.erc721CommitmentTransactionService.insertTransaction({
      ...tokenMapper(data),
      type: 'mint',
    });
  }

  async updateToken (data) {
    const { A, is_burned } = data;

    await this.db.updateData(
      COLLECTIONS.TOKEN,
      {
        token_id: A,
        is_transferred: { $exists: false },
      },
      { $set: tokenMapper(data) },
    );

    if (is_burned)
      return this.erc721CommitmentTransactionService.insertTransaction({
        ...tokenMapper(data),
        type: 'burned',
      });

    return this.erc721CommitmentTransactionService.insertTransaction({
      ...tokenMapper(data),
      type: 'transfer',
    });
  }

  getToken (pageination) {
    if (!pageination || !pageination.pageNo || !pageination.limit) {
      return this.db.getData(COLLECTIONS.TOKEN, {
        is_transferred: { $exists: false },
        is_burned: { $exists: false },
      });
    }
    const { pageNo, limit } = pageination;
    return this.db.getDbData(
      COLLECTIONS.TOKEN,
      {
        is_transferred: { $exists: false },
        is_burned: { $exists: false },
      },
      undefined,
      { created_at: -1 },
      parseInt(pageNo),
      parseInt(limit),
    );
  }

  getPrivateTokenTransactions (query) {
    return this.erc721CommitmentTransactionService.getTransactions(query);
  }
}
