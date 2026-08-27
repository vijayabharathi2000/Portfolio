import { createApp } from './app.js'
import { connectToDatabase } from './db/connect.js'
import { env } from './config/env.js'
import { logger } from './utils/logger.js'

async function main() {
  await connectToDatabase()

  const app = createApp()
  app.listen(env.port, () => {
    logger.info(`Server listening on port ${env.port} (${env.nodeEnv})`)
  })
}

main().catch((error) => {
  logger.error('Failed to start server', error)
  process.exit(1)
})
