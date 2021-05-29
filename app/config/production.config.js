/* global */

'use strict'

const BASE_DOMAIN = process.env.BASE_DOMAIN || 'quantum.com'
const PROTOCOL = process.env.PROTOCOL_HTTPS || 'http'

const config = {
  BASE_DOMAIN: BASE_DOMAIN,
  BASE_HOST: `${PROTOCOL}://api.${BASE_DOMAIN}`,
  BASE_HOST_API_GATEWAY: `${PROTOCOL}://api.${BASE_DOMAIN}/ecommerce`,
  ECOMMERCE_DOMAIN: `${PROTOCOL}://${process.env.ECOMMERCE_DOMAIN}`
}

module.exports = config
