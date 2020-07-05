const router = require('koa-router')({ prefix: '/reservoir' })
const controller = require('./controller')

router.get('/', controller.getReservoirList)

router.post('/', controller.addReservoir)

router.put('/', controller.updateReservoir)

router.del('/', controller.delReservoir)

module.exports = router
