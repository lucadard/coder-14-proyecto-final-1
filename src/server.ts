import express from 'express'
import { engine as hbs } from 'express-handlebars'
import path from 'path'

import { DAOType } from './types'
import { exportedDAOs } from './services'
export const { cartDAO, productDAO } = exportedDAOs(
  (process.env.SELECTED_DAO as DAOType) || 'mongodb'
)
import { sessionHandler } from './middlewares/session'
import {
  passportMiddleware,
  passportSessionHandler
} from './middlewares/passport'

import { router as productsRouter } from './routes/products/router'
import { router as cartsRouter } from './routes/carts/router'
import { router as authRouter } from './routes/auth/router'

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/static', express.static('public'))
app.use(sessionHandler)
app.use(passportMiddleware)
app.use(passportSessionHandler)

app.set('view engine', 'hbs')

app.engine(
  'hbs',
  hbs({
    extname: '.hbs',
    defaultLayout: path.join(__dirname, '../views/layouts/main.hbs'),
    layoutsDir: path.join(__dirname, '../views/layouts')
  })
)

app.get('/', async (req, res) => {
  const products = (await productDAO.getAll()) || []
  res.render('index', { user: req.user, products })
})

app.use('/api/products', productsRouter)
app.use('/api/carts', cartsRouter)
app.use('/auth', authRouter)

app.get('*', (_, res) => {
  res.status(404).render('404')
})

const PORT = process.env.PORT || 8080

app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`)
})
