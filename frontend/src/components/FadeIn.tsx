import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

export function FadeIn({
  children,
  className,
  hover = false,
}: {
  children: ReactNode
  className?: string
  hover?: boolean
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.4 }}
      whileHover={hover ? { y: -4 } : undefined}
      className={className}
    >
      {children}
    </motion.div>
  )
}
