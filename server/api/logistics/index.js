const router = require('koa-router')({ prefix: '/logistics' })
const controller = require('./controller')

router.get('/', controller.getLogisticsList)

router.post('/', controller.addLogistics)

router.del('/', controller.delLogistics)

module.exports = router
