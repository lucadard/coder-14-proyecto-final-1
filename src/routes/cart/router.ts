import express from 'express'

import { Cart } from '../../types'
import * as cartServices from '../../services/cartServices'
import { getProducts } from '../../services/productServices'

let carts = cartServices.getCarts()

export const router = express.Router()

router.get('/:id/productos', (req, res) => {
  const { id } = req.params
  const cart = carts.find((cart) => cart.id === +id)
  const products = cart?.productos || []
  return cart
    ? res.status(200).send({ products })
    : res.status(404).send({ error: 'cart not found' })
})

router.post('/', (_, res) => {
  let newId
  if (carts.length === 0) newId = 1
  else newId = +carts[carts.length - 1].id + 1
  const newCart: Cart = {
    id: newId,
    timestamp: new Date() + '',
    productos: []
  }
  carts = carts.concat(newCart)
  cartServices.addCart(newCart)
  res.send({ id: newCart.id })
})

router.post('/:id/productos/:id_prod', (req, res) => {
  const { id, id_prod } = req.params
  const product = getProducts().find((product) => product.id === +id_prod) //get product in some way
  let updatedCartId: Cart['id'] | undefined = undefined
  if (product) {
    carts = carts.map((cart) => {
      if (cart.id === +id) {
        if (
          cart.productos.find(
            (cartProduct) => cartProduct.producto.id === product.id
          )
        ) {
          cart.productos = cart.productos.map((cartProduct) => {
            if (cartProduct.producto.id === product.id) cartProduct.cantidad++
            return cartProduct
          })
        } else {
          cart.productos = cart.productos.concat({
            producto: product,
            cantidad: 1
          })
        }
        updatedCartId = cart.id
      }
      return cart
    })
    cartServices.addToCart(product)
  } else return res.status(404).send({ error: 'product not found' })
  return updatedCartId
    ? res.status(200).send({ id: updatedCartId })
    : res.status(404).send({ error: 'cart not found' })
})

router.delete('/:id', (req, res) => {
  const { id } = req.params
  let deletedCartId: Cart['id'] = 0
  carts = carts.map((cart) => {
    if (cart.id === +id) {
      cart.productos = []
    }
    return cart
  })
  cartServices.deleteCart(deletedCartId)
  return deletedCartId
    ? res.status(200).send({ cart: deletedCartId })
    : res.status(404).send({ error: 'cart not found' })
})

router.delete('/:id/productos/:id_prod', (req, res) => {
  const { id, id_prod } = req.params
  const { deleteAll } = req.query
  let updatedCartId: Cart['id'] = 0
  carts = carts.map((cart) => {
    if (cart.id === +id) {
      if (deleteAll === 'true')
        cart.productos = cart.productos.filter(
          (cartProduct) => cartProduct.producto.id !== +id_prod
        )
      else
        cart.productos = cart.productos.map((cartProduct) => {
          if (cartProduct.producto.id === +id_prod) {
            cartProduct.cantidad =
              cartProduct.cantidad === 1
                ? 1
                : (cartProduct.cantidad = cartProduct.cantidad - 1)
          }
          return cartProduct
        })
      updatedCartId = cart.id
    }
    return cart
  })
  cartServices.deleteCart(updatedCartId)
  return updatedCartId
    ? res.status(200).send({ cart: updatedCartId })
    : res.status(404).send({ error: 'cart not found' })
})
