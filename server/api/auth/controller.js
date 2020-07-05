const passport = require('../../util/passport')
const log = require('../mixin')
let id

exports.login = async (ctx) => {
  try {
    return passport.authenticate('local', async (err, user, info, status) => {
      if (user) {
        ctx.body = {
          code: info.code,
          msg: info.msg,
          user
        }
        if (info.code === 200) {
          id = user.id
          await log.addUserLog(ctx, user.id, 1)
        }
        return ctx.login(user)
      } else {
        ctx.body = {
          code: info.code,
          msg: info.msg
        }
      }
    })(ctx)
  } catch (e) {
    ctx.body = {
      code: 400,
      msg: 'fail'
    }
  }
}

exports.logout = async (ctx) => {
  try {
    ctx.logout()
    if (!ctx.isAuthenticated()) {
      ctx.body = {
        code: 200,
        msg: '退出登录成功'
      }
    } else {
      ctx.body = {
        code: 400,
        msg: '退出登录失败'
      }
    }
  } catch (e) {
    ctx.body = {
      code: 400,
      msg: 'fail'
    }
  }
}
