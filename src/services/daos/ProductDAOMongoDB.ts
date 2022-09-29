import { Schema } from 'mongoose'
import ContenedorMongoDB from '../contenedores/ContenedorMongoDB'

import { Product } from '../../types'

const productSchema = new Schema<Product>({
  id: { type: Number, required: true },
  code: { type: Number, required: true },
  name: { type: String, required: true },
  description: { type: String, required: false },
  timestamp: { type: Number, required: true },
  photo_url: { type: String, required: false },
  price: { type: Number, required: true },
  stock: { type: Number, required: true }
})

export default class ProductDAO extends ContenedorMongoDB<Product> {
  constructor() {
    super('products', productSchema)
  }
}
