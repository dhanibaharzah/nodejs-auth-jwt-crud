/* global */

'use strict'

const { waterfall, eachSeries } = require('async')
const { result, merge, isEmpty } = require('lodash')
const usersModels = require('../models/users')
const redisCache = require('../libs/redisCache')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const bcrypt = require('bcrypt')
const AWS = require('aws-sdk')
const fs = require('fs')

exports.currentUser = (req, res, next) => {
  const key = `users:${req.auth.userId}`

  waterfall([
    (cb) => {
      redisCache
        .get(key, currentUser => {
          if (currentUser) {
            req.currentUser = currentUser
            next()
          } else {
            cb(null)
          }
        })
    },
    (cb) => {
      usersModels
        .query()
        .findById(req.auth.userId)
        .then(resp => {
          cb(null, resp)
        })
    }
  ], (err, resp) => {
    if (err) console.error(err)

    req.currentUser = result(resp, '[0]', {})
    redisCache.set(key, req.user)
    next()
  })
}

/*
 * PUT /users/register
 *
 * @desc users register
 *
 * @param  {object} req - Parameters for request
 * @param  {object} req.body - data login
 *
 * @return {object} Request object
 */
exports.register = (req, res) => {
  waterfall([
    (cb) => {
      if (req.body.confirmpassword !== req.body.password) {
        return ErrorsHelper.errorCustomStatus(res, 'Password dan konfirmasi password tidak sesuai!', 409)
      } else {
        cb(null)
      }
    },
    (cb) => {
      usersModels
        .query()
        .count('* as total')
        .where('email', req.body.email)
        .then(total => {
          if (total[0].total > 0) {
            return ErrorsHelper.errorCustomStatus(res, 'Email sudah terdaftar!', 409)
          } else {
            cb(null)
          }
        })
        .catch(cb)
    },
    (cb) => {
      delete req.body.confirmpassword
      const saltRounds = 10
      const salt = bcrypt.genSaltSync(saltRounds)
      const hash = bcrypt.hashSync(req.body.password, salt)

      req.body.password = hash

      const dataUser = {
        ...req.body,
        is_active: 1,
        created_at: new Date(),
        updated_at: new Date()
      }

      usersModels
        .query()
        .insert(dataUser)
        .then(users => {
          cb(null, users)
        })
        .catch(err => {
          cb(err)
        })
    }
  ], (err, resp) => {
    if (err) return ErrorsHelper.errorCustomStatus(res, err, 400)

    return ErrorsHelper.responses(res, resp)
  })
}

/*
 * PUT /users/login
 *
 * @desc users login
 *
 * @param  {object} req - Parameters for request
 * @param  {object} req.body - data login
 *
 * @return {object} Request object
 */
exports.login = (req, res) => {
  waterfall([
    (cb) => {
      usersModels
        .query()
        .select('id', 'name', 'email', 'password')
        // .where('tenant_id', req.tenant.id)
        .where('email', req.body.email)
        .orderBy('id', 'ASC')
        .then(user => {
          if (!result(user, '[0]')) {
            return ErrorsHelper.errorCustomStatus(res, 'Invalid email and password!', 400)
          }

          if (!bcrypt.compareSync(req.body.password, user[0].password)) {
            return ErrorsHelper.errorCustomStatus(res, 'Invalid password!', 400)
          }

          cb(null, user[0])
        })
    },
    (user, cb) => {
      delete user.password
      delete user.salt

      const memberToken = {}
      let tokenType = 'local'

      if (req.headers.authorization === 'X-QUANTUM-MOBILE') {
        tokenType = 'mobile'
      }

      memberToken.local = jwt.sign({ iss: user.id, type: tokenType }, CONFIG.TOKEN_CLIENT_SECRET, { expiresIn: '1 day' })
      memberToken.refresh_token = crypto.createHash('sha256').update(MiscHelper.randomString(16)).digest('hex')
      memberToken.expired = 3600 * 24

      const dataUserToken = {
        token: memberToken
      }

      usersModels
        .query()
        .findById(user.id)
        .patch({
          token: memberToken.local,
          refresh_token: memberToken.refresh_token
        })
        .then(() => {
          cb(null, merge(user, dataUserToken))
        })
    }
  ], (err, resp) => {
    if (err) return ErrorsHelper.errorCustomStatus(res, err, 400)

    return ErrorsHelper.responses(res, resp)
  })
}

