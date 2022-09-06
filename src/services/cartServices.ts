import { Cart, Product } from '../types'
import cartsData from './carts.json'

const carts: Cart[] = cartsData as Cart[]

export const getCarts = (): Cart[] => carts

export const addCart = (newCart: Cart): undefined => undefined

export const deleteCart = (cartId: Cart['id']): undefined => undefined

export const addToCart = (newProduct: Product): undefined => undefined

export const deleteFromCart = (productId: Product['id']): undefined => undefined

export const emptyFromCart = (cartId: Cart['id']): undefined => undefined
