const object = ['仓库', '库区', '物流订单', '出入订单', '用户', '车辆']
const action = ['添加', '更新', '删除', '激活', '调整']

exports.addOprationLog = async (ctx, objectId, objectType, actionType) => {
  const sequelize = ctx.model
  const transaction = await sequelize.transaction()
  let info = `${ctx.state.user.account}(${ctx.state.user.id}) ${action[actionType]}了 `
  if (actionType === 1) info += `${object[objectType]}信息(${objectId})`
  else if (actionType === 4 && objectType === 0)
    info += `${object[objectType]}状态(${objectId})`
  else if (actionType === 4) info += `${object[objectType]}权限(${objectId})`
  else info += `${object[objectType]}(${objectId})`
  try {
    await sequelize.operationLog.create(
      {
        info,
        user_id: ctx.state.user.id,
        object_type: objectType,
        object_id: objectId,
        action: actionType
      },
      transaction
    )
    await transaction.commit()
  } catch (error) {
    await transaction.rollback()
    consola.warn(error)
  }
}

exports.addUserLog = async (ctx, id, action) => {
  const sequelize = ctx.model
  const transaction = await sequelize.transaction()
  try {
    await sequelize.userLog.create(
      {
        user_id: id,
        ip: ctx.request.ip,
        action: action
      },
      transaction
    )
    await transaction.commit()
  } catch (error) {
    await transaction.rollback()
    consola.warn(error)
  }
}