/*
 * GET /users/logout
 *
 * @desc users logout
 *
 * @param  {object} req - Parameters for request
 * @param  {object} req.body - data login
 *
 * @return {object} Request object
 */
exports.logout = (req, res) => {
  usersModels
    .query()
    .findById(req.headers['x-user-id'])
    .patch({
      token: '',
      refresh_token: ''
    })
    .then(() => {
      return ErrorsHelper.responses(res, 'success')
    })
}

/*
 * PUT /users/refresh-token
 *
 * @desc users refresh token
 *
 * @param  {object} req - Parameters for request
 * @param  {object} req.body - data login
 *
 * @return {object} Request object
 */
exports.refreshToken = (req, res) => {
  waterfall([
    (cb) => {
      usersModels
        .query()
        .select('id')
        .where('refresh_token', req.body.refresh_token)
        .then(user => {
          if (!isEmpty(user)) {
            cb(null, user[0])
          } else {
            return ErrorsHelper.errorCustomStatus(res, 'Invalid key!', 400)
          }
        })
    },
    (user, cb) => {
      const memberToken = {}
      let tokenType = 'local'

      if (req.headers.authorization === 'X-QUANTUM-MOBILE') {
        tokenType = 'mobile'
      }

      memberToken.token = jwt.sign({ iss: user.id, type: tokenType }, CONFIG.TOKEN_CLIENT_SECRET, { expiresIn: '1 day' })
      memberToken.refresh_token = crypto.createHash('sha256').update(MiscHelper.randomString(16)).digest('hex')

      const dataUserToken = {
        token: memberToken
      }

      usersModels
        .query()
        .findById(user.id)
        .patch({
          token: memberToken.token,
          refresh_token: memberToken.refresh_token
        })
        .then(() => {
          cb(null, merge(user, dataUserToken))
        })
    }
  ], (err, resp) => {
    if (err) return ErrorsHelper.errorCustomStatus(res, err, 400)

    return ErrorsHelper.responses(res, resp)
  })
}

/*
 * PUT /users/profile
 *
 * @desc get profile
 *
 * @param  {object} req - Parameters for request
 *
 * @return {object} Request object
 */

exports.profile = (req, res) => {
  const key = `users:profile:get:${req.auth.userId}`

  waterfall([
    (cb) => {
      redisCache
        .get(key, profile => {
          if (profile) {
            return ErrorsHelper.responses(res, profile)
          }

          cb(null)
        })
    },
    (cb) => {
      if (isEmpty(req.currentUser)) {
        usersModels
          .query()
          .select('name', 'email', 'phone', 'photo', 'created_at')
          .findById(req.auth.userId)
          .then(profile => {
            profile.id = req.auth.userId
            cb(null, profile)
          })
          .catch(cb)
      } else {
        const dataUser = {
          name: req.currentUser.name,
          email: req.currentUser.email,
          phone: req.currentUser.phone,
          photo: req.currentUser.photo,
          created_at: req.currentUser.created_at
        }

        cb(null, dataUser)
      }
    },
  ], (err, resp) => {
    if (err) return ErrorsHelper.errorCustomStatus(res, err, 400)

    redisCache.set(key, resp)

    return ErrorsHelper.responses(res, resp)
  })
}

/*
 * PUT /users/profile/update
 *
 * @desc update profile
 *
 * @param  {object} req - Parameters for request
 *
 * @return {object} Request object
 */

exports.profileUpdate = (req, res) => {
  waterfall([
    (cb) => {
      const dataProfile = {
        ...req.body,
        updated_at: new Date()
      }

      usersModels
        .query()
        .findById(req.auth.userId)
        .patch(dataProfile)
        .then(profile => {
          dataProfile.id = req.auth.userId

          cb(null, dataProfile)
        })
        .catch(cb)
    },
  ], (err, resp) => {
    if (err) return ErrorsHelper.errorCustomStatus(res, err, 400)

    redisCache.del([`users:profile:get:${req.auth.userId}`, `users:${req.auth.userId}`])

    return ErrorsHelper.responses(res, resp)
  })
}

/*
 * PUT /users/upload/avatar
 *
 * @desc upload avatars
 *
 * @param  {object} req - Parameters for request
 *
 * @return {object} Request object
 */

