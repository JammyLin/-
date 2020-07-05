const Op = require('sequelize').Op
const log = require('../mixin')

exports.getWarehouseList = async (ctx) => {
  const sequelize = ctx.model
  let param = {}
  if (ctx.state.user.role_type !== 4)
    param = { id: ctx.state.user.warehouse_id }
  if (ctx.query.all)
    param = { state: 1, id: { [Op.ne]: ctx.state.user.warehouse_id } }
  try {
    const warehouseList = await sequelize.warehouse.findAll({
      where: param,
      order: [['id', 'DESC']]
    })
    if (ctx.query.format)
      for (const index in warehouseList) {
        warehouseList[
          index
        ].warehouse_name = `${warehouseList[index].warehouse_name}(${warehouseList[index].warehouse_no})`
      }
    ctx.body = {
      code: 200,
      warehouseList: warehouseList
    }
  } catch (e) {
    ctx.body = {
      code: 400,
      msg: 'fail'
    }
  }
}

exports.delWarehouse = async (ctx) => {
  const sequelize = ctx.model
  const transaction = await sequelize.transaction()
  try {
    const warehouse = await sequelize.warehouse.findByPk(ctx.query.id)
    const warehouse_no = warehouse.warehouse_no
    const result = await sequelize.warehouse.destroy(
      { where: { id: ctx.query.id } },
      transaction
    )
    await log.addOprationLog(ctx, warehouse_no, 0, 2)
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

exports.addWarehouse = async (ctx) => {
  const sequelize = ctx.model
  let { body } = ctx.request

  const isExist = await sequelize.warehouse.findOne({
    where: { warehouse_no: body.warehouse_no }
  })
  if (isExist) {
    ctx.body = {
      code: 401,
      msg: '该仓库编号已存在'
    }
    return
  }

  const transaction = await sequelize.transaction()
  try {
    const warehouse = await sequelize.warehouse.create(body, transaction)
    await log.addOprationLog(ctx, body.warehouse_no, 0, 0)
    await transaction.commit()
    ctx.body = {
      code: 200,
      msg: '添加成功',
      instance: warehouse
    }
  } catch (error) {
    await transaction.rollback()
    consola.warn(error)
    ctx.body = {
      code: 400,
      msg: '添加失败',
      res: error
    }
  }
}

exports.updateWarehouse = async (ctx) => {
  const sequelize = ctx.model
  let { body } = ctx.request

  const transaction = await sequelize.transaction()
  try {
    await sequelize.warehouse.update(
      body,
      { where: { id: body.id } },
      transaction
    )
    await log.addOprationLog(ctx, body.warehouse_no, 0, 1)
    await transaction.commit()
    ctx.body = {
      code: 200,
      msg: '修改成功',
      instance: body
    }
  } catch (error) {
    await transaction.rollback()
    ctx.body = {
      code: 400,
      msg: '修改失败',
      res: error
    }
  }
}

exports.changeState = async (ctx) => {
  const sequelize = ctx.model
  const { body } = ctx.request
  const transaction = await sequelize.transaction()
  try {
    const warehouse = await sequelize.warehouse.findByPk(body.id)
    const warehouse_no = warehouse.warehouse_no
    const result = await sequelize.warehouse.update(
      { state: body.state },
      { where: { id: body.id } },
      transaction
    )
    await log.addOprationLog(ctx, warehouse_no, 0, 4)
    await transaction.commit()
    ctx.body = {
      code: 200,
      msg: '状态修改成功',
      res: result
    }
  } catch (error) {
    await transaction.rollback()
    consola.warn(error)
    ctx.body = {
      code: 400,
      msg: '状态修改失败',
      res: error
    }
  }
}
