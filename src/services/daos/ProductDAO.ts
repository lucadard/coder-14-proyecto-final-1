import { Schema } from 'mongoose'
import ContenedorMongoDB from '../contenedores/ContenedorMongoDB'

import { Product } from '../../types'

const productSchema = new Schema<Product>({
  id: { type: String, required: true },
  code: { type: String, required: true },
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

  updateProduct = async (id: string, newData: any) => {
    const product = await this.findById(id)
    if (!product) return

    const updatedProduct = { ...product, ...newData }

    await this.updateById(id, updatedProduct)
    return updatedProduct
  }
}
