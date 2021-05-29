'use strict'

/**
 * Module Export
 */
module.exports = trimBody

/**
 * Trim body or object's string values.
 *
 * @param {object} body
 */

const cleanString = (input) => {
  let output = ''
  for (let i = 0; i < input.length; i++) {
    if (input.charCodeAt(i) <= 127) {
      output += input.charAt(i)
    }
  }
  return output.replace(/\s+/g, ' ')
}

function trimBody (body) {
  if (Object.prototype.toString.call(body) === '[object Object]') {
    Object.keys(body).forEach((key) => {
      var value = body[key]

      if (typeof value === 'string') {
        body[key] = cleanString(value.trim())
        return
      }

      if (typeof value === 'object') {
        trimBody(value)
      }
    })
  }
}
