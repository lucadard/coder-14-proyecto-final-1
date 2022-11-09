import * as fs from 'fs/promises'
import { logger } from '../../config/logger'

import config from '../config'

export default class ContenedorArchivo<T> {
  protected route: string
  constructor(file: string) {
    this.route = `${config.fileSys.path}/${file}`
  }

  save = async (data: T[]) => {
    try {
      await fs.writeFile(this.route, JSON.stringify(data, null, 2))
      return data
    } catch (err) {
      logger.error(err)
    }
  }

  getAll = async () => {
    try {
      const data = await fs.readFile(this.route, 'utf-8')
      return JSON.parse(data) as T[]
    } catch (err) {
      logger.error(err)
    }
  }

  findById = async (id: string) => {
    const data = await this.getAll()
    if (!data) return
    return data?.find((d: any) => d.id === id)
  }

  addOne = async (item: any) => {
    const data = await this.getAll()
    if (!data) return
    data.push({
      ...item,
      id: (await this.count()) + 1,
      timestamp: +new Date()
    })
    await this.save(data)

    return item
  }

  updateById = async (id: string, itemData: any) => {
    const data = await this.getAll()
    if (!data) return
    let updatedItemIndex = data.findIndex((d: any) => d.id === id)
    if (updatedItemIndex === -1) return
    data[updatedItemIndex] = { ...data[updatedItemIndex], ...itemData }
    await this.save(data)

    return data[updatedItemIndex]
  }

  deleteOne = async (id: string) => {
    let data = await this.getAll()
    if (!data) return
    let deletedItem
    data = data.filter((d: any) => {
      if (d.id !== id) {
        deletedItem = d
        return true
      }
    })
    await this.save(data)
    return deletedItem
  }

  deleteAll = async () => {
    await this.save([])
  }
  count = async () => {
    const data = await this.getAll()
    return data ? data.length : 0
  }
}
