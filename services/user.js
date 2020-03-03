
const { querySql,queryOne } = require('../db')

function login(username,password) {
   return querySql(`select * from admin_user where username ='${username}' and password = '${password}'`)
}
function findUser(username) {
    const sql = `select * from admin_user where username='${username}'`
    return queryOne(sql)
  }
  
module.exports = {
    login,
    findUser
}
