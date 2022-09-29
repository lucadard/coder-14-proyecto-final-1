export default class ContenedorMemoriaDB<T> {
  protected data: T[]
  constructor() {
    this.data = []
  }

  getAll = () => {
    return this.data
  }

  findById = (id: number) => {
    return this.data.find((d: any) => d.id === id)
  }

  addOne = (item: any) => {
    this.data.push({
      ...item,
      id: this.count() + 1,
      timestamp: +new Date()
    })
    return item
  }

  updateById = (id: number, data: any) => {
    let updatedItemIndex = this.data.findIndex((d: any) => d.id === id)
    this.data[updatedItemIndex] = { ...this.data[updatedItemIndex], ...data }
    return this.data[updatedItemIndex]
  }

  deleteOne = (id: number) => {
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
