const { BIGINT, TEXT, INTEGER, STRING } = require('sequelize')
const sequelize = require('../config/index')

module.exports = sequelize.defineModel(
  'operation_log',
  {
    id: {
      // 操作日志编号
      type: BIGINT,
      primaryKey: true,
      autoIncrement: true,
      unique: true
    },
    info: TEXT, // 所操作的订单号或编号
    user_id: BIGINT, // 用户编号
    // 1.仓库 2.库区 3.物流订单 4.出入订单 5.用户 6.车辆
    object_type: INTEGER(1),
    object_id: STRING(20),
    // 1.创建 2.修改 3.删除 4.激活 5.调整
    action: INTEGER(1)
  },
  {
    paranoid: false,
    updatedAt: false,
    deletedAt: false
  }
)
