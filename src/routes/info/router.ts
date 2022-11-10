import { Router } from 'express'
import path from 'path'
import os from 'os'

import { argumentsObject } from '../../config/args'
import { logger } from '../../config/logger'

export const router = Router()

router.get('/', (req, res) => {
  logger.petition(req)
  const info = {
    args: argumentsObject,
    os: process.platform,
    execPath: process.execPath,
    projectFolder: path.join(__dirname, '..'),
    pid: process.pid,
    nodeVersion: process.versions.node,
    reservedMemory: process.memoryUsage().rss,
    processors: os.cpus().length
  }

  // console.log(info)

  res.json(info)
})
