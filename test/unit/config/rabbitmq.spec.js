const { validateRabbitmqConfig } = require('../../../config/rabbitmq')

describe('[UNIT] config/rabbitmq', () => {
  const baseConfigFixture = {
    uri: 'amqp://localhost',
    exchange: 'test_exchange',
    routingKey: 'test_routingkey',
  }

  describe('when validating configuration', () => {
    context('with everything correct', () => {
      it('should not throw any errors and forward configuration', () => {
        const config = validateRabbitmqConfig(baseConfigFixture)
        expect(config).to.deep.equal(baseConfigFixture)
      })
    })

    context('with invalid configuration', () => {
      describe('when missing "exchange" configuration', () => {
        const configFixture = {
          ...baseConfigFixture,
          exchange: undefined,
        }

        it('should throw an error with a descriptive message', () => {
          let thrownErr
          try {
            validateRabbitmqConfig(configFixture)
          } catch (err) {
            thrownErr = err
          }

          expect(thrownErr).to.exist
          expect(thrownErr.message).to.match(/missing .*exchange/i)
        })
      })
    })
  })
})
