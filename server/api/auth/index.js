const router = require('koa-router')({ prefix: '/auth' })
const controller = require('./controller')

router.post('/login', controller.login)

router.get('/logout', controller.logout)

module.exports = router
