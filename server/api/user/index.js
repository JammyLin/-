const router = require('koa-router')({ prefix: '/user' })
const controller = require('./controller')

router.get('/', controller.getUserList)

router.put('/activate', controller.activate)

router.put('/auth', controller.changeAuth)

router.post('/', controller.register)

router.put('/change', controller.changePassword)

router.del('/', controller.delUser)

module.exports = router
