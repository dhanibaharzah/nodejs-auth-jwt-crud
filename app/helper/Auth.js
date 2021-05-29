'use strict'

const { isEmpty, includes } = require('lodash')
const jwt = require('jsonwebtoken')

const allowClientAccessAPI = [
  'X-QUANTUM-WEB',
  'X-QUANTUM-MOBILE'
]

exports.checkHeaderAuthorization = (req, res, next) => {
  const accessToken = req.headers.authorization

  if (isEmpty(accessToken)) {
    return ErrorsHelper.responses(res, 'Unauthorized, need access token to access this API route.', 400)
  }

  if (includes(allowClientAccessAPI, accessToken)) {
    return next()
  } else {
    return ErrorsHelper.responses(res, 'Unauthorized, your access token or authorization value is invalid/expired.', 400)
  }
}

exports.requiresAccessToken = (req, res, next) => {
  const accessToken = req.headers['x-token-client']
  const userId = parseInt(req.headers['x-user-id'])

  jwt.verify(accessToken, CONFIG.TOKEN_CLIENT_SECRET, (err, decoded) => {
    if (err && err.name === 'TokenExpiredError') return ErrorsHelper.errorCustomStatus(res, 'Unauthorized, access token is expired', 401)

    if (err && err.name === 'JsonWebTokenError') return ErrorsHelper.errorCustomStatus(res, 'Unauthorized, invalid access token', 401)

    if (decoded.iss === userId) {
      req.auth = {
        userId: decoded.iss || 0
      }

      next()
    } else {
      return ErrorsHelper.errorCustomStatus(res, 'Unauthorized, invalid access token', 401)
    }
  })
}

exports.checkIsLogin = (req, res, next) => {
  const accessToken = req.headers['x-token-client']
  const userId = parseInt(req.headers['x-user-id'])

  if (accessToken) {
    jwt.verify(accessToken, CONFIG.TOKEN_CLIENT_SECRET, (err, decoded) => {
      if (err) {
        console.error(err)

        req.auth = {
          userId: 0
        }

        next()
      } else {
        if (decoded.iss === userId) {
          req.auth = {
            userId: decoded.iss || 0
          }
          next()
        }
      }
    })
  } else {
    next()
  }
}
