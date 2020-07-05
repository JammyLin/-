const crypto = require('crypto')
const Op = require('sequelize').Op
const log = require('../mixin')

exports.getUserList = async (ctx) => {
  const sequelize = ctx.model
  let param = {}
  if (ctx.state.user.warehouse_id)
    param = {
      [Op.or]: [{ warehouse_id: ctx.state.user.warehouse_id }, { state: 0 }]
    }
  const userList = await sequelize.user.findAll({
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

  for (let index in userList) {
    userList[index].password = ''
    if (ctx.query.format)
      userList[
        index
      ].real_name = `${userList[index].real_name}(${userList[index].account})`
  }
  ctx.body = {
    code: 200,
    userList: userList
  }
}

exports.activate = async (ctx) => {
  const sequelize = ctx.model
  const { body } = ctx.request

  const transaction = await sequelize.transaction()
  try {
    const user = await sequelize.user.findByPk(body.id)
    const account = user.account
    const result = await sequelize.user.update(
      {
        state: 1,
        role_type: 1,
        warehouse_id: body.warehouse_id
      },
      { where: { id: body.id } },
      transaction
    )
    await log.addOprationLog(ctx, account, 4, 3)
    await transaction.commit()
    ctx.body = {
      code: 200,
      msg: '账号激活成功',
      res: result
    }
  } catch (error) {
    await transaction.rollback()
    ctx.body = {
      code: 400,
      msg: '账号激活失败',
      res: error
    }
  }
}

exports.delUser = async (ctx) => {
  const sequelize = ctx.model
  const transaction = await sequelize.transaction()
  try {
    const user = await sequelize.user.findByPk(ctx.query.id, {
      include: [
        {
          model: sequelize.delivery,
          as: 'delivery'
        },
        {
          model: sequelize.vehicle,
          as: 'vehicle'
        }
      ]
    })

    const unfinished = user.delivery.filter(
      (v) => v.state !== 7 && v.state !== 8 && v.state !== 9
    )

    if (unfinished.length) {
      ctx.body = {
        code: 400,
        msg: '该用户有任务，无法删除'
      }
      return
    }

    if (user.vehicle)
      await sequelize.vehicle.update(
        { user_id: null },
        { where: { id: user.vehicle.id } },
        transaction
      )

    const result = await sequelize.user.destroy(
      { where: { id: ctx.query.id } },
      transaction
    )
    const account = user.account
    await log.addOprationLog(ctx, account, 4, 2)
    await transaction.commit()
    ctx.body = {
      code: 200,
      msg: '账号删除成功',
      res: result
    }
  } catch (error) {
    await transaction.rollback()
    ctx.body = {
      code: 400,
      msg: '账号删除失败',
      res: error
    }
  }
}

exports.register = async (ctx) => {
  const sequelize = ctx.model
  const { body } = ctx.request
  if (
    body.account === '' ||
    body.password === '' ||
    body.real_name === '' ||
    body.phone_number === ''
  ) {
    ctx.body = {
      code: 400,
      msg: '请正确填写注册信息'
    }
    return
  }
  const user = await sequelize.user.findOne({
    where: { account: body.account }
  })
  if (user) {
    ctx.body = {
      code: 400,
      msg: '用户名已存在'
    }
    return
  }
  const transaction = await sequelize.transaction()
  body.password = crypto
    .createHash('md5')
    .update(body.password)
    .digest('hex')
  try {
    const user = await sequelize.user.create(body, transaction)
    await transaction.commit()
    if (body.isLogin) {
      user.password = ''
      ctx.body = {
        code: 200,
        msg: '注册成功，请进行激活',
        user
      }
    } else
      ctx.body = {
        code: 200,
        msg: '注册成功，请通知管理员激活'
      }
  } catch (error) {
    await transaction.rollback()
    ctx.body = {
      code: 400,
      msg: '注册失败'
    }
  }
}

exports.changeAuth = async (ctx) => {
  const sequelize = ctx.model
  const { body } = ctx.request

  const transaction = await sequelize.transaction()
  try {
    const user = await sequelize.user.findByPk(body.id)
    const account = user.account
    const result = await sequelize.user.update(
      {
        role_type: body.role_type
      },
      { where: { id: body.id } },
      transaction
    )
    await log.addOprationLog(ctx, account, 4, 4)
    await transaction.commit()
    ctx.body = {
      code: 200,
      msg: '权限调整成功',
      res: result
    }
  } catch (error) {
    await transaction.rollback()
    ctx.body = {
      code: 400,
      msg: '权限调整失败',
      res: error
    }
  }
}

exports.changePassword = async (ctx) => {
  const sequelize = ctx.model
  const { body } = ctx.request

  const transaction = await sequelize.transaction()
  try {
    const user = await sequelize.user.findByPk(ctx.state.user.id)

    body.oldPassword = crypto
      .createHash('md5')
      .update(body.oldPassword)
      .digest('hex')

    if (user.password === body.oldPassword) {
      user.password = crypto
        .createHash('md5')
        .update(body.newPassword)
        .digest('hex')
      await user.save(transaction)

      await transaction.commit()
      ctx.body = {
        code: 200,
        msg: '密码修改成功'
      }
    } else {
      ctx.body = {
        code: 401,
        msg: '旧密码不正确'
      }
    }
  } catch (error) {
    await transaction.rollback()
    ctx.body = {
      code: 400,
      msg: '密码修改失败',
      res: error
    }
  }
}
