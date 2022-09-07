export interface Product {
  id: number
  timestamp: string
  nombre: string
  descripcion: string
  codigo: string
  foto: string
  precio: number
  stock: number
}

export type newProductData = Omit<Product, 'id' | 'timestamp'>

export interface Cart {
  id: number
  timestamp: string
  productos: {
    producto: Product
    cantidad: number
  }[]
}
