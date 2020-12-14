const amqplib = require('amqplib')
const { MongoClient } = require('mongodb')

const app = require('../../app')

const { mongodbConfig, rabbitmqConfig } = require('../../config')

describe('[ACCEPTANCE] app', () => {
  const rabbit = {
    async getAllMessages() {
      const msgs = []

      let msg
      // eslint-disable-next-line no-cond-assign
      while ((msg = await this.channel.get('test_queue', { noAck: true })))
        msgs.push(JSON.parse(msg.content.toString()))

      return msgs
    },
  }

  const mongoClient = new MongoClient(mongodbConfig.uri, { useUnifiedTopology: true })
  let mongoCollection

  before(async () => {
    await mongoClient.connect()

    mongoCollection = mongoClient.db(mongodbConfig.database).collection(mongodbConfig.collection)

    rabbit.connection = await amqplib.connect(rabbitmqConfig.uri)
    rabbit.channel = await rabbit.connection.createChannel()

    await Promise.all([
      rabbit.channel.assertExchange(rabbitmqConfig.exchange, 'direct'),
      rabbit.channel.assertQueue('test_queue'),
    ])
    await rabbit.channel.bindQueue('test_queue', rabbitmqConfig.exchange, rabbitmqConfig.routingKey)
  })

  after(async () => {
    await mongoClient.close()

    await rabbit.channel.unbindQueue('test_queue', rabbitmqConfig.exchange, rabbitmqConfig.routingKey)
    await Promise.all([
      rabbit.channel.deleteExchange(rabbitmqConfig.exchange),
      rabbit.channel.deleteQueue('test_queue'),
    ])

    await rabbit.channel.close()
    await rabbit.connection.close()
  })

  describe('correctly publishes mongodb documents in rabbitmq', () => {
    const docsFixtures = [
      {
        name: 'test doc 1',
        find: true,
      },
      {
        name: 'test doc 2',
        find: false,
      },
      {
        name: 'test doc 3',
        find: true,
      },
    ]

    let rabbitMessages
    before(async () => {
      await mongoCollection.insertMany(docsFixtures)

      await app()

      rabbitMessages = await rabbit.getAllMessages()
    })

    after(async () => {
      await mongoCollection.deleteMany({})
    })

    it('should publish documents according to configuration query', () => {
      expect(rabbitMessages).to.have.lengthOf(2)
    })

    it('should publish correct document data', () => {
      const expectedDocs = docsFixtures
        .filter((doc) => doc.find)
        .sort((a, b) => b.name.localeCompare(a.name))
        .map((rawDoc) => ({
          _id: rawDoc._id.toString(),
          name: rawDoc.name,
          find: rawDoc.find,
        }))

      expect(rabbitMessages).to.deep.equal(expectedDocs)
    })
  })
})
