import express from 'express'

import { router as productsRouter } from './routes/products/router'
import { router as cartRouter } from './routes/cart/router'

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/', express.static('./public'))

app.use('/api/productos', productsRouter)
app.use('/api/carrito', cartRouter)

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
