import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'

import { logger } from '../config/logger'
import { sendEmail } from '../routes/purchase/lib'
import { cartDAO } from '../services'
import { userDAO } from '../services'

import dotenv from 'dotenv'
if (process.env.NODE_ENV !== 'production') dotenv.config()

import {
  validatePhoneNumber,
  validateEmail,
  validateAddress
} from './lib/validation'

const localRegisterStrategy = new LocalStrategy(
  {
    passReqToCallback: true
  },
  async ({ body, file }, username, password, done) => {
    try {
      const phone = validatePhoneNumber(body.phone, body.phoneCountry)
      const user = {
        email: validateEmail(body.email),
        password,
        username,
        address: validateAddress(body.address),
        age: body.age,
        phone,
        avatar: file
          ? `/static/img/avatar/${file.filename}`
          : '/static/img/default_pfp.jpeg'
      }
      const newUser = await userDAO.register(user)
      sendEmail('lucadardenne@hotmail.com', {
        subject: `Nuevo registro`,
        html: `Email: ${body.email}\nUsername: ${username}\nAddress: ${body.address}\nAge: ${body.age}\nPhone: ${phone}`
      })
      done(null, newUser)
    } catch (err: any) {
      logger.error(`Error while register. ${err}`)
      done(null, false, err)
    }
  }
)

const localLoginStrategy = new LocalStrategy(
  async (username, password, done) => {
    try {
      const user = await userDAO.authenticate({ username, password })
      done(null, user)
    } catch (err: any) {
      logger.error(`Error while login. ${err}`)
      done(null, false, err)
    }
  }
)

passport.use('register', localRegisterStrategy)
passport.use('login', localLoginStrategy)

export const passportMiddleware = passport.initialize()

passport.serializeUser((user: any, done) => {
  done(null, user.username)
})

passport.deserializeUser(async (username: string, done) => {
  try {
    const user = await userDAO.findByUsername(username)
    // const cart = await cartDAO.findByUserId(user!.id as string)
    done(null, user)
  } catch (err) {
    done(err)
  }
})

export const passportSessionHandler = passport.session()
