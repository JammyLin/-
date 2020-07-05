const { BIGINT, STRING, INTEGER } = require('sequelize')
const sequelize = require('../config/index')

module.exports = sequelize.defineModel('vehicle', {
  id: {
    type: BIGINT,
    primaryKey: true,
    autoIncrement: true,
    unique: true
  },
  vehicle_no: STRING(8), // 车辆牌号
  user_id: {
    type: BIGINT,
    allowNull: true
  }, // 送货员编号
  warehouse_id: BIGINT,
  state: {
    type: INTEGER(1),
    defaultValue: 0
  }
})
