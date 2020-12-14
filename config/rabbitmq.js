const envLoader = require('@b2wads/env-o-loader')

const configSpec = {
  defaults: {
    uri: 'amqp://localhost',
  },

  test: {
    uri: 'env:TEST_B2WADS_RABBITMQ_URI',
    exchange: 'test_exchange',
    routingKey: 'test_routingkey',
  },

  production: {
    uri: 'env:B2WADS_RABBITMQ_URI',
    exchange: 'env:B2WADS_RABBITMQ_EXCHANGE',
    routingKey: 'env:B2WADS_RABBITMQ_ROUTING_KEY',
  },
}

const config = envLoader(configSpec)

if (!config.exchange) throw Error('invalid rabbitmq configuration: missing "exchange"')

module.exports = config

