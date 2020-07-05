const log = require('../mixin')

exports.getStorageList = async (ctx) => {
  const sequelize = ctx.model
  try {
    const storageList = await sequelize.storage.findAll({
      where: {
        warehouse_id: ctx.state.user.warehouse_id
      },
      include: [
        {
          model: sequelize.logistics,
          as: 'logistics',
          attributes: ['tracking_no'],
          paranoid: false
        },
        {
          model: sequelize.warehouse,
          as: 'warehouse',
          attributes: ['warehouse_name', 'warehouse_no'],
          paranoid: false
        }
      ],
      order: [['id', 'DESC']]
    })
    ctx.body = {
      code: 200,
      storageList
    }
  }catch (e) {
    ctx.body = {
      code: 400,
      msg: 'fail'
    }
  }
}

exports.confirmTransfer = async (ctx) => {
  const sequelize = ctx.model
  const { body } = ctx.request
  const transaction = await sequelize.transaction()
  try {
    let deliveryList = []
    for (const index in body.selected) {
      body.selected[index].state = 1
      let delivery = {
        logistics_id: body.selected[index].logistics_id,
        state: 2,
        warehouse_id: body.selected[index].warehouse_id,
        transfer_to: body.warehouseId
      }
      deliveryList.push(delivery)
      await log.addOprationLog(ctx, body.selected[index].storage_no, 3, 1)
    }

    const result = await sequelize.storage.bulkCreate(
      body.selected,
      { updateOnDuplicate: ['state'] },
      transaction
    )
    await sequelize.delivery.bulkCreate(deliveryList, transaction)

    await transaction.commit()
    ctx.body = {
      code: 200,
      msg: '中转操作成功',
      res: result
    }
  } catch (error) {
    await transaction.rollback()
    ctx.body = {
      code: 400,
      msg: '中转操作失败',
      res: error
    }
  }
}

exports.confirmDistribute = async (ctx) => {
  const sequelize = ctx.model
  const { selected } = ctx.request.body
  const transaction = await sequelize.transaction()
  try {
    let deliveryList = []
    for (const index in selected) {
      selected[index].state = 1
      let delivery = {
        logistics_id: selected[index].logistics_id,
        state: 3,
        warehouse_id: selected[index].warehouse_id
      }
      deliveryList.push(delivery)
      await log.addOprationLog(ctx, selected[index].storage_no, 3, 1)
    }

    const result = await sequelize.storage.bulkCreate(
      selected,
      { updateOnDuplicate: ['state'] },
      transaction
    )
    await sequelize.delivery.bulkCreate(deliveryList, transaction)
    await transaction.commit()
    ctx.body = {
      code: 200,
      msg: '派送操作成功',
      res: result
    }
  } catch (error) {
    await transaction.rollback()
    ctx.body = {
      code: 400,
      msg: '派送操作失败',
      res: error
    }
  }
}

exports.delStorage = async (ctx) => {
  const sequelize = ctx.model
  const transaction = await sequelize.transaction()
  try {
    const storage = await sequelize.storage.findByPk(ctx.query.id)
    const storage_no = storage.storage_no
    const result = await sequelize.storage.destroy(
      { where: { id: ctx.query.id } },
      transaction
    )
    await log.addOprationLog(ctx, storage_no, 3, 2)
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
