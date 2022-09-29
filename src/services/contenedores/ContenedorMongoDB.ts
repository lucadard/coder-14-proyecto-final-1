import mongoose, { Schema } from 'mongoose'

import config from '../config'

export default class ContenedorMongoDB<T> {
  protected collection
  constructor(collectionName: string, schema: Schema<T>) {
    this.collection = mongoose.model(collectionName, schema)
    this.connect()
  }
  connect = async () => {
    return await mongoose.connect(config.mongodb.url, config.mongodb.options)
  }

  getAll = async () => {
    const items = await this.collection.find().select({ _id: 0, __v: 0 }).lean()
    return items
  }

  findById = async (id: number) => {
    const item = await this.collection
      .findOne({ id })
      .select({ _id: 0, __v: 0 })
      .lean()
    return item
  }

  addOne = async (item: any) => {
    const newItem = new this.collection<T>({
      ...item,
      id: (await this.count()) + 1,
      timestamp: +new Date()
    })
    await newItem.save()
    return newItem
  }

  updateById = async (id: number, data: any) => {
    const updatedItem = await this.collection.updateOne(
      { id },
      { $set: { ...data } }
    )
    return updatedItem
  }
  deleteOne = async (id: number) => {
    const deletedItem = await this.collection.deleteOne({ id })
    return deletedItem
  }
  deleteAll = async () => {
    return await this.collection.deleteMany({})
  }
  count = async () => {
    return await this.collection.count({})
  }
}
