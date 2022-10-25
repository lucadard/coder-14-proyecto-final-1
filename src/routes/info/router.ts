import { Router } from 'express'
import path from 'path'

import { argumentsObject } from '../../config/args'

export const router = Router()

router.get('/', (_, res) => {
  res.json({
    args: argumentsObject,
    os: process.platform,
    execPath: process.execPath,
    projectFolder: path.join(__dirname, '..'),
    pid: process.pid,
    nodeVersion: process.versions.node,
    reservedMemory: process.memoryUsage().rss
  })
})
