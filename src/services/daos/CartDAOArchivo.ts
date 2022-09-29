import ContenedorArchivo from '../contenedores/ContenedorArchivo'

import { Cart, Product } from '../../types'

export default class CartDAO extends ContenedorArchivo<Cart> {
  constructor() {
    super('carts.json')
  }

  findProductsById = async (id: number) => {
    let cartProducts = await this.findById(id)
    return { products: cartProducts?.products || [] }
  }

  hasProduct = async (id: number, product_id: number): Promise<number> => {
    const cart = await this.findById(id)
    if (!cart) return -1

    return cart.products.length
      ? cart?.products.findIndex((p) => p.data.id === product_id)
      : -1
  }

  addProduct = async (id: number, product: any) => {
    const data = await this.getAll()
    const cart = data?.find((d) => d.id === id)
    if (!cart) return undefined

    const productIndex = await this.hasProduct(id, product.id)

    if (productIndex === -1) cart.products.push({ data: product, amount: 1 })
    else cart.products[productIndex].amount++

    await this.save(data!)
    return cart
  }

  emptyCart = async (id: number) => {
    const data = await this.getAll()
    if (!data) return
    let updatedCartIndex = data?.findIndex((d) => d.id === id)
    if (updatedCartIndex === -1) return
    data[updatedCartIndex].products = []

    await this.save(data!)
    return data[updatedCartIndex]
  }

  removeAll = async (id: number, product_id: number) => {
    const data = await this.getAll()
    let cart = data?.find((d) => d.id === id)
    const productIndex = await this.hasProduct(id, product_id)
    if (productIndex === -1 || !cart) return undefined

    const deletedProduct: Product = cart.products[productIndex].data
    cart.products.splice(productIndex, 1)

    await this.save(data!)
    return deletedProduct
  }

  removeSingle = async (id: number, product_id: number) => {
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
