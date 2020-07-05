const { BIGINT, INTEGER } = require('sequelize')
const sequelize = require('../config/index')

module.exports = sequelize.defineModel('delivery', {
  id: {
    type: BIGINT,
    primaryKey: true,
    autoIncrement: true,
    unique: true
  },
  logistics_id: BIGINT,
  vehicle_id: {
    type: BIGINT,
    allowNull: true
  },
  user_id: {
    type: BIGINT,
    allowNull: true
  },
  warehouse_id: BIGINT,
  transfer_to: {
    type: BIGINT,
    allowNull: true
  },
  state: INTEGER(1)
})
