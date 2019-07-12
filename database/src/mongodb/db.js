import { getProps } from '../config';
import { COLLECTIONS } from '../common/constants';
import {
  UserSchema,
  erc721Schema,
  erc721TransactionSchema,
  erc721CommitmentSchema,
  erc721CommitmentTransactionSchema,
  erc20TransactionSchema,
  erc20CommitmentSchema,
  erc20CommitmentTransactionSchema,
} from '../models';

const { mongo } = getProps();

export default class DB {
  constructor (db, username) {
    this.database = db;
    this.username = username;
    if (!username) return;
    this.createTablesForUser();
  }

  createTablesForUser () {
    const { username, database } = this;
    this.Models = {
      user: database.model(`${username}_${COLLECTIONS.USER}`, UserSchema),
      erc_721: database.model(`${username}_${COLLECTIONS.PUBLIC_TOKEN}`, erc721Schema),
      erc_721_transaction: database.model(
        `${username}_${COLLECTIONS.PUBLIC_TOKEN_TRANSACTION}`,
        erc721TransactionSchema,
      ),
      erc_721_commitment: database.model(
        `${username}_${COLLECTIONS.TOKEN}`,
        erc721CommitmentSchema,
      ),
      erc_721_commitment_transaction: database.model(
        `${username}_${COLLECTIONS.TOKEN_TRANSACTION}`,
        erc721CommitmentTransactionSchema,
      ),
      erc_20_transaction: database.model(
        `${username}_${COLLECTIONS.PUBLIC_COIN_TRANSACTION}`,
        erc20TransactionSchema,
      ),
      erc_20_commitment: database.model(`${username}_${COLLECTIONS.COIN}`, erc20CommitmentSchema),
      erc_20_commitment_transaction: database.model(
        `${username}_${COLLECTIONS.COIN_TRANSACTION}`,
        erc20CommitmentTransactionSchema,
      ),
    };
  }

  async saveData (modelName, data) {
    try {
      const Model = this.Models[modelName];
      const modelInstance = new Model(data);
      const successData = await modelInstance.save();
      return Promise.resolve(successData);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async getData (modelName, query = {}) {
    try {
      const model = this.Models[modelName];
      const data = await model.find(query).exec();
      return Promise.resolve(data);
    } catch (e) {
      console.log('DB error', e);
      return Promise.reject(e);
    }
  }

  async getDbData (
    modelName,
    query,
    projection = { path: '', select: '' },
    sort = {},
    pageNo = 1,
    limit = 5,
  ) {
    try {
      const model = this.Models[modelName];
      const data = await model
        .find(query)
        .limit(limit)
        .skip(limit * (pageNo - 1))
        .sort(sort)
        .populate(projection)
        .exec();
      const totalCount = await model
        .find(query)
        .countDocuments()
        .exec();
      return Promise.resolve({ data, totalCount });
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async getDbValues (modelName, query, projection, sort = {}, pageNo, limit) {
    try {
      const model = this.Models[modelName];
      const mQuery = model.find(query);
      if (limit) {
        mQuery.limit(limit);
      }
      if (pageNo) {
        mQuery.skip(limit * (pageNo - 1));
      }
      if (sort) {
        mQuery.sort(sort);
      }
      if (projection) {
        mQuery.populate(projection);
      }

      const data = await mQuery.exec();
      return Promise.resolve({ data });
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async findOne (modelName, query) {
    try {
      const model = this.Models[modelName];
      const data = await model.findOne(query);
      return Promise.resolve(data);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async getListData (modelName, query, page) {
    try {
      const model = this.Models[modelName];
      const data = await model
        .find(query)
        .skip(page.index * page.size)
        .limit(page.size)
        .exec();
      return Promise.resolve(data);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async updateData (modelName, condition, updateData, options = { upsert: true }) {
    try {
      const model = this.Models[modelName];
      const data = await model.updateOne(condition, updateData, options);
      return Promise.resolve(data);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async aggregation (modelName, condition, projection, options) {
    try {
      const model = this.Models[modelName];
      const pipeline = [{ $match: condition }];

      if (projection) pipeline.push(projection);

      if (options) pipeline.push(options);

      const data = await model.aggregate(pipeline);

      return Promise.resolve(data);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async populate (modelName, data, populates) {
    try {
      const model = this.Models[modelName];
      return await model.populate(data, populates);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  addUser (name, password) {
    return new Promise((resolve, reject) => {
      this.database.db.addUser(
        name,
        password,
        {
          roles: [
            {
              role: 'read',
              db: mongo.databaseName,
            },
          ],
        },
        function (err) {
          if (err) return reject(err);
          return resolve();
        },
      );
    });
  }
}
