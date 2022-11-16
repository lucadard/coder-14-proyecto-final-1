import dotenv from 'dotenv'
if (process.env.NODE_ENV !== 'production') dotenv.config()

const MONGO_PASSWORD = process.env.MONGO_PASSWORD

const serviceAccount = process.env.FIREBASE_CREDENTIALS

export default {
  fileSys: {
    path: './files'
  },
  mongodb: {
    url: `mongodb+srv://lucadard:${MONGO_PASSWORD}@4coderhouse.hyrwj4z.mongodb.net`,
    options: {
      retryWrites: true
    }
  },
  firebase: serviceAccount
}
