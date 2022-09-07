import express from 'express'

import * as cartServices from '../../services/cartServices'
import { findById as findProductById } from '../../services/productServices'

export const router = express.Router()

router.get('/:id/productos', (req, res) => {
  const { id } = req.params
  const cart = cartServices.findById(+id)
  const products = cart?.productos || []
  return cart
    ? res.status(200).send({ products })
    : res.status(404).send({ error: 'cart not found' })
})

router.post('/', (_, res) => {
  const newCart = cartServices.createCart()
  return newCart
    ? res.send({ newCart })
    : res.status(400).send({ error: 'error creating the cart' })
})

router.post('/:id/productos/:id_prod', (req, res) => {
  const { id, id_prod } = req.params
  const product = findProductById(+id_prod)
  if (!product) return res.status(404).send({ error: 'product not found' })
  const updatedCart = cartServices.addProductToCart(+id, product)
  return updatedCart
    ? res.status(200).send({ updatedCart })
    : res.status(404).send({ error: 'cart not found' })
})

router.delete('/:id', (req, res) => {
  const { id } = req.params
  const cart = cartServices.emptyCart(+id)
  return cart
    ? res.status(200).send({ cart })
    : res.status(404).send({ error: 'cart not found' })
})

router.delete('/:id/productos/:id_prod', (req, res) => {
  const { id, id_prod } = req.params
  const { deleteAll } = req.query

  const product = findProductById(+id_prod)
  if (!product) return res.status(404).send({ error: 'product not found' })

  const updatedCart =
    deleteAll === 'true'
      ? cartServices.removeAllFromCart(+id, product)
      : cartServices.removeSingleFromCart(+id, product)

  return updatedCart
    ? res.status(200).send({ updatedCart })
    : res.status(404).send({ error: 'cart not found' })
})
