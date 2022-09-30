import express from 'express'

import { DAOType } from './types'
import { exportedDAOs } from './services'
export const { cartDAO, productDAO } = exportedDAOs(
  (process.env.SELECTED_DAO as DAOType) || 'memoria'
)

import { router as productsRouter } from './routes/products/router'
import { router as cartsRouter } from './routes/carts/router'

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/', express.static('./public'))

app.use('/api/products', productsRouter)
app.use('/api/carts', cartsRouter)

app.get('/', (_, res) => {
  res.render('index')
})

app.get('*', (req, res) => {
  res.status(501).send({
    error: -2,
    descripcion: `ruta ${req.originalUrl} metodo ${req.method} no implementado`
  })
})

const PORT = process.env.PORT || 8080

app.listen(PORT, () => {
  console.log(`conectado al puerto: ${PORT}`)
})
