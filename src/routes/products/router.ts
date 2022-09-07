import express from 'express'

import * as productServices from '../../services/productServices'
import { hasAllProps, hasAnyProps } from './lib/validation'
import { authCheckMiddleware } from '../../middleware/authorize'

export const router = express.Router()

router.get('/', (req, res) => {
  const products = productServices.getProducts()
  return res.send({ products, admin: req.query.admin || 'false' })
})

router.get('/:id', (req, res) => {
  let { id } = req.params
  const product = productServices.findById(+id)
  return product
    ? res.status(200).send({ product, admin: req.query.admin || 'false' })
    : res.status(404).send({ error: 'product not found' })
})

router.post('/', authCheckMiddleware, (req, res) => {
  const { body } = req
  if (!hasAllProps(body))
    return res.status(400).send({ error: 'invalid product' })

  let newProduct = productServices.addProduct({
    ...body
  })

  return res.send({ newProduct })
})

router.put('/:id', authCheckMiddleware, (req, res) => {
  const { id } = req.params
  const { body } = req
  if (!hasAnyProps(body))
    return res.status(400).send({ error: 'invalid props' })

  const updatedProduct = productServices.updateProduct(+id, { ...body })

  return res.status(200).send({ updatedProduct })
})

router.delete('/:id', authCheckMiddleware, (req, res) => {
  const { id } = req.params
  const product = productServices.deleteProduct(+id)
  return product
    ? res.status(200).send({ product })
    : res.status(404).send({ error: 'product not found' })
})
