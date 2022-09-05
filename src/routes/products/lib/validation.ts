// import { Product } from '../../types'
// I would like to find a way to use the type Product in the prop validation
// instead this array is being used
const validProps = [
  'nombre',
  'descripcion',
  'codigo',
  'foto',
  'precio',
  'stock'
]

//checks if the product object has all the necessary props
export function hasAllProps(product: any): boolean {
  let valid = true
  if (product !== undefined) {
    for (let prop of validProps) if (!(prop in product)) valid = false
  } else valid = false
  return valid
}

//checks if the product object has at least one of the necessary props
export function hasAnyProps(product: any): boolean {
  let valid = false
  for (let prop of validProps) if (prop in product) valid = true
  return valid
}
