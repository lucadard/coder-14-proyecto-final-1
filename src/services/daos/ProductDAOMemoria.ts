import ContenedorMemoria from '../contenedores/ContenedorMemoria'

import { Product } from '../../types'

export default class ProductDAO extends ContenedorMemoria<Product> {
  constructor() {
    super()
  }
}
