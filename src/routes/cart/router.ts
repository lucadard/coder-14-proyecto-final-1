import express from 'express'

import { Cart, Product } from '../types'

import { productList } from '../products/router'

export const router = express.Router()

let carts: Cart[] = []
import { Contenedor } from '../../Contenedor'
const cartsContenedor = new Contenedor<Cart>('./files/carts.json')
cartsContenedor.getAll().then((data) => data!.map((item) => carts.push(item)))

router.get('/:id/productos', (req, res) => {
  const { id } = req.params
  const cart = carts.find((cart) => cart.id === id)
  const products = cart?.productos || []
  return cart
    ? res.status(200).send({ products })
    : res.status(404).send({ error: 'cart not found' })
})

router.post('/', (_, res) => {
  let newId
  if (carts.length === 0) newId = '1'
  else newId = +carts[carts.length - 1].id + 1 + ''
  const newCart: Cart = {
    id: newId,
    timestamp: new Date(),
    productos: []
  }
  carts = carts.concat(newCart)
  cartsContenedor.writeFile(carts)
  res.send({ id: newCart.id })
})

router.post('/:id/productos/:id_prod', (req, res) => {
  const { id, id_prod } = req.params
  const product = productList.find((product) => product.id === id_prod) //get product from file or something
  let updatedCartId: Cart['id'] | undefined = undefined
  if (product) {
    carts = carts.map((cart) => {
      if (cart.id === id) {
        cart.productos = cart.productos.concat(product)
        updatedCartId = cart.id
      }
      return cart
    })
    cartsContenedor.writeFile(carts)
  } else return res.status(404).send({ error: 'product not found' })
  return updatedCartId
    ? res.status(200).send({ id: updatedCartId })
    : res.status(404).send({ error: 'cart not found' })
})

router.delete('/:id', (req, res) => {
  const { id } = req.params
  let updatedCart: Cart | undefined = undefined
  carts = carts.map((cart) => {
    if (cart.id === id) {
      cart.productos = []
    }
    return cart
  })
  cartsContenedor.writeFile(carts)
  return updatedCart
    ? res.status(200).send({ cart: updatedCart })
    : res.status(404).send({ error: 'cart not found' })
})

router.delete('/:id/productos/:id_prod', (req, res) => {
  const { id, id_prod } = req.params
  let updatedCart: Cart | undefined = undefined
  carts = carts.map((cart) => {
    if (cart.id === id) {
      cart.productos = cart.productos.filter(
        (producto) => producto.id !== id_prod
      )
      updatedCart = cart
    }
    return cart
  })
  cartsContenedor.writeFile(carts)
  return updatedCart
    ? res.status(200).send({ cart: updatedCart })
    : res.status(404).send({ error: 'cart not found' })
})
