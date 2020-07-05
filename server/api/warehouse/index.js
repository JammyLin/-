const router = require('koa-router')({ prefix: '/warehouse' })
const controller = require('./controller')

router.get('/', controller.getWarehouseList)

router.del('/', controller.delWarehouse)

router.post('/', controller.addWarehouse)

router.put('/', controller.updateWarehouse)

router.put('/state', controller.changeState)

module.exports = router
