import cluster from 'cluster'

import { createServer } from './src/server'
import { argumentsObject } from './src/config/args'
import { logger } from './src/config/logger'

if (cluster.isPrimary) {
  logger.info(`Program starting...`)
  logger.info(`Running in ${argumentsObject.mode} mode.`)

  for (let i = 0; i < argumentsObject.i; i++) {
    const PORT =
      i === 0 ? argumentsObject.port + i : argumentsObject.port + i + 1
    cluster.fork({ PORT })
  }

  cluster.on('exit', (worker) => {
    logger.error(`Worker ${worker.id}, pid: ${worker.process.pid}. Died`)
    cluster.fork({ PORT: argumentsObject.port + worker.id - 1 })
  })
} else {
  async function initializeServer() {
    const PORT =
      argumentsObject.mode === 'fork'
        ? argumentsObject.port
        : +process.env.PORT!
    try {
      const server = await createServer(PORT)
      logger.info(
        `Worker ${cluster.worker?.id}, pid: ${process.pid}: Listening on port ${
          server.address().port
        }`
      )
    } catch (err) {
      logger.error('Server error', err)
    }
  }
  initializeServer()
}
