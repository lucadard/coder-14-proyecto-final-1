import { Schema } from 'mongoose'
import ContenedorMongoDB from '../contenedores/ContenedorMongoDB'

import { Cart, Product } from '../../types'
import { productDAO } from '..'
import { userDAO } from '..'

const cartSchema = new Schema<Cart>({
  id: { type: String, required: true },
  user_id: { type: String, required: true },
  timestamp: { type: Number, required: true },
  products: { type: [{ product_id: String, amount: Number }], required: true }
})

export default class CartDAO extends ContenedorMongoDB<Cart> {
  constructor() {
    super('carts', cartSchema)
  }

  hasProduct = async (id: string, product_id: string): Promise<number> => {
    const cart = await this.findById(id)
    if (!cart) return -1

    return cart.products.length
      ? cart?.products.findIndex((p) => p.product_id === product_id)
      : -1
  }

  addProduct = async (userId: string, product_id: string) => {
    const cart = await this.findByUserId(userId)
    if (!cart) return undefined

    const productCartIndex = await this.hasProduct(cart.id, product_id)

    if (productCartIndex === -1) cart.products.push({ product_id, amount: 1 })
    else {
      const product: Product = await productDAO.findById(product_id)
      if (cart.products[productCartIndex].amount >= product.stock)
        cart.products[productCartIndex].amount = product.stock
      else cart.products[productCartIndex].amount++
    }

    await this.updateById(cart.id, cart)
    return cart
  }

  emptyCart = async (user_id: string) => {
    const updatedCart = await this.findByUserId(user_id)
    if (!updatedCart) return

    updatedCart.products = []

    await this.updateById(updatedCart.id, updatedCart)
    return updatedCart
  }

  findByUserId = async (user_id: string): Promise<Cart | undefined> => {
    try {
      const userExists = Boolean(await userDAO.findById(user_id))
      if (!userExists) throw new Error('User does not exist')
    } catch (err) {
      return undefined
    }

    let cart = await this.collection
      .findOne({ user_id })
      .select({ _id: 0, __v: 0 })
      .lean()
    if (!cart) cart = await this.addOne({ user_id, products: [] })
    return cart
  }

  getProductsDetailsByUserId = async (
    user_id: string
  ): Promise<{
    products: { product_data: Product; amount: number }[]
    totalPrice: number
  }> => {
    let totalPrice = 0
    const cartProducts: {
      product_data: Product & { cost: number }
      amount: number
    }[] = []
    const cart = await this.findByUserId(user_id)
    for (let { product_id, amount } of cart!.products) {
      const product: Product = await productDAO.findById(product_id)
      if (product) {
        cartProducts.push({
          product_data: { ...product, cost: product.price * amount },
          amount
        })
        totalPrice += product.price * amount
      } else this.removeAll(user_id, product_id)
    }
    return { products: cartProducts, totalPrice }
  }

  removeAll = async (user_id: string, product_id: string) => {
    let cart = await this.findByUserId(user_id)

    if (!cart) return undefined
    const productIndex = await this.hasProduct(cart.id, product_id)
    if (productIndex === -1) return undefined

    const deletedProduct: Product = await productDAO.findById(
      cart.products[productIndex].product_id
    )
    cart.products.splice(productIndex, 1)

    await this.updateById(cart.id, cart)
    return deletedProduct
  }

  removeSingle = async (user_id: string, product_id: string) => {
    let cart = await this.findByUserId(user_id)

    if (!cart) return undefined
    const productIndex = await this.hasProduct(cart.id, product_id)
    if (productIndex === -1) return undefined

    if (cart.products[productIndex].amount > 1)
      cart.products[productIndex].amount--
    else return null

    await this.updateById(cart.id, cart)
    return cart.products[productIndex]
  }
}
