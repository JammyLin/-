const { BIGINT, STRING, INTEGER, TEXT } = require('sequelize')
const sequelize = require('../config/index')

module.exports = sequelize.defineModel('warehouse', {
  id: {
    type: BIGINT,
    primaryKey: true,
    autoIncrement: true,
    unique: true
  },
  warehouse_no: STRING(20), // 仓库编号
  warehouse_name: STRING, // 仓库名称
  state: {
    type: INTEGER(1),
    defaultValue: 0
  },
  remark: {
    type: TEXT,
    allowNull: true
  }
})
