import ContenedorMemoria from '../contenedores/ContenedorMemoria'

import { Cart, Product } from '../../types'

export default class CartDAO extends ContenedorMemoria<Cart> {
  constructor() {
    super()
  }

  hasProduct = (id: number, product_id: number): number => {
    const cart = this.findById(id)
    if (!cart) return -1

    return cart.products.length
      ? cart?.products.findIndex((p) => p.data.id === product_id)
      : -1
  }

  addProduct = (id: number, product: any) => {
    const cart = this.findById(id)
    if (!cart) return undefined

    const productIndex = this.hasProduct(id, product.id)

    if (productIndex === -1) cart.products.push({ data: product, amount: 1 })
    else cart.products[productIndex].amount++

    return cart
  }

  emptyCart = (id: number) => {
    let updatedItemIndex = this.data.findIndex((d: any) => d.id === id)
    this.data[updatedItemIndex].products = []
    return this.data[updatedItemIndex]
  }

  removeAll = (id: number, product_id: number) => {
    let cart = this.findById(id)
    const productIndex = this.hasProduct(id, product_id)
    if (productIndex === -1 || !cart) return undefined

    const deletedProduct: Product = cart.products[productIndex].data
    cart.products.splice(productIndex, 1)

    return deletedProduct
  }

  removeSingle = (id: number, product_id: number) => {
    let cart = this.findById(id)
    const productIndex = this.hasProduct(id, product_id)
    if (productIndex === -1 || !cart) return undefined

    if (cart.products[productIndex].amount > 1)
      cart.products[productIndex].amount--
    else return null

    return cart.products[productIndex]
  }
}
