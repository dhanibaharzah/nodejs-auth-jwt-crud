/* global UsersControllers TenantsControllers UsersScheme */

'use strict'

const auth = require('../../helper/Auth')
const Ajv = require('ajv')
const multer = require('fastify-multer')
const upload = multer({
  dest: '/tmp',
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
      cb(null, true)
    } else {
      return cb(new Error('Only .png, .jpg and .jpeg format allowed!'))
    }
  }
})

const ajv = new Ajv({
  removeAdditional: true,
  allErrors: true,
  coerceTypes: true,
  $data: true,
  verbose: true
})

module.exports = (fastify, options, next) => {
  fastify.register(multer.contentParser)

  fastify.route({
    method: 'PUT',
    url: '/login',
    onRequest: (req, res, done) => auth.checkHeaderAuthorization(req, res, done),
    preValidation: (req, res, done) => {
      const validateBody = ajv.compile(UsersScheme.validateLogin)

      validateBody(req.body)

      if (validateBody.errors) {
        return ErrorsHelper.errorAJV(res, validateBody.errors, 400)
      }

      // TenantsControllers.currentTenant(req, res, done)
      done()
    },
    handler: (req, res) => UsersControllers.login(req, res)
  })

  fastify.route({
    method: 'PUT',
    url: '/register',
    onRequest: (req, res, done) => auth.checkHeaderAuthorization(req, res, done),
    preValidation: (req, res, done) => {
      const validateBody = ajv.compile(UsersScheme.validateRegister)

      validateBody(req.body)

      if (validateBody.errors) {
        return ErrorsHelper.errorAJV(res, validateBody.errors, 400)
      }

      // TenantsControllers.currentTenant(req, res, done)
      done()
    },
    handler: (req, res) => UsersControllers.register(req, res)
  })

  fastify.route({
    method: 'GET',
    url: '/profile',
    onRequest: (req, res, done) => auth.checkHeaderAuthorization(req, res, done),
    preValidation: (req, res, done) => auth.requiresAccessToken(req, res, done),
    preHandler: (req, res, done) => UsersControllers.currentUser(req, res, done),
    handler: (req, res) => UsersControllers.profile(req, res)
  })

  fastify.route({
    method: 'PUT',
    url: '/profile/update',
    onRequest: (req, res, done) => auth.checkHeaderAuthorization(req, res, done),
    preValidation: (req, res, done) => auth.requiresAccessToken(req, res, done),
    preHandler: (req, res, done) => {
      const validateBody = ajv.compile(UsersScheme.validateProfile)

      validateBody(req.body)

      if (validateBody.errors) {
        return ErrorsHelper.errorAJV(res, validateBody.errors, 400)
      }

      // TenantsControllers.currentTenant(req, res, done)
      done()
    },
    handler: (req, res) => UsersControllers.profileUpdate(req, res)
  })

  fastify.route({
    method: 'GET',
    url: '/logout',
    onRequest: (req, res, done) => auth.checkHeaderAuthorization(req, res, done),
    preHandler: (req, res, done) => auth.requiresAccessToken(req, res, done),
    handler: (req, res) => UsersControllers.logout(req, res)
  })

  fastify.route({
    method: 'PUT',
    url: '/forgot-password/check-token',
    onRequest: (req, res, done) => auth.checkHeaderAuthorization(req, res, done),
    preValidation: (req, res, done) => {
      const validateBody = ajv.compile(UsersScheme.validateTokenForgotPassword)

      validateBody(req.body)

      if (validateBody.errors) {
        return ErrorsHelper.errorAJV(res, validateBody.errors, 400)
      }

      done()
    },
    handler: (req, res) => UsersControllers.checkTokenForgotPassword(req, res)
  })

  fastify.route({
    method: 'PUT',
    url: '/forgot-password/send-email',
    onRequest: (req, res, done) => auth.checkHeaderAuthorization(req, res, done),
    preValidation: (req, res, done) => {
      const validateBody = ajv.compile(UsersScheme.validateEmailForgotPassword)

      validateBody(req.body)

      if (validateBody.errors) {
        return ErrorsHelper.errorAJV(res, validateBody.errors, 400)
      }

      done()
    },
    handler: (req, res) => UsersControllers.forgotPasswordSendEmail(req, res)
  })

  fastify.route({
    method: 'PUT',
    url: '/forgot-password/reset-password',
    onRequest: (req, res, done) => auth.checkHeaderAuthorization(req, res, done),
    preValidation: (req, res, done) => {
      const validateBody = ajv.compile(UsersScheme.validateResetPassword)

      validateBody(req.body)

      if (validateBody.errors) {
        return ErrorsHelper.errorAJV(res, validateBody.errors, 400)
      }

      done()
    },
    handler: (req, res) => UsersControllers.resetPassword(req, res)
  })

  fastify.route({
    method: 'PUT',
    url: '/refresh-token',
    onRequest: (req, res, done) => auth.checkHeaderAuthorization(req, res, done),
    preValidation: (req, res, done) => {
      const validateBody = ajv.compile(UsersScheme.validateRefreshToken)

      validateBody(req.body)

      if (validateBody.errors) {
        return ErrorsHelper.errorAJV(res, validateBody.errors, 400)
      }
      done()
    },
    handler: (req, res) => UsersControllers.refreshToken(req, res)
  })

  fastify.route({
    method: 'POST',
    url: '/upload/avatar',
    onRequest: (req, res, done) => auth.checkHeaderAuthorization(req, res, done),
    preValidation: (req, res, done) => auth.requiresAccessToken(req, res, done),
    preHandler: upload.single('file'),
    handler: (req, res) => UsersControllers.uploadAvatar(req, res)
  })

  next()
}
