'use strict'

const { Model } = require('objection')
Model.knex(knex)

class usersModels extends Model {
  static get tableName () {
    return 'quantum_storepedia_admins'
  }
}

module.exports = usersModels
