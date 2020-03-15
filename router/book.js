const express = require('express')
const multer = require('multer')
const { UPLOAD_PATH } = require('../utils/constant')
const Result = require('../models/Result')
const Book = require('../models/Book')
const router = express.Router()
const boom = require('boom')
const { decode } = require('../utils')
const bookService = require('../services/book')
// 上传以及解析
router.post(
    '/upload',
    multer({ dest: `${UPLOAD_PATH}/book` }).single('file'),
    function (req, res, next) {
        if (!req.file || req.file.length === 0) {
            new Result('上传电子书失败').fail(res)
        } else {
            const book = new Book(req.file)
            book.parse()
                .then(book => {
                    new Result(book, '上传并解析电子书成功').success(res)
                })
                .catch(err => {
                    next(boom.badImplementation(err))
                })
        }
    }
)

router.post(
    '/create',
    function (req, res, next) {
        const decoded = decode(req)
        if (decoded && decoded.username) {
            req.body.username = decoded.username
        }
        const book = new Book(null, req.body)
        bookService.insertBook(book).then(() => {
            new Result('添加电子书成功').success(res)
        }).catch(e => {
            next(boom.badImplementation(e))
        })
    }
)

router.get('/getBook', function (req, res, next) {
    const { fileName } = req.query
    if (!fileName) {
        next(boom.badRequest(new Error('参数fileName不能为空')))
    } else {
        bookService.getBook(fileName).then(book => {
            new Result(book, '获取读书信息成功').success(res)
        }).catch(err => {
            next(boom.badImplementation(err))
        })
    }
})

router.post('/updateBook', function (req, res, next) {
    const decoded = decode(req)
    if (decoded && decoded.username) {
        req.body.username = decoded.username
    }
    const book = new Book(null, req.body)
    bookService.updateBook(book).then(() => {
        new Result('更新电子书成功').success(res)
    }).catch(e => {
        next(boom.badImplementation(e))
    })
})

router.get('/category', function (req, res, next) {
    bookService.getcategory().then((result) => {
        new Result(result,'查询分类成功').success(res)
    }).catch(e => {
        next(boom.badImplementation(e))
    })
})

router.get('/list', function (req, res, next) {
    bookService.listBook(req.query).then(({list,count,page,pageSize}) => {
        new Result({list,count,page:+page,pageSize:+pageSize},'查询图书成功成功').success(res)
    }).catch(e => {
        next(boom.badImplementation(e))
    })
})
router.get('/delete', function (req, res, next) {
    const {fileName} = req.query
    bookService.deleteBook(fileName).then(() => {
        new Result('电子书删除成功').success(res)
    }).catch(e => {
        next(boom.badImplementation(e))
    })
})
module.exports = router