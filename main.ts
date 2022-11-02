import cluster from 'cluster'

import { createServer } from './src/server'
import { argumentsObject } from './src/config/args'

if (cluster.isPrimary) console.log(`Running in ${argumentsObject.mode} mode.`)

if (cluster.isPrimary && argumentsObject.mode === 'cluster') {
  console.log(`Primary: ${process.pid}. Is running.`)

  for (let i = 0; i < 5; i++) {
    cluster.fork({ id: i, PORT: argumentsObject.port + i })
  }

  cluster.on('exit', (worker) => {
    console.log(`Worker ${worker.id}, pid: ${worker.process.pid}. Died`)
    cluster.fork({ PORT: argumentsObject.port + worker.id - 1 })
  })
} else {
  async function initializeServer() {
    try {
      const server = await createServer(+process.env.PORT!)
      console.log(
        `Worker ${cluster.worker?.id}, pid: ${process.pid}: Listening on port ${
          server.address().port
        }`
      )
    } catch (err) {
      console.log('Server error', err)
    }
  }
  initializeServer()
}
