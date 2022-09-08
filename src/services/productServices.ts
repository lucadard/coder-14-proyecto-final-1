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

export const updateProduct = (
  id: number,
  props: Product
): Product | undefined => {
  let product = products.find((p) => p.id === id)
  if (!product) return undefined
  products = products.map((p) => {
    if (p.id === id) {
      return {
        ...p,
        nombre: props.nombre || p.nombre,
        descripcion: props.descripcion || p.descripcion,
        codigo: props.codigo || p.codigo,
        foto: props.foto || p.foto,
        precio: props.precio || p.precio,
        stock: props.stock || p.stock
      }
    }
    return p
  })
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
