import { COLLECTIONS } from '../common/constants';
import { nftMapper } from '../mappers';
import NftTransactionService from './nft-transaction.service';

export default class NftService {
  constructor (_db) {
    this.db = _db;
    this.nftTransactionService = new NftTransactionService(_db);
  }

  async addNFToken (data) {
    const { isReceived } = data;
    const mappedData = nftMapper(data);

    await this.db.saveData(COLLECTIONS.NFT, mappedData);

    if (isReceived)
      return this.nftTransactionService.insertTransaction({
        ...mappedData,
        type: 'received',
      });

    return this.nftTransactionService.insertTransaction({
      ...mappedData,
      type: 'minted',
    });
  }

  async updateNFToken (data) {
    const { tokenId, isBurned, isShielded } = data;
    const mappedData = nftMapper(data);

    await this.db.updateData(
      COLLECTIONS.NFT,
      {
        token_id: tokenId,
        is_transferred: { $exists: false },
        is_shielded: false,
      },
      { $set: mappedData },
    );

    if (isBurned)
      return this.nftTransactionService.insertTransaction({
        ...mappedData,
        type: 'burned',
      });
    if (isShielded)
      return this.nftTransactionService.insertTransaction({
        ...mappedData,
        type: 'shielded',
      });

    return this.nftTransactionService.insertTransaction({
      ...mappedData,
      type: 'transferred',
    });
  }

  getNFTokens (query) {
    if (!query || !query.pageNo || !query.limit) {
      return this.db.getData(COLLECTIONS.NFT, {
        shield_contract_address: query.shieldContractAddress ? query.shieldContractAddress : null,
        is_transferred: { $exists: false },
        is_burned: { $exists: false },
        is_shielded: false,
      });
    }
    const { pageNo, limit } = query;
    return this.db.getDbData(
      COLLECTIONS.NFT,
      {
        shield_contract_address: query.shieldContractAddress ? query.shieldContractAddress : null,
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

  getNFToken (tokenId) {
    return this.db.findOne(COLLECTIONS.NFT, {
      token_id: tokenId,
      is_transferred: { $exists: false },
    });
  }

  getNFTTransactions (query) {
    return this.nftTransactionService.getTransactions(query);
  }
}
