interface Product {
  id: number
  code: number
  name: string
  description?: string
  timestamp: number
  photo_url?: string
  price: number
  stock: number
}

export type newProductData = Omit<Product, 'id' | 'timestamp'>
export interface Cart {
  id: number
  timestamp: number
  products: {
    data: Product
    amount: number
  }[]
}

export type DAOType = 'archivo' | 'memoria' | 'mongodb' | 'firebase'
