'use strict'

const BASE_DOMAIN = process.env.BASE_DOMAIN || 'quantum.local'
const PORT = process.env.APP_HTTP_PORT

const config = {
  ROOT: process.cwd(),
  APP: {
    name: BASE_DOMAIN
  },
  SERVER: {
    PORT: PORT,
    HOSTNAME: process.env.HOSTNAME || '127.0.0.1',
    QUEUE: process.env.QUEUE_PORT
  },
  DATABASE: {
    MAIN: process.env.DATABASE_STRING
  },
  redis: {
    baseCache: {
      host: process.env.REDIS_API_CACHE_HOST || '127.0.0.1',
      port: process.env.REDIS_API_CACHE_PORT || 6379,
      options: {
        db: 5,
        disable_resubscribing: true
      },
      auth_pass: process.env.REDIS_API_CACHE_PASSWORD
    }
  },
  SESSION_SECRET: process.env.SESSION_SECRET || '56,-{]}+@2)`<}[=.79=42]((?77~+8<3{]}',
  TOKEN_CLIENT_SECRET: process.env.TOKEN_CLIENT_SECRET || 's3c4pa2e3t',
  BITLY_TOKEN: process.env.BITLY_TOKEN,
  GOOGLE: {
    FILE: process.env.GOOGLE_FILE,
    BUCKET_NAME: process.env.GOOGLE_BUCKET_NAME,
    PROJECT_ID: process.env.GOOGLE_PROJECT_ID
  },
  AWS: {
    S3: {
      ACCESS_KEY: process.env.S3_ACCESS_KEY,
      SECRET: process.env.S3_SECRET,
      BUCKET: process.env.S3_BUCKET
    }
  },
  CHANNEL_ID: process.env.CHANNEL_ID || 7
}

module.exports = config
