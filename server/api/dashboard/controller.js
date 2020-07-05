const DateUtil = require('../../util/DateUtil')

exports.getDashBoardData = async (ctx) => {
  const sequelize = ctx.model

  const roleType = ctx.state.user.role_type
  const userId = ctx.state.user.id
  const warehouseId = ctx.state.user.warehouse_id

  let storageList
  let logisticsList
  let deliveryList
  let deliveryfinishedList
  try {
    if (roleType === 1) {
      // 快递员获取与自己相关的报表信息
      deliveryList = await sequelize.delivery.findAll({
        paranoid: false,
        where: { user_id: userId }
      })

      deliveryfinishedList = deliveryList.filter(
        (v) => v.state === 8 || v.state === 9
      )
    } else if (roleType === 4) {
      // 超级管理员获取所有仓库的报表信息
      storageList = await sequelize.storage.findAll({ paranoid: false })
      logisticsList = await sequelize.logistics.findAll({ paranoid: false })
    } else {
      // 否则只获取用户所属仓库的报表信息
      storageList = await sequelize.storage.findAll({
        paranoid: false,
        where: { warehouse_id: warehouseId }
      })
      logisticsList = await sequelize.logistics.findAll({
        paranoid: false,
        where: { warehouse_id: warehouseId }
      })
    }

    let data
    let todo
    if (roleType === 1) {
      const thisMonthCount = DateUtil.dateFilter(deliveryfinishedList).length
      const allDeliveryCount = deliveryfinishedList.length

      const unfinishedCount = deliveryList.filter(
        (v) => v.state !== 7 && v.state !== 8 && v.state !== 9
      ).length

      data = [thisMonthCount, allDeliveryCount]
      todo = [unfinishedCount]
    } else {
      const entryCount = DateUtil.dateFilter(storageList).length
      const outCount = DateUtil.dateFilter(storageList, 1).length
      const logisticsCount = DateUtil.dateFilter(logisticsList).length

      let storageCount
      let deliveryCount
      let vehicleCount
      if(roleType === 2) {
        storageCount = await sequelize.storage.count({
          where: {state: 0, warehouse_id: warehouseId}
        })
        deliveryCount = await sequelize.delivery.count({
          where: {vehicle_id: null, warehouse_id: warehouseId}
        })
        todo = [storageCount, deliveryCount]
      }else{
        vehicleCount = await sequelize.vehicle.count({
          where: {user_id: null, warehouse_id: warehouseId}
        })
        todo = [vehicleCount]
      }

      data = [logisticsCount, entryCount, outCount]
    }

    ctx.body = {
      code: 200,
      data,
      todo
    }
  } catch (e) {
    ctx.body = {
      code: 400,
      msg: 'fail'
    }
  }
}
