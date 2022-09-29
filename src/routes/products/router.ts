import express from 'express'

import { productDAOMongoDB as productDAO } from '../../services'
// import { hasAllProps, hasAnyProps } from './lib/validation'
import { authCheckMiddleware } from '../../middleware/authorize'

export const router = express.Router()

router.get('/', async (req, res) => {
  const products = await productDAO.getAll()
  return res.send({ products, admin: req.query.admin || 'false' })
})

router.get('/:id', async (req, res) => {
  let { id } = req.params
  const product: any = await productDAO.findById(+id)
  return product
    ? res.status(200).send({ product, admin: req.query.admin || 'false' })
    : res.status(404).send({ error: 'product not found' })
})

router.post('/', authCheckMiddleware, async (req, res) => {
  const { body } = req
  // if (!hasAllProps(body))
  // return res.status(400).send({ error: 'invalid product' })

  let newProduct = await productDAO.addOne({
    ...body
  })

  return res.send({ newProduct })
})

router.put('/:id', authCheckMiddleware, async (req, res) => {
  const { id } = req.params
  const { body } = req

  const updatedProduct = await productDAO.updateById(+id, { ...body })

  return res.status(200).send({ updatedProduct })
})

router.delete('/:id', authCheckMiddleware, async (req, res) => {
  const { id } = req.params
  const product: any = await productDAO.deleteOne(+id)
  return product
    ? res.status(200).send({ product })
    : res.status(404).send({ error: 'product not found' })
})
