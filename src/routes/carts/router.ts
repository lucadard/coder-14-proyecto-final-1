import { Router } from 'express'
import { adminAuthorization } from '../../middlewares/adminAuthorization'
import { authorization } from '../../middlewares/authorization'

import { cartDAO, productDAO } from '../../server'

export const router = Router()

router.get('/:id/products', async (req, res) => {
  const { id } = req.params
  const cartProducts = (await cartDAO.findById(id))?.products
  return cartProducts
    ? res.status(200).send({ data: cartProducts })
    : res.status(404).send({ error: 'cart not found' })
})

router.get('/', authorization, async (req, res) => {
  let cartProducts: any = []
  if (req.user) {
    cartProducts = await cartDAO.getCartProductsByUserId(req.user.id)
  }
  res.render('cart', { user: req.user, cartProducts })
})

router.post('/', authorization, async (req, res) => {
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
  const { id_user, id_prod } = req.params
  const product = await productDAO.findById(id_prod)
  if (!product) return res.status(404).send({ error: 'product not found' })
  const updatedCart: any = await cartDAO.addProduct(id_user, product)
  return updatedCart
    ? res.status(200).send({ data: updatedCart })
    : res.status(404).send({ error: 'cart not found' })
})

router.delete('/:user_id', authorization, async (req, res) => {
  const { user_id } = req.params
  console.log(user_id)
  const cart = await cartDAO.emptyCart(user_id)
  return cart
    ? res.status(200).send({ data: cart })
    : res.status(404).send({ error: 'cart not found' })
})

router.delete(
  '/:id_user/products/:id_prod',
  authorization,
  async (req, res) => {
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
