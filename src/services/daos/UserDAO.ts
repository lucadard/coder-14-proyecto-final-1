import { Schema } from 'mongoose'
import ContenedorMongoDB from '../contenedores/ContenedorMongoDB'

import { User } from '../../types'
import { generateId } from '../lib/generateId'

/*_________________bCrypt functions_________________*/
import bcrypt from 'bcrypt'
function isValidPassword(user: User, password: string) {
  return bcrypt.compareSync(password, user.password)
}
function createHash(password: string) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10))
}
/*_________________________________________________*/

const userSchema = new Schema<User>({
  id: { type: String, required: true },
  email: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  address: { type: String, required: true },
  age: { type: Number, required: true },
  phone: { type: String, required: true },
  avatar: { type: String, required: true },
  admin: { type: Boolean, required: true }
})

export default class UserDAO extends ContenedorMongoDB<User> {
  constructor() {
    super('users', userSchema)
  }

  register = async (user: Omit<User, 'id' | 'admin'>) => {
    if (await this.findByUsername(user.username))
      throw new Error('User already exists')
    const newUser = new this.collection<User>({
      id: generateId(),
      email: user.email,
      username: user.username,
      password: createHash(user.password),
      address: user.address,
      age: user.age,
      phone: user.phone,
      avatar: user.avatar,
      admin: false
    })
    try {
      await newUser.save()
      return newUser
    } catch (err: any) {
      throw new Error(err)
    }
  }

  authenticate = async (userCredentials: any) => {
    const user = await this.findByUsername(userCredentials.username)
    if (!user) throw new Error('User does not exist')
    if (!isValidPassword(user, userCredentials.password))
      throw new Error('Invalid password')
    return user
  }

  findByUsername = async (username: string) => {
    try {
      const user = await this.collection
        .findOne({ username })
        .select({ _id: 0, __v: 0 })
        .lean()
      return user
    } catch (err: any) {
      throw new Error(err)
    }
  }
  isAdmin = async (user_id: string) => {
    try {
      const user = await this.findById(user_id)
      if (!user) throw new Error('User does not exist')
      return user.admin
    } catch (err: any) {
      throw new Error(err)
    }
  }
}
