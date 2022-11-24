import express from 'express'
import compression from 'compression'

import { productDAO } from './services'

import { sessionHandler } from './middlewares/session'
import {
  passportMiddleware,
  passportSessionHandler
} from './middlewares/passport'

import { router as productsRouter } from './routes/products/router'
import { router as cartsRouter } from './routes/carts/router'
import { router as purchaseRouter } from './routes/purchase/router'
import { router as authRouter } from './routes/auth/router'
import { router as userRouter } from './routes/user/router'

import { hbsConfig } from './config/engine'
import { logger } from './config/logger'

const app = express()

app.use(compression())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/static', express.static('public'))
app.use(sessionHandler)
app.use(passportMiddleware)
app.use(passportSessionHandler)

app.set('view engine', 'hbs')
app.engine('hbs', hbsConfig)

app.get('/', async (req, res) => {
  logger.petition(req)
  const products = (await productDAO.getAll()) || []
  res.render('index', { user: req.user, products, title: 'Inicio' })
})

app.use('/api/products', productsRouter)
app.use('/api/carts', cartsRouter)
app.use('/api/purchase', purchaseRouter)

app.use('/auth', authRouter)
app.use('/myprofile', userRouter)

app.get('*', (req, res) => {
  logger.petition(req, 'warn')
  res.status(404).render('404')
})

export const createServer = (PORT: number) => {
  return new Promise<any | Error>((resolve, reject) => {
    const server = app.listen(PORT, () => resolve(server))
    server.on('error', (err) => reject(err))
  })
}
