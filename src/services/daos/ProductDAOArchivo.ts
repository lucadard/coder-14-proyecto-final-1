import ContenedorArchivo from '../contenedores/ContenedorArchivo'

import { Product } from '../../types'

export default class ProductDAO extends ContenedorArchivo<Product> {
  constructor() {
    super('products.json')
  }
}
