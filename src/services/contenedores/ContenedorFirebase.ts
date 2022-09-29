import admin, { ServiceAccount } from 'firebase-admin'

import config from '../config'

admin.initializeApp({
  credential: admin.credential.cert(config.firebase as ServiceAccount)
})

const db = admin.firestore()

export default class ContenedorFirebase<T> {
  protected collection
  constructor(collectionName: string) {
    this.collection = db.collection(collectionName)
  }

  getAll = async () => {
    try {
      const querySnapshot = await this.collection.get()
      let docs = querySnapshot.docs
      return docs.map((doc) => doc.data())
    } catch (err) {
      console.error(err)
    }
  }

  findById = async (id: number) => {
    try {
      const doc = this.collection.doc(`${id}`)
      const item = await doc.get()
      return item.data()
    } catch (err) {
      console.error(err)
    }
  }

  addOne = async (item: any) => {
    try {
      const newId = (await this.count()) + 1
      let doc = this.collection.doc(`${newId}`)
      return await doc.create({
        ...item,
        id: newId,
        timestamp: +new Date()
      })
    } catch (err) {
      console.error(err)
    }
  }

  updateById = async (id: number, data: any) => {
    try {
      const doc = this.collection.doc(`${id}`)
      let item = await doc.update({ ...data })
      return item
    } catch (err) {
      console.error(err)
    }
  }
  deleteOne = async (id: number) => {
    try {
      const doc = this.collection.doc(`${id}`)
      const item = await doc.delete()
      return item
    } catch (err) {
      console.error(err)
    }
  }
  deleteAll = async () => {
    const querySnapshot = await this.collection.get()
    querySnapshot.docs.forEach((snapshot) => {
      snapshot.ref.delete()
    })
  }
  count = async () => {
    return (await this.collection.get()).size
  }
}
