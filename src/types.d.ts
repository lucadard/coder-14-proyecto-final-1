declare global {
  namespace Express {
    export interface Request {
      user?: any
    }
  }
}

export type User = {
  id: String
  username: string
  password: string
  admin: boolean
}
interface Product {
  id: string
  code: string
  name: string
  description?: string
  timestamp: number
  photo_url?: string
  price: number
  stock: number
}
export interface Cart {
  id: string
  user_id: string
  timestamp: number
  products: {
    product_id: Product['id']
    amount: number
  }[]
}

export type DAOType = 'archivo' | 'memoria' | 'mongodb' | 'firebase'
