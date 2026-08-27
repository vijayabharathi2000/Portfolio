export const logger = {
  info: (message: string) => {
    console.log(`[${new Date().toISOString()}] INFO ${message}`)
  },
  error: (message: string, error?: unknown) => {
    console.error(`[${new Date().toISOString()}] ERROR ${message}`, error)
  },
}
