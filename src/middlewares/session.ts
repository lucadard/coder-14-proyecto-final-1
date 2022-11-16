import session from 'express-session'
import MongoStore from 'connect-mongo'

import dotenv from 'dotenv'
if (process.env.NODE_ENV !== 'production') dotenv.config()

const MONGO_URL = `mongodb+srv://lucadard:${process.env.MONGO_PASSWORD}@4coderhouse.hyrwj4z.mongodb.net`
const mongoStore = MongoStore.create({
  mongoUrl: MONGO_URL,
  ttl: 10 * 60 // 10 min
})

export const sessionHandler = session({
  store: mongoStore,
  secret: 'shhhhhhhh',
  resave: false,
  saveUninitialized: false
})
