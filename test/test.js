const t = require('tap')
const async = require('async')
const test = t.test
const App = require('../server.js')
const fastify = App.fastify
const mongo = App.db

before((done) => {
  if (process.env.NODE_ENV === 'testing') {
    done()
  } else {
    return done('Not in testing environment!')
  }
})

describe('Index Page', () => {
  it('GET /v1 - Should return 404 page', (done) => {
    test('GET `/v1` Route', t => {
      t.plan(2)
      fastify.inject({
        method: 'GET',
        url: '/v1'
      }, (err, res) => {
        t.error(err)
        t.strictEqual(res.statusCode, 404)
        fastify.close()
        done()
      })
    })
  })
})

after((done) => {
  done()
})