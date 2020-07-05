const { BIGINT, STRING, TEXT } = require('sequelize')
const sequelize = require('../config/index')

module.exports = sequelize.defineModel('reservoir', {
  id: {
    type: BIGINT,
    primaryKey: true,
    autoIncrement: true,
    unique: true
  },
  reservoir_no: STRING(20), // 货区编号
  reservoir_name: STRING, // 货区名称
  warehouse_id: BIGINT, // 仓库编号
  remark: {
    type: TEXT,
    allowNull: true
  }
})
