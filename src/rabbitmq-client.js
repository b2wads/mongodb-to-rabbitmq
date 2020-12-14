const amqplib = require('amqplib')

module.exports = class RabbitmqClient {
  constructor({ uri, exchange, routingKey }) {
    this._connectionPromise = amqplib.connect(uri)
    this._channelPromise = this._connectionPromise.then((conn) => conn.createChannel())

    this._exchange = exchange
    this._routingKey = routingKey
  }

  async disconnect() {
    const [channel, connection] = await Promise.all([this._channelPromise, this._connectionPromise])

    await channel.close()
    await connection.close()
  }

  async publish(jsObject) {
    const channel = await this._channelPromise

    return channel.publish(this._exchange, this._routingKey, Buffer.from(JSON.stringify(jsObject)))
  }
}
