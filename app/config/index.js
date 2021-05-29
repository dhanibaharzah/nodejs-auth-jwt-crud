'use strict'

const path = require('path')
const util = require('util')

const dirConf = util.format('/%s.config.js', process.env.NODE_ENV || 'development')
const config = Object.assign(true, {}, require('./all'), require(path.join(__dirname, dirConf)))

module.exports = config
