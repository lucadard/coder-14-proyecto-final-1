export type Product = {
  id: string
  timestamp: Date
  nombre: string
  descripcion: string
  codigo: string
  foto: string
  precio: number
  stock: number
}

export type Cart = {
  id: string
  timestamp: Date
  productos: Product[]
}
