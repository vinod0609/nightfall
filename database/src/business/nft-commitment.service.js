import { COLLECTIONS } from '../common/constants';
import { nftCommitmentMapper } from '../mappers';
import NftCommitmentTransactionService from './nft-commitment-transaction.service';

export default class NftCommitmentService {
  constructor (_db) {
    this.db = _db;
    this.nftCommitmentTransactionService = new NftCommitmentTransactionService(_db);
  }

  async addNewToken (data) {
    const { isReceived } = data;
    const mappedData = nftCommitmentMapper(data);

    await this.db.saveData(COLLECTIONS.NFT_COMMITMENT, mappedData);

    if (isReceived)
      return this.nftCommitmentTransactionService.insertTransaction({
        ...mappedData,
        type: 'received',
      });

    return this.nftCommitmentTransactionService.insertTransaction({
      ...mappedData,
      type: 'minted',
    });
  }

  async updateToken (data) {
    const { tokenId, isBurned } = data;
    const mappedData = nftCommitmentMapper(data);

    await this.db.updateData(
      COLLECTIONS.NFT_COMMITMENT,
      {
        token_id: tokenId,
        is_transferred: { $exists: false },
      },
      { $set: mappedData },
    );

    if (isBurned)
      return this.nftCommitmentTransactionService.insertTransaction({
        ...mappedData,
        type: 'burned',
      });

    return this.nftCommitmentTransactionService.insertTransaction({
      ...mappedData,
      type: 'transferred',
    });
  }

  getToken (pageination) {
    if (!pageination || !pageination.pageNo || !pageination.limit) {
      return this.db.getData(COLLECTIONS.NFT_COMMITMENT, {
        is_transferred: { $exists: false },
        is_burned: { $exists: false },
      });
    }
    const { pageNo, limit } = pageination;
    return this.db.getDbData(
      COLLECTIONS.NFT_COMMITMENT,
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
    return this.nftCommitmentTransactionService.getTransactions(query);
  }
}
