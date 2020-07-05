const log = require('../mixin')

exports.getLogisticsList = async (ctx) => {
  const sequelize = ctx.model
  let param = {}
  if (ctx.state.user.warehouse_id !== null)
    param = {
      warehouse_id: ctx.state.user.warehouse_id
    }
  try {
    const logisticsList = await sequelize.logistics.findAll({
      where: param,
      order: [['id', 'DESC']],
      include: { model: sequelize.goods, as: 'goods' }
    })
    ctx.body = {
      code: 200,
      logisticsList: logisticsList
    }
  }catch (e) {
    ctx.body = {
      code: 400,
      msg: 'fail'
    }
  }

}

exports.addLogistics = async (ctx) => {
  const sequelize = ctx.model
  // 获取最后一条数据的id
  const lastLogistics = await sequelize.logistics.count({ paranoid: false })
  const logistics_info = ctx.request.body

  let tracking_no = 1
  // 如若有数据才修改编号
  if (lastLogistics !== 0) tracking_no = lastLogistics + 1
  // 不足位补零
  tracking_no = (Array(14).join(0) + tracking_no).slice(-14)
  logistics_info['tracking_no'] = 'L' + tracking_no.toString()
  logistics_info['warehouse_id'] = ctx.state.user.warehouse_id

  const logistics_transaction = await sequelize.transaction()
  const other_transaction = await sequelize.transaction()
  try {
    const logistics = await sequelize.logistics.create(
      logistics_info,
      logistics_transaction
    )

    let goodsList = []
    if (logistics_info.goodsList.length !== 0) {
      for (let index in logistics_info.goodsList)
        logistics_info.goodsList[index].logistics_id = logistics.id

      goodsList = await sequelize.goods.bulkCreate(
        logistics_info.goodsList,
        other_transaction
      )
    }

    if (logistics_info.type === 0)
      await sequelize.delivery.create(
        {
          logistics_id: logistics.id,
          state: 1,
          warehouse_id: ctx.state.user.warehouse_id
        },
        other_transaction
      )
    else {
      const lastStorage = await sequelize.storage.findAll({
        order: [['id', 'DESC']],
        limit: 1
      })
      let storage_no = 1
      if (lastStorage.length !== 0) storage_no = lastStorage.id + 1
      await sequelize.storage.create(
        {
          storage_no,
          logistics_id: logistics.id,
          warehouse_id: ctx.state.user.warehouse_id
        },
        other_transaction
      )
      await sequelize.logistics.update(
        { state: 1 },
        { where: { id: logistics.id } },
        other_transaction
      )
      logistics.state = 1
    }

    await log.addOprationLog(ctx, tracking_no, 2, 0)

    await logistics_transaction.commit()
    await other_transaction.commit()
    ctx.body = {
      code: 200,
      msg: '添加成功',
      instance: logistics,
      goods: goodsList
    }
  } catch (error) {
    await logistics_transaction.rollback()
    await other_transaction.rollback()
    ctx.body = {
      code: 400,
      msg: '添加失败',
      instance: error
    }
  }
}

exports.delLogistics = async (ctx) => {
  const sequelize = ctx.model
  const transaction = await sequelize.transaction()
  try {
    const logistics = await sequelize.logistics.findByPk(ctx.query.id)
    const tracking_no = logistics.tracking_no
    const result = await sequelize.logistics.destroy(
      { where: { id: ctx.query.id } },
      transaction
    )
    await log.addOprationLog(ctx, tracking_no, 2, 2)
    await transaction.commit()
    ctx.body = {
      code: 200,
      msg: '删除成功',
      res: result
    }
  } catch (error) {
    await transaction.rollback()
    ctx.body = {
      code: 400,
      msg: '删除失败',
      res: error
    }
  }
}
