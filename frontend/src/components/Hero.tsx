import { motion } from 'framer-motion'
import { useProfile } from '../hooks/useProfile'
import { AsyncStateMessage } from './AsyncStateMessage'

export function Hero() {
  const state = useProfile()

  if (state.status === 'loading') {
    return (
      <div className="flex w-full flex-col items-start py-4">
        <AsyncStateMessage text="Loading profile..." />
      </div>
    )
  }

  if (state.status === 'error') {
    return (
      <div className="flex w-full flex-col items-start py-4">
        <AsyncStateMessage text="Unable to load profile." />
      </div>
    )
  }

  const profile = state.data

  return (
    <div className="flex w-full flex-col items-start py-2">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full"
      >
        <h1 className="mt-2 text-3xl font-semibold sm:text-4xl lg:text-5xl">
          {profile.headline}
        </h1>

        <p className="mt-4 max-w-3xl text-lg text-slate-600 dark:text-slate-300">
          {profile.summary}
        </p>
      </motion.div>
    </div>
  )
}