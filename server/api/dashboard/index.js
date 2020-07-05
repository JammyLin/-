const router = require('koa-router')({ prefix: '/dashboard' })
const controller = require('./controller')

router.get('/',controller.getDashBoardData)

module.exports = router
