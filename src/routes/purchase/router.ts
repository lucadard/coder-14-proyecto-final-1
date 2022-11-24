import { Router } from 'express'

import { authorization } from '../../middlewares/authorization'
import { logger } from '../../config/logger'
import { cartDAO, userDAO } from '../../services'
import { cartToText, sendMessage, sendEmail } from './lib'

import dotenv from 'dotenv'
if (process.env.NODE_ENV !== 'production') dotenv.config()

export const router = Router()

const ADMIN_PHONE = process.env.ADMIN_PHONE
const ADMIN_EMAIL = process.env.ADMIN_EMAIL

router.get('/:user_id', authorization, async (req, res) => {
  logger.petition(req)
  try {
    const { user_id } = req.params
    const cart = await cartDAO.findByUserId(user_id)
    const user = await userDAO.findById(user_id)
    if (!cart || !user) throw new Error('Cart not found.')
    const messageContent = await cartToText(user, cart)
    // send sms to user
    sendMessage(
      req.user.phone,
      '\nTu pedido fue recibido y se encuentra en proceso.'
    )
    //send sms & email to admin
    sendMessage(ADMIN_PHONE, messageContent)
    await sendEmail(ADMIN_EMAIL, {
      subject: `Nuevo pedido de ${req.user.email}`,
      html: messageContent
    })
    //empty user cart
    await cartDAO.emptyCart(user_id)
    //add purchase to db
    // await purchaseDAO.addOne(user_id, cart)
    res.status(200).json({ msg: 'The transaction was successful.' })
  } catch (err) {
    res.status(500).json({ error: 'There was an error.' })
  }
})
