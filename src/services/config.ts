import * as dotenv from 'dotenv'
dotenv.config()

const MONGO_PASSWORD = process.env.MONGO_PASSWORD

import serviceAccount from '../../../../firebase_test/db-config/coderhouse-e0f10-firebase-adminsdk-sm5gx-6112c8c8b8.json'

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
