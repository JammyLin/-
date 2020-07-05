const { BIGINT, STRING, INTEGER, TEXT, DECIMAL } = require('sequelize')
const sequelize = require('../config/index')

module.exports = sequelize.defineModel('logistics', {
  id: {
    type: BIGINT,
    primaryKey: true,
    autoIncrement: true,
    unique: true
  },
  tracking_no: {
    // 物流单号
    type: STRING(20),
    unique: true
  },
  shipper: STRING(50), // 寄件人姓名
  shipper_phone: STRING(11), // 寄件人电话
  departure: STRING, // 始发地
  consignee: STRING(50), // 收件人姓名
  consignee_phone: STRING(11), // 收件人电话
  consignee_address: STRING, // 收件人地址
  weight: DECIMAL(18, 2), // 货物重量
  cost: DECIMAL(18, 2), // 货物费用
  settlement_modes: INTEGER(1),
  warehouse_id: BIGINT, // 始发仓库
  state: {
    // 货物状态
    type: INTEGER(1),
    defaultValue: 0
  },
  remark: {
    //备注
    type: TEXT,
    allowNull: true
  }
})
