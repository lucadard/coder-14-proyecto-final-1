import ContenedorArchivo from '../contenedores/ContenedorArchivo'

import { Cart, Product } from '../../types'
import { productDAO } from '../../server'

export default class CartDAO extends ContenedorArchivo<Cart> {
  constructor() {
    super('carts.json')
  }

  findProductsById = async (id: string) => {
    let cartProducts = await this.findById(id)
    return { products: cartProducts?.products || [] }
  }

  hasProduct = async (id: string, product_id: string): Promise<number> => {
    const cart = await this.findById(id)
    if (!cart) return -1

    return cart.products.length
      ? cart?.products.findIndex((p) => p.product_id === product_id)
      : -1
  }

  addProduct = async (id: string, product: any) => {
    const data = await this.getAll()
    const cart = data?.find((d) => d.id === id)
    if (!cart) return undefined

    const productIndex = await this.hasProduct(id, product.id)

    if (productIndex === -1)
      cart.products.push({ product_id: product.id, amount: 1 })
    else cart.products[productIndex].amount++

    await this.save(data!)
    return cart
  }

  emptyCart = async (id: string) => {
    const data = await this.getAll()
    if (!data) return
    let updatedCartIndex = data?.findIndex((d) => d.id === id)
    if (updatedCartIndex === -1) return
    data[updatedCartIndex].products = []

    await this.save(data!)
    return data[updatedCartIndex]
  }

  removeAll = async (id: string, product_id: string) => {
    const data = await this.getAll()
    let cart = data?.find((d) => d.id === id)
    const productIndex = await this.hasProduct(id, product_id)
    if (productIndex === -1 || !cart) return undefined

    const deletedProduct: Product = await productDAO.findById(
      cart.products[productIndex].product_id
    )
    cart.products.splice(productIndex, 1)

    await this.save(data!)
    return deletedProduct
  }

  removeSingle = async (id: string, product_id: string) => {
    const data = await this.getAll()
    let cart = data?.find((d) => d.id === id)
    const productIndex = await this.hasProduct(id, product_id)
    if (productIndex === -1 || !cart) return undefined

    if (cart.products[productIndex].amount > 1)
      cart.products[productIndex].amount--
    else return null

    await this.save(data!)
    return cart.products[productIndex]
  }
}
