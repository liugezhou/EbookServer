const { env } = require('./env')

const UPLOAD_PATH = env === 'dev' ? '/Users/liumingzhou/Desktop/upload' : '/root/ebbokuplod/book'

const UPLOAD_URL = env === 'dev' ? 'http://el.liugezhou.online:8080/upload/book' : 'http://el.liugezhou.online:8080/root/ebbokuplod/book'

module.exports = {
    CODE_ERROR: -1,
    CODE_SUCCESS: 0,
    debug: true,
    PWD_SALT: 'el_liugezhou_onine',
    PRIVATE_KEY : 'mynameisliugezhoucool',
    JWT_EXPIRED: 60 * 60,
    CODE_TOKEN_EXPIRED: -2,
    UPLOAD_PATH,
    MINE_TYPE_EPUB: 'application/epub+zip',
    UPLOAD_URL
  }