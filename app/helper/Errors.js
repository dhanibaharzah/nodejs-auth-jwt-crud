'use strict'
const resultPrint = {}
const { isNil, isObject, result } = require('lodash')

module.exports = {
  responses: (res, obj, status) => {
    var resultPrint = {}

    resultPrint.id = MiscHelper.createUUID()
    resultPrint.status = status || 200

    if (isObject(obj)) {
      resultPrint.data = obj
    } else {
      resultPrint.message = String(obj)
    }

    return res.code(resultPrint.status).type('application/json').send(resultPrint)
  },
  responsesPure: (res, obj) => {
    return res.type('application/json').send(obj)
  },
  errorAJV: (res, err, status) => {
    var resultPrint = {}

    resultPrint.id = MiscHelper.createUUID()
    resultPrint.status = status || 200

    err.map(o => {
      delete o.dataPath
      delete o.schemaPath
      return o
    })

    if (isObject(err)) {
      resultPrint.data = err
    } else {
      resultPrint.message = String(err)
    }

    return res.code(resultPrint.status).type('application/json').send(resultPrint)
  },
  errorCustomStatus: (res, err, status) => {
    resultPrint.id = MiscHelper.createUUID()
    resultPrint.status = 400
    resultPrint.errors = {}

    if (isNil(status) && isObject(err)) {
      resultPrint.errors.message = result(err, 'message') || result(err, 'msg') || 'Bad Request'
      resultPrint.errors.fields = err
    } else {
      resultPrint.status = status || resultPrint.status
      resultPrint.message = String(err)
      resultPrint.errors.message = String(err) || 'The server encountered an unexpected condition which prevented it from fulfilling the request.'
    }

    return res.code(400).type('application/json').send(resultPrint)
  },
  notFound: (res, message) => {
    resultPrint.id = MiscHelper.createUUID()
    resultPrint.errors = {
      message: message || 'Sorry, that page does not exist'
    }
    resultPrint.status = 404
    return res.code(404).type('application/json').send(resultPrint)
  }
}
