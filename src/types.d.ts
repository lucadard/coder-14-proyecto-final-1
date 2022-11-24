declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'production' | 'development'
      MONGO_URL: string
      TWILIO_AUTH_TOKEN: string
      TWILIO_ACCOUNT_SID: string
      ADMIN_PHONE: string
      ADMIN_EMAIL: string
      GOOGLE_MAIL: string
      GOOGLE_MAIL_PASSWORD: string
    }
  }
  namespace Express {
    export interface Request {
      user?: any
    }
  }
}

export type User = {
  id: String
  email: body.email
  password: string
  username: string
  address: string
  age: number
  phone: string
  avatar: string
  admin: boolean
}
export type Product = {
  id: string
  code: string
  name: string
  description?: string
  timestamp: number
  photo_url?: string
  price: number
  stock: number
}
export type Cart = {
  id: string
  user_id: string
  timestamp: number
  products: {
    product_id: Product['id']
    amount: number
  }[]
}
