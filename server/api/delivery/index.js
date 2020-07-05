const router = require('koa-router')({ prefix: '/delivery' })
const controller = require('./controller')

router.get('/', controller.getDeliveryList)

router.post('/assign', controller.assign)

router.post('/finish', controller.finish)

router.del('/', controller.delDelivery)

module.exports = router
