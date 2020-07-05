exports.getOperationLogList = async (ctx) => {
  const sequelize = ctx.model
  try {
    let logList
    const result = await sequelize.operationLog.findAll({
      include: {
        model: sequelize.user,
        as: 'user',
        attributes: ['warehouse_id'],
        paranoid: false
      },
      order: [['id', 'DESC']]
    })

    if (ctx.state.user.role_type !== 4)
      logList = result.filter(
        (v) => v.user.warehouse_id === ctx.state.user.warehouse_id
      )
    else logList = result

    ctx.body = {
      code: 200,
      logList: logList
    }
  } catch (e) {
    ctx.body = {
      code: 400,
      msg: 'fail'
    }
  }
}

exports.getUserLogList = async (ctx) => {
  const sequelize = ctx.model
  try {
    let logList
    const result = await sequelize.userLog.findAll({
      include: {
        model: sequelize.user,
        as: 'user',
        attributes: ['real_name', 'account', 'warehouse_id'],
        paranoid: false
      },
      order: [['id', 'DESC']]
    })

    if (ctx.state.user.role_type !== 4)
      logList = result.filter(
        (v) => v.user.warehouse_id === ctx.state.user.warehouse_id
      )
    else logList = result

    ctx.body = {
      code: 200,
      logList: logList
    }
  } catch (e) {
    ctx.body = {
      code: 400,
      msg: 'fail'
    }
  }
}
