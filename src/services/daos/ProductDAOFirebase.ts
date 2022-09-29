import ContenedorFirebase from '../contenedores/ContenedorFirebase'

import { Product } from '../../types'

export default class ProductDAO extends ContenedorFirebase<Product> {
  constructor() {
    super('products')
  }
}
