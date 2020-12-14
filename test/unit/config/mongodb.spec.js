const { validateMongodbConfig } = require('../../../config/mongodb')

describe('[UNIT] config/mongodb', () => {
  const baseConfigFixture = {
    collection: 'test_collection',
    database: 'test_database',
    query: {},
    queryOptions: {},
    uri: 'mongodb://localhost',
  }

  describe('when validating configuration', () => {
    context('with everything correct', () => {
      it('should not throw any errors and forward configuration', () => {
        const config = validateMongodbConfig(baseConfigFixture)
        expect(config).to.deep.equal(baseConfigFixture)
      })
    })

    context('with invalid configuration', () => {
      describe('when missing "database" configuration', () => {
        const configFixture = {
          ...baseConfigFixture,
          database: undefined,
        }

        it('should throw an error with a descriptive message', () => {
          let thrownErr
          try {
            validateMongodbConfig(configFixture)
          } catch (err) {
            thrownErr = err
          }

          expect(thrownErr).to.exist
          expect(thrownErr.message).to.match(/missing .*database/i)
        })
      })

      describe('when missing "collection" configuration', () => {
        const configFixture = {
          ...baseConfigFixture,
          collection: undefined,
        }

        it('should throw an error with a descriptive message', () => {
          let thrownErr
          try {
            validateMongodbConfig(configFixture)
          } catch (err) {
            thrownErr = err
          }

          expect(thrownErr).to.exist
          expect(thrownErr.message).to.match(/missing .*collection/i)
        })
      })
    })
  })
})
