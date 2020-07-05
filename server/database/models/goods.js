const { BIGINT, STRING } = require('sequelize')
const sequelize = require('../config/index')

module.exports = sequelize.defineModel('goods', {
  id: {
    type: BIGINT,
    primaryKey: true,
    autoIncrement: true,
    unique: true
  },
  goods_name: STRING,
  goods_number: BIGINT,
  logistics_id: BIGINT
})
