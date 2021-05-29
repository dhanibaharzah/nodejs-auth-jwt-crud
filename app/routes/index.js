/* global */

'use strict'

const fs = require('fs')
const path = require('path')

module.exports = (fastify) => {
  fs.readdirSync(CONFIG.ROOT + '/app/routes').forEach((dir) => {
    if (!~dir.indexOf('.js')) {
      fs.readdirSync(CONFIG.ROOT + `/app/routes/${dir}`).forEach((file) => {
        const extname = path.extname(file)
        const basename = path.basename(file, extname)
        if (~file.indexOf('.js') && basename !== 'index') {
          fastify.register(require(CONFIG.ROOT + `/app/routes/${dir}/${file}`), { prefix: `/${dir}/${basename}` })
        }
      })
    }
  })

  fastify.get('/ping-pong', async (request, reply) => {
    return { status: 'succeed' }
  })
}
