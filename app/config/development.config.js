/* global */

'use strict'

const BASE_DOMAIN = process.env.BASE_DOMAIN || 'quantum.local'

const config = {
  BASE_DOMAIN: BASE_DOMAIN,
  BASE_HOST: `http://api.${BASE_DOMAIN}:${process.env.APP_HTTP_PORT}`,
  BASE_HOST_API_GATEWAY: `http://api.${BASE_DOMAIN}/ecommerce`,
  ECOMMERCE_DOMAIN: `http://${process.env.ECOMMERCE_DOMAIN}`
}

module.exports = config
