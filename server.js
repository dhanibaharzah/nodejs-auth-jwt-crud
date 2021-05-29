'use strict'
require('make-promises-safe') // installs an 'unhandledRejection' handler
require('dotenv').config()

global.env = process.env.NODE_ENV || 'development'
global.CONFIG = require('./app/config')

const autoload = require('./autoload')()
const fastify = require('fastify')({
  ajv: {
    removeAdditional: true,
    useDefaults: true,
    coerceTypes: true,
    nullable: true,
    allErrors: true
  },
  logger: env === 'production'
})

fastify.ready(err => {
  if (err) throw err
})

const knexIns = require('knex')({
  client: 'mysql',
  connection: CONFIG.DATABASE.MAIN,
  pool: { min: 0, max: 3 }
})

global.knex = knexIns

autoload(err => {
  if (err) throw err

  require('./app/config/middleware')(fastify)
  require('./app/routes')(fastify)

  fastify.listen(CONFIG.SERVER.PORT, CONFIG.SERVER.HOSTNAME, (err) => {
    if (err) {
      fastify.log.error(err)
      fastify.close()
      process.exit(1)
    }

    if (env === 'development') console.log(`\n✔ Quantum API Tenant Management server on port ${fastify.server.address().port} & docker container on port 9000`)
  })
})

process.on('SIGINT', () => {
  fastify.close()
  process.exit(1)
})

process.on('uncaughtException', (err) => {
  fastify.close()
  console.error(new Date() + ' uncaughtException: ', err.message)
  console.error(err.stack)
  process.exit(1)
})

process.on('unhandledRejection', err => {
  fastify.close()
  console.error(new Date() + ' unhandledRejection: ', err.message)
  console.error(err.stack)
  process.exit(1)
})

module.exports.fastify = fastify
