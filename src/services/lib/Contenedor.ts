export class Contenedor<T> {
  private ruta: string
  private fs: any
  constructor(ruta: string) {
    this.ruta = ruta
    this.fs = require('fs')
  }

  async readFile(): Promise<T[]> {
    try {
      return JSON.parse(await this.fs.promises.readFile(this.ruta, 'utf-8'))
    } catch (err) {
      throw new Error('Error al leer el archivo.')
    }
  }

  async writeFile(data: T[]) {
    try {
      await this.fs.promises.writeFile(
        this.ruta,
        JSON.stringify(data, null, 2),
        'utf-8'
      )
    } catch (err) {
      throw new Error('Error al escribir en el archivo.')
    }
  }

  async getAll() {
    const data = await this.readFile()
    return data
  }
}
