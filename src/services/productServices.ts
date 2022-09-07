import { Product, newProductData } from '../types'
import productsData from './files/products.json'
import { Contenedor } from './lib/Contenedor'
const productsContenedor = new Contenedor<Product>(
  './src/services/files/products.json'
)

let products: Product[] = []

const getProductsFromFile = async () => {
  products = await productsContenedor.getAll()
}
const updateFile = async () => await productsContenedor.writeFile(products)

getProductsFromFile()

export const getProducts = (): Product[] => products

export const findById = (id: number): Product | undefined => {
  const product = products.find((p) => p.id === id)
  return product ? product : undefined
}

export const addProduct = (newProductData: newProductData) => {
  const newProduct: Product = {
    id: Math.max(...products.map((p) => p.id)) + 1,
    timestamp: new Date() + '',
    ...newProductData
  }
  products.push(newProduct)
  updateFile()
  return newProduct
}

export const updateProduct = (id: number, props: any): Product | undefined => {
  let product = products.find((p) => p.id === id)
  if (!product) return undefined
  product = {
    ...product,
    nombre: props.nombre || product.nombre,
    descripcion: props.descripcion || product.descripcion,
    codigo: props.codigo || product.codigo,
    foto: props.foto || product.foto,
    precio: props.precio || product.precio,
    stock: props.stock || product.stock
  }
  updateFile()
  return product
}

export const deleteProduct = (id: Product['id']): Product | undefined => {
  const productIndex = products.findIndex((p) => p.id === id)
  if (productIndex === -1) return undefined
  else products.splice(productIndex, 1)
  updateFile()
  return products[productIndex]
}
