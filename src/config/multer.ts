import multer from 'multer'
import path from 'path'

const relativePath = process.env.NODE_ENV === 'production' ? '..' : '../../..'

const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, path.join(__dirname, `${relativePath}/public/avatar`))
  },
  filename: function ({ body }, file, cb) {
    cb(
      null,
      body.username + '_pfp_' + Date.now() + path.extname(file.originalname)
    )
  }
})

export const uploadAvatar = multer({
  storage,
  fileFilter: function (_req, file, callback) {
    var ext = path.extname(file.originalname)
    if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
      return callback(new Error('Only images are allowed.'))
    }
    callback(null, true)
  },
  limits: {
    fileSize: 1024 * 1024
  }
}).single('avatar')
