const { BIGINT, STRING, INTEGER } = require('sequelize')
const sequelize = require('../config/index')

module.exports = sequelize.defineModel(
  'user_log',
  {
    id: {
      // 用户日志编号
      type: BIGINT,
      primaryKey: true,
      autoIncrement: true,
      unique: true
    },
    user_id: BIGINT,
    ip: STRING,
    action: INTEGER(1)
  },
  {
    paranoid: false,
    updatedAt: false,
    deletedAt: false
  }
)
