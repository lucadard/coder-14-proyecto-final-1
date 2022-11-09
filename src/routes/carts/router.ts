import { Router } from 'express'
import { logger } from '../../config/logger'
import { adminAuthorization } from '../../middlewares/adminAuthorization'
import { authorization } from '../../middlewares/authorization'

import { cartDAO, productDAO } from '../../server'

export const router = Router()

router.get('/:id/products', async (req, res) => {
  logger.petition(req)
  const { id } = req.params
  const cartProducts = (await cartDAO.findById(id))?.products
  return cartProducts
    ? res.status(200).send({ data: cartProducts })
    : res.status(404).send({ error: 'cart not found' })
})

router.get('/', authorization, async (req, res) => {
  logger.petition(req)
  let cartProducts: any = []
  let price = 0
  if (req.user) {
    const { products, totalPrice } = await cartDAO.getProductsDetailsByUserId(
      req.user.id
    )
    cartProducts = products
    price = totalPrice
  }
  res.render('cart', {
    user: req.user,
    cartProducts,
    price,
    title: 'Carrito'
  })
})

router.post('/', adminAuthorization, async (req, res) => {
  logger.petition(req)
  const { body } = req
  const newCart = await cartDAO.addOne({
    ...body,
    timestamp: new Date() + '',
    products: []
  })
  return newCart
    ? res.send({ data: newCart })
    : res.status(400).send({ error: 'error creating the cart' })
})

router.post('/:id_user/products/:id_prod', authorization, async (req, res) => {
  logger.petition(req)
  const { id_user, id_prod } = req.params
  const product = await productDAO.findById(id_prod)
  if (!product) return res.status(404).send({ error: 'product not found' })
  const updatedCart: any = await cartDAO.addProduct(id_user, product.id)
  return updatedCart
    ? res.status(200).send({ data: updatedCart })
    : res.status(404).send({ error: 'cart not found' })
})

router.delete('/:user_id', authorization, async (req, res) => {
  logger.petition(req)
  const { user_id } = req.params
  const cart = await cartDAO.emptyCart(user_id)
  return cart
    ? res.status(200).send({ data: cart })
    : res.status(404).send({ error: 'cart not found' })
})

router.delete(
  '/:id_user/products/:id_prod',
  authorization,
  async (req, res) => {
    logger.petition(req)
    const { id_user, id_prod } = req.params
    const { deleteAll } = req.query

    const product: any = await productDAO.findById(id_prod)
    if (!product) return res.status(404).send({ error: 'product not found' })

    const updatedCart =
      deleteAll === 'true'
        ? await cartDAO.removeAll(id_user, product.id)
        : await cartDAO.removeSingle(id_user, product.id)

    return updatedCart
      ? res.status(200).send({ data: updatedCart })
      : res.status(404).send({ error: 'cart not found' })
  }
)
