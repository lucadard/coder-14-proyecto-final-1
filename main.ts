import cluster from 'cluster'

import { createServer } from './src/server'
import { argumentsObject } from './src/config/args'
import { logger } from './src/config/logger'

async function initializeServer() {
  const PORT =
    argumentsObject.mode === 'fork' ? argumentsObject.port : +process.env.PORT!
  try {
    const server = await createServer(PORT)
    logger.info(
      `Server pid: ${process.pid}: Listening on port ${
        server.address().port
      }`
    )
  } catch (err) {
    logger.error('Server error', err)
  }
}

if (cluster.isPrimary) {
  logger.info(`Program starting...`)
  logger.info(`Running in ${argumentsObject.mode} mode.`)

  if (argumentsObject.mode === 'cluster') {
    for (let i = 0; i < argumentsObject.i; i++) {
      const PORT =
        i === 0 ? argumentsObject.port + i : argumentsObject.port + i + 1
      cluster.fork({ PORT })
    }
  } else initializeServer()

  cluster.on('exit', (worker) => {
    logger.error(`Worker pid: ${worker.process.pid}. Died`)
    cluster.fork({ PORT: argumentsObject.port + worker.id - 1 })
  })
} else initializeServer()
