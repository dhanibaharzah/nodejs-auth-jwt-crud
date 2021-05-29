/* global TrimBodyHelper */

'use strict'

const cookieParser = require('cookie-parser')
const helmet = require('fastify-helmet')
const xssFilter = require('x-xss-protection')()

module.exports = (fastify) => {
  fastify.use(cookieParser(CONFIG.SESSION_SECRET))
  fastify.use(xssFilter)

  if (process.env.NODE_ENV === 'development') {
    const morgan = require('morgan')
    fastify.use(morgan('dev'))
  }

  fastify.register(helmet)
  fastify.register(require('fastify-formbody'), { bodyLimit: 75000000 })

  fastify.addContentTypeParser('*', (req, done) => {
    done()
  })

  fastify.use((req, res, next) => {
    if (req.body) {
      TrimBodyHelper(req.body)
    }
    next()
  })
}
