const warehouse = require('./models/warehouse')
const user = require('./models/user')
const reservoir = require('./models/reservoir')
const storage = require('./models/storage')
const logistics = require('./models/logistics')
const vehicle = require('./models/vehicle')
const goods = require('./models/goods')
const delivery = require('./models/delivery')
const userLog = require('./models/userLog')
const operationLog = require('./models/operationLog')

// 仓库有多个员工
warehouse.hasMany(user, { foreignKey: 'warehouse_id', as: 'user' })
// 也可以员工查仓库
user.belongsTo(warehouse, { foreignKey: 'warehouse_id', as: 'warehouse' })

// 仓库有多个货区
warehouse.hasMany(reservoir, { foreignKey: 'warehouse_id', as: 'reservoir' })
// 也可以货区查仓库
reservoir.belongsTo(warehouse, { foreignKey: 'warehouse_id', as: 'warehouse' })

// 仓库有多个货物出入单
warehouse.hasMany(storage, { foreignKey: 'warehouse_id', as: 'storage' })
// 也可以货物出入单查仓库仓库
storage.belongsTo(warehouse, { foreignKey: 'warehouse_id', as: 'warehouse' })

// 物流单有多个货物出入单
logistics.hasMany(storage, { foreignKey: 'logistics_id', as: 'storage' })
// 也可以货物出入单查物流单
storage.belongsTo(logistics, { foreignKey: 'logistics_id', as: 'logistics' })

// 仓库有多个物流订单
warehouse.hasMany(logistics, { foreignKey: 'warehouse_id', as: 'logistics' })
// 也可以物流订单查仓库
logistics.belongsTo(warehouse, { foreignKey: 'warehouse_id', as: 'warehouse' })

// 车辆对应一个快递员
user.hasOne(vehicle, { foreignKey: 'user_id', as: 'vehicle' })
// 也可以快递员查车辆
vehicle.belongsTo(user, { foreignKey: 'user_id', as: 'user' })

// 仓库有多辆车辆
warehouse.hasMany(vehicle, { foreignKey: 'warehouse_id', as: 'vehicle' })
// 也可以车辆查仓库
vehicle.belongsTo(warehouse, { foreignKey: 'warehouse_id', as: 'warehouse' })

// 物流单有多个商品
logistics.hasMany(goods, { foreignKey: 'logistics_id', as: 'goods' })
// 也可以商品查物流单
goods.belongsTo(logistics, { foreignKey: 'logistics_id', as: 'logistics' })

// 仓库有多个快递任务
warehouse.hasMany(delivery, { foreignKey: 'warehouse_id', as: 'delivery' })
// 也可以快递任务查仓库
delivery.belongsTo(warehouse, { foreignKey: 'warehouse_id', as: 'warehouse' })

// 物流订单有多次快递任务
logistics.hasMany(delivery, { foreignKey: 'logistics_id', as: 'delivery' })
// 也可以快递任务查物流订单
delivery.belongsTo(logistics, { foreignKey: 'logistics_id', as: 'logistics' })

// 车辆有多个快递任务
vehicle.hasMany(delivery, { foreignKey: 'vehicle_id', as: 'delivery' })
// 也可以快递任务查车辆
delivery.belongsTo(vehicle, { foreignKey: 'vehicle_id', as: 'vehicle' })

// 用户有多个快递任务
user.hasMany(delivery, { foreignKey: 'user_id', as: 'delivery' })
// 也可以快递任务查用户
delivery.belongsTo(user, { foreignKey: 'user_id', as: 'user' })

// 用户有多个用户日志
user.hasMany(userLog, { foreignKey: 'user_id', as: 'userLog' })
// 也可以用户日志查用户
userLog.belongsTo(user, { foreignKey: 'user_id', as: 'user' })

// 用户有多个操作日志
user.hasMany(operationLog, { foreignKey: 'user_id', as: 'operationLog' })
// 也可以操作日志查用户
operationLog.belongsTo(user, { foreignKey: 'user_id', as: 'user' })

module.exports = {
  warehouse,
  user,
  reservoir,
  storage,
  logistics,
  vehicle,
  goods,
  delivery,
  userLog,
  operationLog
}
