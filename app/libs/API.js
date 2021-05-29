'use strict'

const request = require('requestretry')
const { assignIn, result } = require('lodash')
const querystring = require('querystring')

const createClient = (config) => {
  const api = {}

  if (!config) {
    throw new Error('Api libs need a config object')
  }

  if (!config.baseURL) {
    throw new Error('please provide "baseURL" property in config')
  }

  api.baseURL = config.baseURL
  api.defaultHeaders = config.headers
  api.timeout = config.timeout || 50000
  api.maxAttempts = config.maxAttempts || 5

  api.get = (url, data, headers, callback) => {
    const options = {
      method: 'GET',
      url: api.baseURL + url,
      qs: data,
      headers: assignIn(api.defaultHeaders, (headers || {})),
      timeout: api.timeout,
      maxAttempts: api.maxAttempts
    }

    if (typeof callback === 'function') {
      request(options, (err, response, body) => {
        let statusCode = false
        if (result(response, 'statusCode') === 200 || result(response, 'statusCode') === 201) {
          statusCode = true
        }

        if (!err && statusCode === true && body) {
          try {
            const output = JSON.parse(body)
            callback(null, result(output, 'data') || output)
          } catch (e) {
            callback(null, {})
          }
        } else {
          console.error('Error Response: ', result(response, 'statusCode'), url)
          try {
            callback(err || JSON.parse(body))
          } catch (e) {
            callback(e)
          }
        }
      }).on('error', (err) => {
        console.error(options, err)
        callback(err)
      })
    } else {
      return new Promise((resolve, reject) => {
        request(options, (err, response, body) => {
          let statusCode = false
          if (result(response, 'statusCode') === 200 || result(response, 'statusCode') === 201) {
            statusCode = true
          }

          if (!err && statusCode === true && body) {
            try {
              const output = JSON.parse(body)
              resolve(result(output, 'data') || output)
            } catch (e) {
              resolve({})
            }
          } else {
            console.error('Error Response: ', result(response, 'statusCode'), url)
            try {
              reject(err || JSON.parse(body))
            } catch (e) {
              reject(e)
            }
          }
        }).on('error', (err) => {
          console.error(options, err)
          reject(err)
        })
      }).catch((err) => {
        console.error(options, err)
      })
    }
  }

  api.post = (url, data, headers, callback) => {
    const options = {
      url: api.baseURL + url,
      body: querystring.stringify(data),
      headers: assignIn(api.defaultHeaders, (headers || {})),
      timeout: api.timeout,
      maxAttempts: api.maxAttempts
    }

    if (result(options.headers, '[Content-Type]') === 'application/json') {
      options.body = JSON.stringify(data)
    }

    if (typeof callback === 'function') {
      request.post(options, (err, response, body) => {
        let statusCode = false
        if (result(response, 'statusCode') === 200 || result(response, 'statusCode') === 201) {
          statusCode = true
        }

        if (!err && statusCode === true && body) {
          try {
            callback(null, JSON.parse(body))
          } catch (e) {
            callback(null, {})
          }
        } else {
          console.error('Error Response: ', result(response, 'statusCode'), url)
          try {
            callback(err || JSON.parse(body))
          } catch (e) {
            callback(e)
          }
        }
      }).on('error', (err) => {
        console.error(options, err)
        callback(err)
      })
    } else {
      return new Promise((resolve, reject) => {
        request.post(options, (err, response, body) => {
          let statusCode = false
          if (result(response, 'statusCode') === 200 || result(response, 'statusCode') === 201) {
            statusCode = true
          }

          if (!err && statusCode === true && body) {
            try {
              resolve(JSON.parse(body))
            } catch (e) {
              resolve({})
            }
          } else {
            console.error('Error Response: ', result(response, 'statusCode'), url)
            try {
              reject(err || JSON.parse(body))
            } catch (e) {
              reject(e)
            }
          }
        }).on('error', (err) => {
          console.error(options, err)
          reject(err)
        })
      }).catch((err) => {
        console.error(options, err)
      })
    }
  }
  return api
}

module.exports = {
  client: createClient
}
