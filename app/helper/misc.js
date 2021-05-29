'use strict'

const moment = require('moment')

exports.generateInvNo = () => {
  return `INV/${moment().format('YYYYMMDD/hhmmss')}`
}

exports.pad = (width, string, padding) => {
  return (width <= string.length) ? string : this.pad(width, padding + string, padding)
}

exports.refIdFormat = (userId, max) => {
  return `${MiscHelper.pad(7, userId, '0')}-${moment().format('YYYYMMDD')}-${max}`
}

exports.agentCodeFormat = (agentInitial, agentId) => {
  return `${agentInitial}${MiscHelper.pad(4, agentId, '0')}`
}

exports.createUUID = () => {
  let dt = new Date().getTime()
  const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (dt + Math.random() * 16) % 16 | 0
    dt = Math.floor(dt / 16)
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
  })
  return uuid
}

exports.randomString = (length) => {
  let result = ''
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const charactersLength = characters.length
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

exports.randomNumber = () => {
  const random = `${Math.round((new Date()).getTime() / 1000)}${Math.random() * 100}`.toString().split('.')

  return random[1].substring(0, 6)
}

exports.formatNumber = (number, decimals, decPoint, thousandSep) => {
  number = number * 1
  var str = number.toFixed(decimals || 0).toString().split('.')
  var parts = []

  for (var i = str[0].length; i > 0; i -= 3) {
    parts.unshift(str[0].substring(Math.max(0, i - 3), i))
  }

  str[0] = parts.join(thousandSep || ',')
  return str.join(decPoint || '.')
}

exports.contentSMSOrder = (type, cifCode, token, cart) => {
  const extractCart = (cart) => {
    let dataCart = ''
    for (let i = 0; i < cart.length; ++i) {
      dataCart += cart[i].id + ', '
    }
    return dataCart.replace(/,\s$/, '')
  }

  let content = ''
  if (type === 'subscription') {
    content = `Gunakan Kode ${token} utk konfirmasi transaksi beli no booking: ${extractCart(cart)} Rincian, cek email Anda`
  } else if (type === 'redemption') {
    content = `Gunakan Kode ${token} utk konfirmasi transaksi jual no booking: ${extractCart(cart)} Rincian, cek email Anda`
  } else {
    content = `Gunakan Kode ${token} utk konfirmasi transaksi pengalihan no booking: ${extractCart(cart)} Rincian, cek email Anda`
  }

  return content
}

exports.fixedPhoneNumberFormat = (phone) => {
  return `+${phone.replace(/\D/g, '').replace(/^08/g, '628')}`
}

exports.shuffle = function (array) {
  let currentIndex = array.length
  let temporaryValue, randomIndex
  const start = 0
  while (start !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex -= 1
    temporaryValue = array[currentIndex]
    array[currentIndex] = array[randomIndex]
    array[randomIndex] = temporaryValue
  }
  return array
}
