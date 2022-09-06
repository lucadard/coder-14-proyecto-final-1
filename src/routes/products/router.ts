import express from 'express'

import { Product } from '../../types'
import * as productServices from '../../services/productServices'
import { hasAllProps, hasAnyProps } from './lib/validation'
import { authCheckMiddleware } from '../../middleware/authorize'

export const router = express.Router()

let productList = productServices.getProducts()

router.get('/', (req, res) => {
  return res.send({ products: productList, admin: req.query.admin || 'false' })
})

router.get('/:id?', (req, res) => {
  let { id } = req.params
  const product =
    productList.find((product) => product.id === +id!) || undefined
  return product
    ? res.status(200).send({ product, admin: req.query.admin || 'false' })
    : res.status(404).send({ error: 'product not found' })
})

router.post('/', authCheckMiddleware, (req, res) => {
  const { body } = req
  let newProduct: any = {}
  if (hasAllProps(body)) {
    let newId
    if (productList.length === 0) newId = '1'
    else newId = +productList[productList.length - 1].id + 1 + ''
    newProduct = {
      id: newId,
      timestamp: new Date(),
      ...body
    }
    productList = productList.concat(newProduct)
    productServices.addProduct(newProduct)
  } else return res.status(400).send({ error: 'invalid product' })
  return res.send({ id: newProduct.id })
})

router.put('/:id', authCheckMiddleware, (req, res) => {
  const { id } = req.params
  const { body } = req
  let editedProduct: Product | undefined = undefined
  if (hasAnyProps(body)) {
    productList = productList.map((product) => {
      if (product.id === +id) {
        product = {
          ...product,
          nombre: body.nombre || product.nombre,
          descripcion: body.descripcion || product.descripcion,
          codigo: body.codigo || product.codigo,
          foto: body.foto || product.foto,
          precio: body.precio || product.precio,
          stock: body.stock || product.stock
        }
        editedProduct = product
      }
      return product
    })
  } else return res.status(400).send({ error: 'product has no valid fields' })
  return res.status(200).send({ product: editedProduct })
})

router.delete('/:id', authCheckMiddleware, (req, res) => {
  const { id } = req.params
  let deletedProductId: Product['id'] = 0
  productList = productList.filter((product) => {
    if (product.id === +id) {
      deletedProductId = product.id
      return false
    } else return true
  })
  if (deletedProductId === 0)
    return res.status(404).send({ error: 'product not found' })
  else {
    productServices.deleteProduct(deletedProductId)
    return res.status(200).send({ id: deletedProductId })
  }
})
