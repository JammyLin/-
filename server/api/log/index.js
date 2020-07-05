const router = require('koa-router')({ prefix: '/log' })
const controller = require('./controller')

router.get('/operation', controller.getOperationLogList)

router.get('/user', controller.getUserLogList)

module.exports = router
