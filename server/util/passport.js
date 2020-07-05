const passport = require('koa-passport')
const LocalStrategy = require('passport-local').Strategy
const crypto = require('crypto')
const User = require('../database/models/user')
const Vehicle = require('../database/models/vehicle')

passport.use(
  new LocalStrategy(
    {
      usernameField: 'account',
      passwordField: 'password'
    },
    /**
     * @param username 用户输入的用户名
     * @param password 用户输入的密码
     * @param done 验证验证完成后的回调函数，由passport调用
     */
    async (account, password, done) => {
      let user = await User.findOne({
        where: { account },
        include: [
          {
            model: Vehicle,
            as: 'vehicle',
            attributes: ['id']
          }
        ]
      })
      const psdMd5 = crypto
        .createHash('md5')
        .update(password)
        .digest('hex')
      if (user && user.password === psdMd5) {
        if (user.state === 0) {
          return done(null, false, {
            code: 403,
            msg: '账号未激活，请联系管理员'
          })
        } else {
          user.password = ''
          return done(null, user, {
            code: 200,
            msg: '登录成功'
          })
        }
      } else {
        // 登录失败, 用户名密码不正确
        return done(null, false, {
          code: 401,
          msg: '用户名密码不匹配'
        })
      }
    }
  )
)

// serializeUser 在用户登录验证成功以后将会把用户的数据存储到 session 中
passport.serializeUser((user, done) => {
  done(null, user)
})

// deserializeUser 在每次请求的时候将从 mongodb 中读取用户对象
passport.deserializeUser((user, done) => {
  done(null, user)
})

module.exports = passport
