'use strict'

const bcrypt = require('bcrypt')

const hash = {
  hashPassword: (password, saltRounds = 10) => {
    return bcrypt.hashSync(password, saltRounds)
  },
  verifyPassword: (password, hash) => {
    return bcrypt.compareSync(password, hash.replace('$2y$', '$2a$'))
  }
}

module.exports = hash
