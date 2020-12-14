const MongodbClient = require('./src/mongodb-client')
const RabbitmqClient = require('./src/rabbitmq-client')

const { mongodbConfig, rabbitmqConfig } = require('./config')

const withClients = async (asyncFn, ...clients) => {
  try {
    await asyncFn(...clients)
  } finally {
    await Promise.all(clients.map((client) => client.disconnect()))
  }
}

const exec = async () => {
  await withClients(
    async (mongodb, rabbitmq) => {
      const documents = await mongodb.find(mongodbConfig.collection, mongodbConfig.query, mongodbConfig.queryOptions)

      await documents.forEach(rabbitmq.publish.bind(rabbitmq))
    },
    new MongodbClient(mongodbConfig),
    new RabbitmqClient(rabbitmqConfig)
  )
}

if (module.parent) {
  module.exports = exec
} else {
  exec()
}
