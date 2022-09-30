import ProductDAOMongoDB from './daos/ProductDAOMongoDB'
import CartDAOMongoDB from './daos/CartDAOMongoDB'

import ProductDAOFirebase from './daos/ProductDAOFirebase'
import CartDAOFirebase from './daos/CartDAOFirebase'

import ProductDAOMemoria from './daos/ProductDAOMemoria'
import CartDAOMemoria from './daos/CartDAOMemoria'

import ProductDAOArchivo from './daos/ProductDAOArchivo'
import CartDAOArchivo from './daos/CartDAOArchivo'

// const productDAOMongoDB = new ProductDAOMongoDB()
// const cartDAOMongoDB = new CartDAOMongoDB()

// const productDAOFirebase = new ProductDAOFirebase()
// const cartDAOFirebase = new CartDAOFirebase()

// const productDAOMemoria = new ProductDAOMemoria()
// const cartDAOMemoria = new CartDAOMemoria()

// const productDAOArchivo = new ProductDAOArchivo()
// const cartDAOArchivo = new CartDAOArchivo()

export const exportedDAOs = (
  DAO: 'archivo' | 'memoria' | 'mongodb' | 'firebase'
): any => {
  let cartDAO, productDAO
  if (DAO === 'archivo') {
    cartDAO = new CartDAOArchivo()
    productDAO = new ProductDAOArchivo()
  } else if (DAO === 'mongodb') {
    cartDAO = new CartDAOMongoDB()
    productDAO = new ProductDAOMongoDB()
  } else if (DAO === 'firebase') {
    cartDAO = new CartDAOFirebase()
    productDAO = new ProductDAOFirebase()
  } else {
    cartDAO = new CartDAOMemoria()
    productDAO = new ProductDAOMemoria()
    cartDAO.addOne({ id: 1, timestamp: +new Date(), products: [] })
  }
  return {
    cartDAO,
    productDAO
  }
}
