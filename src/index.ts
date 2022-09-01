import express from 'express'

import { productsRouter } from './routes/productsRouter'
import { cartRouter } from './routes/cartRouter'

const app = express()

app.use('/productos', productsRouter)
app.use('/carrito', cartRouter)

app.get('/', (req, res) => {
  res.send({ msg: 'hola' })
})

const PORT = 8080

app.listen(PORT, () => {
  console.log(`conectado al puerto: ${PORT}`)
})
