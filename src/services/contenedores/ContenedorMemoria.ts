export default class ContenedorMemoriaDB<T> {
  protected data: T[]
  constructor() {
    this.data = []
  }

  getAll = () => {
    return this.data
  }

  findById = (id: string) => {
    const itemIndex = this.data.findIndex((d: any) => d.id === id)
    return this.data[itemIndex]
  }

  addOne = (item: any) => {
    this.data.push({
      ...item,
      id: this.count() + 1,
      timestamp: +new Date()
    })
    return item
  }

  updateById = (id: string, data: any) => {
    let updatedItemIndex = this.data.findIndex((d: any) => d.id === id)
    this.data[updatedItemIndex] = { ...this.data[updatedItemIndex], ...data }
    return this.data[updatedItemIndex]
  }

  deleteOne = (id: string) => {
    let deletedItem
    this.data = this.data.filter((d: any) => {
      if (d.id !== id) {
        deletedItem = d
        return true
      }
    })
    return deletedItem
  }

  deleteAll = () => {
    return (this.data = [])
  }
  count = () => {
    return this.data.length
  }
}
