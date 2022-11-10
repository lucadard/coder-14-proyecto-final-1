import { Router } from 'express'
import { fork } from 'child_process'
import path from 'path'

import { argumentsObject } from '../../config/args'
import { logger } from '../../config/logger'

const calculate = (amount: number) => {
  const randoms: { [key: string]: number } = {}

  const startTime = performance.now()
  for (let i = 0; i < amount; i++) {
    const randomNumber = Math.ceil(Math.random() * (1000 + 1) - 1)
    if (randoms[randomNumber]) randoms[randomNumber]++
    else randoms[randomNumber] = 1
  }
  const endTime = performance.now()

  return {
    randoms,
    time: `in ${((endTime - startTime) / 1000).toFixed(3)}s`,
    by: `Worker ${process.pid}`
  }
}

export const router = Router()

router.get('/', (req, res) => {
  logger.petition(req)
  let cant: number = req.query.cant ? +req.query.cant : 100000000

  // if (argumentsObject.mode === 'cluster')
  res.json(calculate(cant))
  // else {
  //   const randoms = fork(
  //     path.resolve(__dirname, '../src/routes/randoms/calculate.js')
  //   )
  //   randoms.on('message', (data) => {
  //     if (data === 'ready') randoms.send(cant)
  //     else res.json(data)
  //   })
  // }
})
