const express = require('express')
const router = require('./router')
const bodyParser = require('body-parser')
const cors = require('cors')


// 创建 express 应用
const app = express()
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cors())
app.use('/',router)

const fs = require('fs')
const https = require('https')

const privateKey = fs.readFileSync('./https/el_liugezhou_online.key', 'utf8')
const certificate = fs.readFileSync('./https/el_liugezhou_online.pem', 'utf8')
const credentials = { key: privateKey, cert: certificate }
const httpsServer = https.createServer(credentials, app)
const SSLPORT = 8888
httpsServer.listen(SSLPORT, function () {
  console.log('HTTPS Server is running on: https://localhost:%s', SSLPORT)
})