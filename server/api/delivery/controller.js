exports.getDeliveryList = async (ctx) => {
  const sequelize = ctx.model
  let param = {
    warehouse_id: ctx.state.user.warehouse_id
  }
  if (ctx.state.user.role_type === 1) param.user_id = ctx.state.user.id
  try {
    const deliveryList = await sequelize.delivery.findAll({
      where: param,
      include: [
        {
          model: sequelize.logistics,
          as: 'logistics',
          attributes: ['tracking_no'],
          paranoid: false
        },
        {
          model: sequelize.vehicle,
          as: 'vehicle',
          attributes: ['vehicle_no'],
          paranoid: false
        },
        {
          model: sequelize.user,
          as: 'user',
          attributes: ['real_name', 'account'],
          paranoid: false
        }
      ],
      order: [['id', 'DESC']]
    })
    ctx.body = {
      code: 200,
      deliveryList: deliveryList
    }
  }catch (e) {
    ctx.body = {
      code: 400,
      msg: 'fail'
    }
  }
}

exports.assign = async (ctx) => {
  const sequelize = ctx.model
  const { body } = ctx.request
  const transaction = await sequelize.transaction()
  try {
    for (let index in body.selected) {
      body.selected[index].vehicle_id = body.vehicle_id
      body.selected[index].user_id = body.user_id
      body.selected[index].state += 3
    }

    const result = await sequelize.delivery.bulkCreate(
      body.selected,
      { updateOnDuplicate: ['vehicle_id', 'user_id', 'state'] },
      transaction
    )
    await transaction.commit()
    ctx.body = {
      code: 200,
      msg: '快递分配成功',
      instance: body.selected,
      res: result
    }
  } catch (error) {
    await transaction.rollback()
    ctx.body = {
      code: 400,
      msg: '快递分配失败',
      res: error
    }
  }
}

exports.finish = async (ctx) => {
  const sequelize = ctx.model
  const { selected } = ctx.request.body
  const transaction = await sequelize.transaction()
  let storageList = []
  try {
    const lastStorage = await sequelize.storage.count({ paranoid: false })
    let storage_no = 1
    if (lastStorage.length !== 0) storage_no = lastStorage + 1

    for (let index in selected) {
      if (selected[index].state === 4) {
        const storage = {
          storage_no,
          logistics_id: selected[index].logistics_id,
          warehouse_id: selected[index].warehouse_id
        }
        storageList.push(storage)
        storage_no++
        await sequelize.logistics.update(
          { state: 1 },
          { where: { tracking_no: selected[index].tracking_no } },
          transaction
        )
      } else if (selected[index].state === 5) {
        const storage = {
          storage_no,
          logistics_id: selected[index].logistics_id,
          warehouse_id: selected[index].transfer_to
        }
        storageList.push(storage)
        storage_no++
      } else
        await sequelize.logistics.update(
          { state: 2 },
          { where: { tracking_no: selected[index].tracking_no } },
          transaction
        )
      selected[index].state += 3
    }

    const result = await sequelize.delivery.bulkCreate(
      selected,
      { updateOnDuplicate: ['state'] },
      transaction
    )
    await sequelize.storage.bulkCreate(storageList, transaction)

    await transaction.commit()
    ctx.body = {
      code: 200,
      msg: '确认成功',
      instance: selected,
      res: result
    }
  } catch (error) {
    await transaction.rollback()
    ctx.body = {
      code: 400,
      msg: '确认失败',
      res: error
    }
  }
}

exports.delDelivery = async (ctx) => {
  const sequelize = ctx.model
  const transaction = await sequelize.transaction()
  try {
    const result = await sequelize.delivery.destroy(
      { where: { id: ctx.query.id } },
      transaction
    )
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
