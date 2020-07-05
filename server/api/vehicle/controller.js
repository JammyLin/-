const log = require('../mixin')
const Op = require('sequelize').Op

exports.getVehicleList = async (ctx) => {
  const sequelize = ctx.model
  try {
    const vehicleList = await sequelize.vehicle.findAll({
      where: {
        warehouse_id: ctx.state.user.warehouse_id
      },
      include: [
        {
          model: sequelize.user,
          as: 'user',
          attributes: ['account', 'real_name', 'id'],
          paranoid: false
        }
      ],
      order: [['id', 'DESC']]
    })
    ctx.body = {
      code: 200,
      vehicleList: vehicleList
    }
  } catch (e) {
    ctx.body = {
      code: 400,
      msg: 'fail'
    }
  }
}

exports.addVehicle = async (ctx) => {
  const sequelize = ctx.model
  let { body } = ctx.request

  const isAssign = await sequelize.vehicle.findOne({
    where: { user_id: body.user_id }
  })
  if (body.user_id && isAssign) {
    ctx.body = {
      code: 401,
      msg: '该用户已分配车辆'
    }
    return
  }

  const isExist = await sequelize.vehicle.findOne({
    where: { vehicle_no: body.vehicle_no }
  })
  if (isExist) {
    ctx.body = {
      code: 401,
      msg: '该车牌号已存在'
    }
    return
  }

  const transaction = await sequelize.transaction()
  try {
    const vehicle = await sequelize.vehicle.create(body, transaction)
    await log.addOprationLog(ctx, body.vehicle_no, 5, 0)
    await transaction.commit()
    ctx.body = {
      code: 200,
      msg: '添加成功',
      instance: vehicle
    }
  } catch (error) {
    await transaction.rollback()
    ctx.body = {
      code: 400,
      msg: '添加失败',
      res: error
    }
  }
}

exports.updateVehicle = async (ctx) => {
  const sequelize = ctx.model
  let { body } = ctx.request

  const vehicle = await sequelize.vehicle.findOne({
    where: { user_id: body.user_id }
  })
  if (body.user_id && vehicle && vehicle.id !== body.id) {
    ctx.body = {
      code: 401,
      msg: '该用户已分配车辆'
    }
    return
  }

  const transaction = await sequelize.transaction()
  try {
    await sequelize.vehicle.update(
      body,
      { where: { id: body.id } },
      transaction
    )
    await log.addOprationLog(ctx, body.vehicle_no, 5, 1)
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

exports.delVehicle = async (ctx) => {
  const sequelize = ctx.model
  const transaction = await sequelize.transaction()
  try {
    const vehicle = await sequelize.vehicle.findByPk(ctx.query.id, {
      include: [
        {
          model: sequelize.delivery,
          as: 'delivery',
          where: { state: { [Op.ne]: [7, 8, 9] } }
        }
      ]
    })

    if (vehicle.delivery.length) {
      ctx.body = {
        code: 400,
        msg: '该车辆有任务，无法删除'
      }
      return
    }

    const result = await sequelize.vehicle.destroy(
      { where: { id: ctx.query.id } },
      transaction
    )

    const vehicle_no = vehicle.vehicle_no
    await log.addOprationLog(ctx, vehicle_no, 5, 2)

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
