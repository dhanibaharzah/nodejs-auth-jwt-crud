'use strict'

const fastStringify = require('fast-safe-stringify')
const JSONparse = require('fast-json-parse')
const redisPoolCon = require('redis-pool-connection')
const redisClient = redisPoolCon(CONFIG.redis.baseCache)
const redisClientSubs = redisPoolCon(CONFIG.redis.baseCache)

const redisCache = {
  get: (key, callback) => {
    redisClient.get(key, (err, response) => {
      if (!err && response) {
        const data = JSONparse(response)

        callback(data.value)
      } else {
        callback(null)
      }
    })
  },
  set: (key, data) => {
    redisClient.set(key, fastStringify(data))
  },
  setex: (key, ttl, data) => {
    const expiredTime = ttl || 60

    redisClient.setex(key, expiredTime, fastStringify(data))
  },
  del: (key) => {
    redisClient.del(key, (err, res) => {
      if (err) console.error(err)
    })
  },
  delwild: (key) => {
    redisClient.delwild(key, (err, res) => {
      if (err) console.error(err)
    })
  },
  v2_get: (key) => {
    return new Promise((resolve, reject) => {
      redisClient.get(key, (err, response) => {
        if (!err && response) {
          const data = JSONparse(response)
          resolve(data.value)
        } else {
          if (err) reject(err)
          else resolve(null)
        }
      })
    })
  },
  hset: (hash, field, data) => {
    redisClient.hset(hash, field, fastStringify(data))
  },
  hget: (hash, field, callback) => {
    redisClient.hget(hash, field, (err, response) => {
      if (!err && response) {
        const data = JSONparse(response)

        callback(data.value)
      } else {
        callback(null)
      }
    })
  },
  v2_hget: (hash, field) => {
    return new Promise((resolve, reject) => {
      redisClient.hget(hash, field, (err, response) => {
        if (!err && response) {
          const data = JSONparse(response)
          resolve(data.value)
        } else {
          if (err) reject(err)
          else resolve(null)
        }
      })
    })
  },
  hdel: (hash, field) => {
    redisClient.hdel(hash, field)
  },
  expire: (key, ttl) => {
    redisClient.expire(key, ttl)
  },
  client: (cb) => cb(redisClientSubs),
  ttl: {
    FIVE_MINUTE: 300,
    TEN_MINUTE: 600,
    HALF_HOUR: 1800,
    ONE_HOUR: 3600,
    TWO_HOUR: 7200,
    SIX_HOUR: 21600,
    ONE_DAY: 3600 * 24
  }
}

module.exports = redisCache
