import twilio from 'twilio'
import dotenv from 'dotenv'
if (process.env.NODE_ENV !== 'production') dotenv.config()

import { Cart, User } from '../../../types'
import { productDAO } from '../../../services'
import { logger } from '../../../config/logger'

export const cartToText = async (user: User, cart: Cart): Promise<string> => {
  const productList = []
  let totalPrice = 0
  for (let { product_id, amount } of cart.products) {
    const product = await productDAO.findById(product_id)
    totalPrice += product.price * amount
    productList.push({
      name: product.name,
      code: product.code,
      price: product.price,
      stock: product.stock,
      amount
    })
  }
  return `NUEVO PEDIDO:\n\nPRODUCTOS:${productList.reduce(
    (text, item, index) =>
      `${text}\n${index + 1} - Nombre: ${item.name}\nCodigo:${
        item.code
      }\nCantidad: ${item.amount}\nPrecio unitario: $${item.price}\nStock: ${
        item.stock
      }`,
    ''
  )}\n\nTOTAL: $${totalPrice}\n\nDATOS DEL COMPRADOR:\nNombre: ${
    user.username
  }\nEmail: ${user.email}\nTelefono: ${user.phone}\nDireccion: ${user.address}`
}

export const sendMessage = (receiver: string, content: string) => {
  if (!receiver) {
    logger.error('Twilio: Invalid phone number.')
    throw new Error('Twilio: Invalid phone number.')
  }
  const accountSid = process.env.TWILIO_ACCOUNT_SID
  const authToken = process.env.TWILIO_AUTH_TOKEN

  const client: any = twilio(accountSid, authToken)

  client.messages
    .create({
      body: content,
      messagingServiceSid: 'MG385141e781386d166f2281002160d5ad',
      to: receiver
    })
    .then((message: any) =>
      logger.info(`Twilio: Message sended, sid: ${message.sid}`)
    )
    .catch((err: any) =>
      logger.error(
        `Twilio: There was an error sending the message to ${receiver}`,
        err
      )
    )
    .done()
}

import { createTransport } from 'nodemailer'
export const sendEmail = async (
  receiver: string,
  content: { from?: string; subject: string; html: string }
) => {
  if (!receiver) {
    logger.error('Nodemailer: Invalid email.')
    throw new Error('Nodemailer: Invalid email.')
  }
  const transporter = createTransport({
    service: 'gmail',
    port: 587,
    auth: {
      user: process.env.GOOGLE_MAIL,
      pass: process.env.GOOGLE_MAIL_PASSWORD
    }
  })
  const mailOptions = {
    from: content.from || 'Shop',
    to: receiver,
    subject: content.subject,
    html: content.html
  }

  try {
    const info = await transporter.sendMail(mailOptions)
    logger.info(
      `Nodemailer: Email sended to ${receiver}, id: ${info.messageId}`
    )
  } catch (err) {
    logger.error(
      `Nodemailer: There was an error sending the email to ${receiver}`,
      err
    )
  }
}
