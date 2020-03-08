const { MINE_TYPE_EPUB, UPLOAD_URL, UPLOAD_PATH } = require('../utils/constant')
const fs = require('fs')
class Book {
    constructor(file, data) {
        if (file) {
            this.createBookFromFile(file)
        } else {
            this.createBookFromData(data)
        }
    }
    createBookFromFile(file) {
        console.log(file)
        const {
            destination,
            filename,
            mimetype = MINE_TYPE_EPUB,
            path,
            originalname
        } = file
        const suffix = mimetype === MINE_TYPE_EPUB ? '.epub' : '' //电子书后缀名
        const oldBookPath = path //电子书原有路径
        const bookPath = `${destination}/${filename}.${suffix}` // 电子书的新路径
        const url = `${UPLOAD_URL}/book/${filename}${suffix}` // 电子书的下载URL链接
        const unzipPath = `${UPLOAD_PATH}/unzip/${filename}` // 电子书解压后的文件夹路径
        const unzipUrl = `${UPLOAD_URL}/unzip/${filename}`  //电子书解压后的文件URl
        if(!fs.existsSync(unzipPath)) {
            fs.mkdirSync(unzipPath,{recursive : true})
        }
        if(fs.existsSync(oldBookPath) && !fs.existsSync(bookPath)) {
            fs.renameSync(oldBookPath, bookPath)
        }
        this.filename = filename // 文件名，主键
        this.path = `/book/${filename}${suffix}`
        this.filePath = this.path
        this.unzipPath = `/unzip/${filename}`
        this.url = url
        this.title = '' //电子书标题或者书名
        this.author = '' 
        this.publisher=''
        this.contents = []
        this.cover = '' 
        this.category = -1
        this.categoryText = ''
        this.language = ''
        this.unzipUrl = unzipUrl //解压后文件夹链接
        this.originalname = originalname
    }
    createBookFromData(data) {

    }
}
module.exports = Book