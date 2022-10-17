import { Router } from 'express'

import { productDAO } from '../../server'

// import { hasAllProps, hasAnyProps } from './lib/validation'
import { authorization } from '../../middlewares/authorization'
import { adminAuthorization } from '../../middlewares/adminAuthorization'
import { Product } from '../../types'

export const router = Router()

router.get('/', async (req, res) => {
  const products = await productDAO.getAll()
  return res.send({ data: products })
})

router.get('/add', adminAuthorization, async (req, res) => {
  return res.render('add-product', {
    user: req.user,
    title: 'Agregar producto'
  })
})

router.get('/update', adminAuthorization, async (req, res) => {
  let { id } = req.query
  const product: Product = await productDAO.findById(id)
  return res.render('edit-product', {
    user: req.user,
    product,
    title: `Editar ${product.name}`
  })
})

router.get('/:id', authorization, async (req, res) => {
  let { id } = req.params
  const product: any = await productDAO.findById(id)
  return product
    ? res.status(200).send({ data: product })
    : res.status(404).send({ error: 'product not found' })
})

router.post('/', adminAuthorization, async (req, res) => {
  const { body } = req
  try {
    const newProduct = await productDAO.addOne(body)
    return res.send({ data: newProduct })
  } catch (err) {
    console.error('Failed to save product', err)
    return res.send({ error: 'Failed to save product' })
  }
})

router.put('/:id', adminAuthorization, async (req, res) => {
  const { id } = req.params
  const { body } = req

  let newData: any = Object.entries(body)
  newData = newData.reduce((acc: {}, [key, value]: any) => {
    if (!value) return acc
    return {
      ...acc,
      [key]: value
    }
  }, {})

  const updatedProduct = await productDAO.updateProduct(id, newData)

  return updatedProduct
    ? res.status(200).send({ data: updatedProduct })
    : res.status(404).send({ error: 'product not found' })
})

router.delete('/:id', adminAuthorization, async (req, res) => {
  const { id } = req.params
  const product: any = await productDAO.deleteOne(id)
  return product.deletedCount
    ? res.status(200).send({ data: product })
    : res.status(404).send({ error: 'product not found' })
})
