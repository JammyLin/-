const router = require('koa-router')({ prefix: '/storage' })
const controller = require('./controller')

router.get('/', controller.getStorageList)

router.post('/transfer', controller.confirmTransfer)

router.post('/distribute', controller.confirmDistribute)

router.del('/', controller.delStorage)

module.exports = router
