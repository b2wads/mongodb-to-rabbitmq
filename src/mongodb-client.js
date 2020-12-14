const { MongoClient } = require('mongodb')

module.exports = class MongodbClient {
  constructor({ uri, database }) {
    this._client = new MongoClient(uri, { useUnifiedTopology: true })
    this._databasePromise = this._client.connect().then(() => this._client.db(database))
  }

  async disconnect() {
    return this._client.close()
  }

  async find(collectionName, query, queryOptions) {
    const db = await this._databasePromise
    const collection = db.collection(collectionName)
    return collection.find(query, queryOptions)
  }
}
