const router = require('koa-router')({ prefix: '/vehicle' })
const controller = require('./controller')

router.get('/', controller.getVehicleList)

router.post('/', controller.addVehicle)

router.put('/', controller.updateVehicle)

router.del('/', controller.delVehicle)

module.exports = router