exports.uploadAvatar = async (req, res) => {
  AWS.config.update({
    accessKeyId: CONFIG.AWS.S3.ACCESS_KEY,
    secretAccessKey: CONFIG.AWS.S3.SECRET
  })

  const s3 = new AWS.S3()
  const fileContent = fs.readFileSync(req.file.path)
  const params = {
    Bucket: `${CONFIG.AWS.S3.BUCKET}/avatar`,
    Key: new Date().getTime() + req.file.originalname,
    Body: fileContent,
    ContentType: req.file.mimetype,
    ACL: 'public-read'
  }

  s3.upload(params, (err, data) => {
    if (err) return ErrorsHelper.errorCustomStatus(res, err, 400)
    return ErrorsHelper.responses(res, {
      file: data.Location
    })
  })
}

/*
 * PUT /users/forgot-password/send-email
 *
 * @desc send email token forgot password
 *
 * @param  {object} req - Parameters for request
 *
 * @return {object} Request object
 */

exports.forgotPasswordSendEmail = (req, res) => {
  waterfall([
    (cb) => {
      usersModels
        .query()
        .count('* as total')
        .where('email', req.body.email)
        .where('is_active', 1)
        .then(user => {
          if (user[0].total > 0) {
            cb(null)
          } else {
            return ErrorsHelper.errorCustomStatus(res, 'Email not found!', 400)
          }
        })
        .catch(cb)
    },
    (cb) => {
      const token = MiscHelper.randomString(27)
      usersModels
        .query()
        .patch({
          reset_password_token: token
        })
        .where('email', req.body.email)
        .then(() => {
          cb(null, token)
        })
        .catch(cb)
    }
  ], (err, token) => {
    if (err) return ErrorsHelper.errorCustomStatus(res, err, 400)

    return ErrorsHelper.responses(res, {
      url: `https://${req.headers['x-domain']}/reset-password-token?${token}`
    })
  })
}

/*
 * GET /users/forgot-password/check-token
 *
 * @desc check token forgot password
 *
 * @param  {object} req - Parameters for request
 *
 * @return {object} Request object
 */

exports.checkTokenForgotPassword = (req, res) => {
  waterfall([
    (cb) => {
      usersModels
        .query()
        .count('* as total')
        .where('reset_password_token', req.body.resetToken)
        .then(user => {
          if (user[0].total > 0) {
            cb(null)
          } else {
            return ErrorsHelper.errorCustomStatus(res, 'Invalid token!', 400)
          }
        })
        .catch(cb)
    }
  ], err => {
    if (err) return ErrorsHelper.errorCustomStatus(res, err, 400)

    return ErrorsHelper.responses(res, {
      isValid: true
    })
  })
}

/*
 * GET /users/forgot-password/reset-password
 *
 * @desc reset password
 *
 * @param  {object} req - Parameters for request
 *
 * @return {object} Request object
 */

exports.resetPassword = (req, res) => {
  waterfall([
    (cb) => {
      if (req.body.confirmpassword !== req.body.password) {
        return ErrorsHelper.errorCustomStatus(res, 'Password dan konfirmasi password tidak sesuai!', 409)
      } else {
        cb(null)
      }
    },
    (cb) => {
      usersModels
        .query()
        .count('* as total')
        .where('reset_password_token', req.body.resetToken)
        .then(total => {
          if (total[0].total > 0) {
            cb(null)
          } else {
            return ErrorsHelper.errorCustomStatus(res, 'Invalid token!', 400)
          }
        })
        .catch(cb)
    },
    (cb) => {
      const saltRounds = 10
      const salt = bcrypt.genSaltSync(saltRounds)
      const hash = bcrypt.hashSync(req.body.password, salt)

      req.body.password = hash

      const dataUser = {
        password: hash,
        reset_password_token: null,
        updated_at: new Date()
      }

      usersModels
        .query()
        .patch(dataUser)
        .where('reset_password_token', req.body.resetToken)
        .then(users => {
          cb(null, users)
        })
        .catch(err => {
          cb(err)
        })
    }
  ], (err, resp) => {
    console.log(resp)
    if (err) return ErrorsHelper.errorCustomStatus(res, err, 400)

    return ErrorsHelper.responses(res, {
      success: true
    })
  })
}
