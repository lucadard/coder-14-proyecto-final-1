import ContenedorMemoria from '../contenedores/ContenedorMemoria'

import { Cart, Product } from '../../types'
import { productDAO } from '../../server'

export default class CartDAO extends ContenedorMemoria<Cart> {
  constructor() {
    super()
  }

  hasProduct = (id: string, product_id: string): number => {
    const cart = this.findById(id)
    if (!cart) return -1

    return cart.products.length
      ? cart?.products.findIndex((p) => p.product_id === product_id)
      : -1
  }

  addProduct = (id: string, product: any) => {
    const cart = this.findById(id)
    if (!cart) return undefined

    const productIndex = this.hasProduct(id, product.id)

    if (productIndex === -1)
      cart.products.push({ product_id: product.id, amount: 1 })
    else cart.products[productIndex].amount++

    return cart
  }

  emptyCart = (id: string) => {
    let updatedItemIndex = this.data.findIndex((d: any) => d.id === id)
    this.data[updatedItemIndex].products = []
    return this.data[updatedItemIndex]
  }

  removeAll = async (id: string, product_id: string) => {
    let cart = this.findById(id)
    const productIndex = this.hasProduct(id, product_id)
    if (productIndex === -1 || !cart) return undefined

    const deletedProduct: Product = await productDAO.findById(
      cart.products[productIndex].product_id
    )
    cart.products.splice(productIndex, 1)

    return deletedProduct
  }

  removeSingle = (id: string, product_id: string) => {
    let cart = this.findById(id)
    const productIndex = this.hasProduct(id, product_id)
    if (productIndex === -1 || !cart) return undefined

    if (cart.products[productIndex].amount > 1)
      cart.products[productIndex].amount--
    else return null

    return cart.products[productIndex]
  }
}
