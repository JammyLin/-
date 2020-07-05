const sequelize = require('./config/index.js').sequelize
const relation = require('./relation.js')
const fs = require('fs')
const files = fs.readdirSync(__dirname + '/models')
const js_files = files.filter((f) => {
  return f.endsWith('.js')
}, files)
module.exports = sequelize
for (let f of js_files) {
  let name = f.substring(0, f.length - 3)
  module.exports[name] = require(__dirname + '/models/' + f)
}
