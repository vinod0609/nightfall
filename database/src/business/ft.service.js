import { ftMapper } from '../mappers';
import FtTransactionService from './ft-transaction.service';

export default class FtService {
  constructor (_db) {
    this.db = _db;
    this.ftTransactionService = new FtTransactionService(_db);
  }

  addFTokenTransaction (data) {
    const { isReceived, isTransferred, isBurned } = data;
    const mappedData = ftMapper(data);

    if (isReceived)
      return this.ftTransactionService.insertTransaction({ ...mappedData, type: 'received' });
    if (isTransferred)
      return this.ftTransactionService.insertTransaction({ ...mappedData, type: 'transferred' });
    if (isBurned)
      return this.ftTransactionService.insertTransaction({ ...mappedData, type: 'burned' });

    return this.ftTransactionService.insertTransaction({ ...mappedData, type: 'minted' });
  }

  getFTTransactions (query) {
    return this.ftTransactionService.getTransactions(query);
  }
}