const { BIGINT, STRING, INTEGER } = require('sequelize')
const sequelize = require('../config/index')

module.exports = sequelize.defineModel('storage', {
  id: {
    type: BIGINT,
    primaryKey: true,
    autoIncrement: true,
    unique: true
  },
  storage_no: {
    // 存储单号
    type: STRING(20),
    unique: true,
    set(val) {
      let storage_no = (Array(19).join(0) + val).slice(-19)
      storage_no = 'S' + storage_no.toString()
      this.setDataValue('storage_no', storage_no)
    }
  },
  logistics_id: BIGINT, // 物流单号
  warehouse_id: BIGINT, // 仓库编号
  state: {
    type: INTEGER(1),
    defaultValue: 0
  }
})
