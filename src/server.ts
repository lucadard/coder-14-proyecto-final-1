import express from 'express'

import { exportedDAOs } from './services'
export const { cartDAO, productDAO } = exportedDAOs(
  process.env.SELECTED_DAO || 'mongodb'
)
import { sessionHandler } from './middlewares/session'
import {
  passportMiddleware,
  passportSessionHandler
} from './middlewares/passport'

import { router as productsRouter } from './routes/products/router'
import { router as cartsRouter } from './routes/carts/router'
import { router as randomsRouter } from './routes/randoms/router'
import { router as authRouter } from './routes/auth/router'
import { router as infoRouter } from './routes/info/router'

import { hbsConfig } from './config/engine'
import { argumentsObject } from './config/args'

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/static', express.static('public'))
app.use(sessionHandler)
app.use(passportMiddleware)
app.use(passportSessionHandler)

app.set('view engine', 'hbs')
app.engine('hbs', hbsConfig)

app.get('/', async (req, res) => {
  const products = (await productDAO.getAll()) || []
  res.render('index', { user: req.user, products, title: 'Inicio' })
})

app.use('/api/products', productsRouter)
app.use('/api/carts', cartsRouter)
app.use('/api/randoms', randomsRouter)
app.use('/auth', authRouter)
app.use('/info', infoRouter)

app.get('*', (_, res) => {
  res.status(404).render('404')
})

const PORT = argumentsObject.p || 8080

app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`)
})
