import express from 'express'

import { cartDAO, productDAO } from '../../index'

export const router = express.Router()

router.get('/:id/products', async (req, res) => {
  const { id } = req.params
  const cartProducts = (await cartDAO.findById(+id))?.products
  return cartProducts
    ? res.status(200).send({ cartProducts })
    : res.status(404).send({ error: 'cart not found' })
})

router.post('/', async (req, res) => {
  const { body } = req
  const newCart = await cartDAO.addOne({
    ...body,
    timestamp: new Date() + '',
    products: []
  })
  return newCart
    ? res.send({ newCart })
    : res.status(400).send({ error: 'error creating the cart' })
})

router.post('/:id/products/:id_prod', async (req, res) => {
  const { id, id_prod } = req.params
  const product = await productDAO.findById(+id_prod)
  if (!product) return res.status(404).send({ error: 'product not found' })
  const updatedCart: any = await cartDAO.addProduct(+id, product)
  return updatedCart
    ? res.status(200).send({ updatedCart })
    : res.status(404).send({ error: 'cart not found' })
})

router.delete('/:id', async (req, res) => {
  const { id } = req.params
  const cart = await cartDAO.emptyCart(+id)
  return cart
    ? res.status(200).send({ cart })
    : res.status(404).send({ error: 'cart not found' })
})

router.delete('/:id/products/:id_prod', async (req, res) => {
  const { id, id_prod } = req.params
  const { deleteAll } = req.query

  const product: any = await productDAO.findById(+id_prod)
  if (!product) return res.status(404).send({ error: 'product not found' })

  const updatedCart =
    deleteAll === 'true'
      ? await cartDAO.removeAll(+id, +product.id)
      : await cartDAO.removeSingle(+id, +product.id)

  return updatedCart
    ? res.status(200).send({ updatedCart })
    : res.status(404).send({ error: 'cart not found' })
})
