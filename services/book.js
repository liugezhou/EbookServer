const Book = require('../models/Book')
const db = require('../db')
const _ = require('lodash')
function exists(book) {
  const { title, author, publisher } = book
  const sql = `select * from book where title='${title}' and author = '${author}' and publisher = '${publisher}'`
  return db.queryOne(sql)
}


async function removeBook(book) {
  if (book) {
    book.reset()
    if (book.filename) {
      const removeBookSql = `delete from book where filename = '${book.filename}'`
      const removeContentSql = `delete from contents where filename = '${book.filename}'`
      await db.querySql(removeBookSql)
      await db.querySql(removeContentSql)
    }
  }
}

async function insertContents(book) {
  const contents = book.getContents()
  if (contents && contents.length > 0) {
    for (let i = 0; i < contents.length; i++) {
      const content = contents[i];
      const _content = _.pick(content, [
        'fileName',
        'id',
        'href',
        'order',
        'level',
        'label',
        'pid',
        'navId',
        'text'
      ])
      await db.insert(_content, 'contents')
    }
  }
}

function insertBook(book) {
  return new Promise(async (resolve, reject) => {
    try {
      if (book instanceof Book) {
        const result = await exists(book)
        if (result) {
          await removeBook(book)
          reject(new Error('电子书已存在'))
        } else {
          await db.insert(book.toDb(), 'book')
          await insertContents(book)
          resolve()
        }
      } else {
        reject(new Error('添加的图书对象不合法'))
      }
    } catch (error) {
      reject(error)
    }
  })
}

function updateBook(book) {
  return new Promise(async (resolve, reject) => {
    try {
      if (book instanceof Book) {
        const result = await getBook(book.fileName)
        if (result) {
          const model = book.toDb()
          await db.update(model, 'book', `where fileName='${book.fileName}'`)
        }
        resolve()
      } else {
        reject(new Error('添加的图书不合法'))
      }
    } catch (error) {
      reject(error)
    }
  })
}
function getBook(fileName) {
  return new Promise(async (resolve, reject) => {
    const bookSql = `select * from book where fileName = '${fileName}'`
    const contentsSql = `select * from contents where fileName = '${fileName}' order by \`order\``
    const book = await db.queryOne(bookSql)
    const contents = await db.querySql(contentsSql)
    if (book) {
      book.cover = Book.genCoverUrl(book)
      book.contentsTree = Book.genContentsTree(contents)
      resolve(book)
    } else {
      reject(new Error('电子书不存在'))
    }
  })
}


module.exports = {
  insertBook,
  getBook,
  updateBook
}