import { Router } from 'express'
import { fork } from 'child_process'
import path from 'path'

export const router = Router()

router.get('/', ({ query }, res) => {
  let cant: number = query.cant ? +query.cant : 100000000

  const randoms = fork(
    path.resolve(__dirname, '../src/routes/randoms/calculate.js')
  )

  randoms.on('message', (data) => {
    if (data === 'ready') randoms.send(cant)
    else res.json(data)
  })
})
