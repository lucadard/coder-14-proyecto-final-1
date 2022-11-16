import cluster from 'cluster'

import { createServer } from './src/server'
import { argumentsObject } from './src/config/args'
import { logger } from './src/config/logger'

const PRIMARY_PORT = +process.env.PORT! || argumentsObject.port || 8080

async function initializeServer() {
  try {
    const server = await createServer(
      cluster.isPrimary ? PRIMARY_PORT : +process.env.SECONDARY_PORT!
    )
    logger.info(
      `Server pid: ${process.pid}: Listening on port ${server.address().port}`
    )
  } catch (err) {
    logger.error('Server error', err)
  }
}

if (cluster.isPrimary) {
  logger.info(`Program starting...`)
  logger.info(`Running in ${process.env.NODE_ENV}.`)
  logger.info(`Running in ${argumentsObject.mode} mode.`)

  if (argumentsObject.mode === 'cluster') {
    for (let i = 0; i < argumentsObject.i; i++) {
      const SECONDARY_PORT = i === 0 ? PRIMARY_PORT + i : PRIMARY_PORT + i + 1
      cluster.fork({ SECONDARY_PORT })
    }
  } else initializeServer()

  cluster.on('exit', (worker) => {
    logger.error(`Worker pid: ${worker.process.pid}. Died`)
    cluster.fork({
      PORT: PRIMARY_PORT + worker.id - 1
    })
  })
} else initializeServer()
