const envLoader = require('@b2wads/env-o-loader')

const configSpec = {
  defaults: {
    query: '{}',
    queryOptions: '{}',
    uri: 'mongodb://localhost',
  },

  test: {
    collection: 'test_collection',
    database: 'test_database',
    query: '{"find":true}',
    queryOptions: '{"sort":{"name":-1}}',
    uri: 'env:TEST_B2WADS_MONGODB_URI',
  },

  production: {
    collection: 'env:B2WADS_MONGODB_COLLECTION',
    database: 'env:B2WADS_MONGODB_DATABASE',
    query: 'env:B2WADS_MONGODB_QUERY',
    queryOptions: 'env:B2WADS_MONGODB_QUERY_OPTIONS',
    uri: 'env:B2WADS_MONGODB_URI',
  },
}

const rawConfig = envLoader(configSpec)

module.exports = {
  ...rawConfig,
  query: JSON.parse(rawConfig.query),
  queryOptions: JSON.parse(rawConfig.queryOptions),
}
