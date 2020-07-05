const { BIGINT, STRING, INTEGER } = require('sequelize')
const sequelize = require('../config/index')

module.exports = sequelize.defineModel('user', {
  id: {
    // 用户编号
    type: BIGINT,
    primaryKey: true,
    autoIncrement: true,
    unique: true
  },
  account: STRING(30),
  password: STRING(50),
  real_name: STRING(30),
  phone_number: STRING(11),
  role_type: {
    type: INTEGER(1),
    defaultValue: 0
  },
  warehouse_id: {
    type: BIGINT,
    allowNull: true
  },
  state: {
    type: INTEGER(1),
    defaultValue: 0
  }
})
