import ProductDAOMongoDB from './daos/ProductDAOMongoDB'
import CartDAOMongoDB from './daos/CartDAOMongoDB'

import ProductDAOFirebase from './daos/ProductDAOFirebase'
import CartDAOFirebase from './daos/CartDAOFirebase'

import ProductDAOMemoria from './daos/ProductDAOMemoria'
import CartDAOMemoria from './daos/CartDAOMemoria'

import ProductDAOArchivo from './daos/ProductDAOArchivo'
import CartDAOArchivo from './daos/CartDAOArchivo'

const productDAOMongoDB = new ProductDAOMongoDB()
const cartDAOMongoDB = new CartDAOMongoDB()

const productDAOFirebase = new ProductDAOFirebase()
const cartDAOFirebase = new CartDAOFirebase()

const productDAOMemoria = new ProductDAOMemoria()
const cartDAOMemoria = new CartDAOMemoria()
cartDAOMemoria.addOne({ id: 1, timestamp: +new Date(), products: [] })

const productDAOArchivo = new ProductDAOArchivo()
const cartDAOArchivo = new CartDAOArchivo()

export {
  productDAOMongoDB,
  cartDAOMongoDB,
  productDAOFirebase,
  cartDAOFirebase,
  productDAOMemoria,
  cartDAOMemoria,
  productDAOArchivo,
  cartDAOArchivo
}
