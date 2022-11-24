import ProductDAO from './daos/ProductDAO'
import CartDAO from './daos/CartDAO'
import UserDAO from './daos/UserDAO'

export const productDAO = new ProductDAO()
export const cartDAO = new CartDAO()
export const userDAO = new UserDAO()
