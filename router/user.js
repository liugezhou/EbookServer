const express = require('express')
const router = express.Router()
const Result = require('../models/Result')
const { login } = require('../services/user')
const { PWD_SALT } = require('../utils/constant')
const { md5 } = require('../utils')
const boom = require('boom')
const { body, validationResult } = require('express-validator')

router.post('/login', [
  body('username').isString().withMessage('用户名必须为字符'),
  body('password').isNumeric().withMessage('密码必须为字符')
], (req, res, next) => {
  const err = validationResult(req)
  if (!err.isEmpty()) {
    const [{ msg }] = err.errors
    next(boom.badRequest(msg))
  } else {
    let { username, password } = req.body
    password = md5(`${password}${PWD_SALT}`)
    login(username, password).then(user => {
      if (!user || user.length === 0) {
        new Result('用户不存在').fail(res)
      } else {
        new Result('登录成功').success(res)
      }
    })
  }
})
router.get('/info', function (req, res, next) {
  res.json('user info...')
})

module.exports = router