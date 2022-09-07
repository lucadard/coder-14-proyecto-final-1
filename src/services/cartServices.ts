import { Cart, Product } from '../types'
import cartsData from './files/carts.json'
import { Contenedor } from './lib/Contenedor'
const cartsContenedor = new Contenedor<Cart>('./src/services/files/carts.json')

let carts: Cart[] = []

const getCartsFromFile = async () => {
  carts = await cartsContenedor.getAll()
}
const updateFile = async () => await cartsContenedor.writeFile(carts)

getCartsFromFile()

export const getCarts = (): Cart[] => carts

export const findById = (id: number): Cart | undefined => {
  const cart = carts.find((c) => c.id === id)
  return cart ? cart : undefined
}

export const createCart = (): Cart => {
  const newCart: Cart = {
    id: Math.max(...carts.map((c) => c.id)) + 1,
    timestamp: new Date() + '',
    productos: []
  }
  carts.push(newCart)
  updateFile()
  return newCart
}

export const addProductToCart = (
  id: number,
  newProduct: Product
): Cart['productos'] | undefined => {
  const cart = carts.find((c) => c.id === id)
  let hasProduct = false
  if (!cart) return undefined
  cart.productos = cart.productos.map((p) => {
    if (p.producto.id === newProduct.id) {
      hasProduct = true
      p.cantidad++
    }
    return p
  })
  if (!hasProduct) cart.productos.push({ producto: newProduct, cantidad: 1 })
  updateFile()
  return cart.productos
}
export const emptyCart = (id: number): Cart | undefined => {
  const cart = carts.find((c) => c.id === id)
  if (cart) {
    cart.productos = []
    updateFile()
    return cart
  } else return undefined
}

export const removeSingleFromCart = (
  id: number,
  product: Product
): Cart | undefined => {
  const cart = carts.find((c) => c.id === id)
  let hasProduct = false
  if (!cart) return undefined
  cart.productos = cart.productos.map((p) => {
    if (p.producto.id === product.id && p.cantidad > 1) {
      hasProduct = true
      p.cantidad--
    }
    return p
  })
  if (!hasProduct) return undefined
  updateFile()
  return cart
}

export const removeAllFromCart = (
  id: number,
  product: Product
): Cart | undefined => {
  const cart = carts.find((c) => c.id === id)
  if (!cart) return undefined
  cart.productos = cart.productos.filter((p) => p.producto.id !== product.id)
  updateFile()
  return cart
}
