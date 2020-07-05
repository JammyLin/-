const log = require('../mixin')

exports.getReservoirList = async (ctx) => {
  const sequelize = ctx.model
  let param = {}
  if (ctx.state.user.warehouse_id !== null)
    param = {
      warehouse_id: ctx.state.user.warehouse_id
    }
  try {
    const reservoirList = await sequelize.reservoir.findAll({
      where: param,
      include: [
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
      reservoirList: reservoirList
    }
  } catch (e) {
    ctx.body = {
      code: 400,
      msg: 'fail'
    }
  }
}

exports.addReservoir = async (ctx) => {
  const sequelize = ctx.model
  const { body } = ctx.request

  const isExist = await sequelize.reservoir.findOne({
    where: { reservoir_no: body.reservoir_no }
  })
  if (isExist) {
    ctx.body = {
      code: 401,
      msg: '该货区编号已存在'
    }
    return
  }

  const transaction = await sequelize.transaction()
  try {
    const reservoir = await sequelize.reservoir.create(body, transaction)
    await log.addOprationLog(ctx, body.reservoir_no, 1, 0)
    await transaction.commit()
    ctx.body = {
      code: 200,
      msg: '添加成功',
      instance: reservoir
    }
  } catch (error) {
    await transaction.rollback()
    ctx.body = {
      code: 400,
      msg: '添加失败',
      instance: error
    }
  }
}

exports.updateReservoir = async (ctx) => {
  const sequelize = ctx.model
  const { body } = ctx.request
  const transaction = await sequelize.transaction()
  try {
    const result = await sequelize.reservoir.update(
      body,
      { where: { id: body.id } },
      transaction
    )
    await log.addOprationLog(ctx, body.reservoir_no, 1, 1)
    await transaction.commit()
    ctx.body = {
      code: 200,
      msg: '修改成功',
      instance: result
    }
  } catch (error) {
    await transaction.rollback()
    ctx.body = {
      code: 400,
      msg: '修改失败',
      instance: error
    }
  }
}

exports.delReservoir = async (ctx) => {
  const sequelize = ctx.model
  const transaction = await sequelize.transaction()
  try {
    const reservoir = await sequelize.reservoir.findByPk(ctx.query.id)
    const reservoir_no = reservoir.reservoir_no
    const result = await sequelize.reservoir.destroy(
      { where: { id: ctx.query.id } },
      transaction
    )
    await log.addOprationLog(ctx, reservoir_no, 1, 2)
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
