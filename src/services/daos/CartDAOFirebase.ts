import ContenedorFirebase from '../contenedores/ContenedorFirebase'

import { Cart, Product } from '../../types'

export default class ProductDAO extends ContenedorFirebase<Cart> {
  constructor() {
    super('carts')
  }

  hasProduct = async (id: number, product_id: number): Promise<number> => {
    const cart = await this.findById(id)
    if (!cart) return -1
    return cart.products.length
      ? cart?.products.findIndex((p: any) => p.data.id === product_id)
      : -1
  }

  addProduct = async (id: number, product: any) => {
    const cart = await this.findById(id)
    if (!cart) return undefined
    const productIndex = await this.hasProduct(id, product.id)
    if (productIndex === -1) cart.products.push({ data: product, amount: 1 })
    else cart.products[productIndex].amount++
    await this.updateById(id, cart)
    return cart
  }

  emptyCart = async (id: number) => {
    const updatedCart = await this.findById(id)
    if (!updatedCart) return undefined
    updatedCart.products = []
    await this.updateById(id, updatedCart)
    return updatedCart
  }

  removeAll = async (id: number, product_id: number) => {
    let cart = await this.findById(id)
    const productIndex = await this.hasProduct(id, product_id)
    if (productIndex === -1 || !cart) return undefined
    const deletedProduct: Product = cart.products[productIndex].data as Product
    cart.products.splice(productIndex, 1)
    await this.updateById(id, cart)
    return deletedProduct
  }

  removeSingle = async (id: number, product_id: number) => {
    let cart = await this.findById(id)
    const productIndex = await this.hasProduct(id, product_id)
    if (productIndex === -1 || !cart) return undefined
    if (cart.products[productIndex].amount > 1)
      cart.products[productIndex].amount--
    else return null
    await this.updateById(id, cart)
    return cart.products[productIndex]
  }
}
