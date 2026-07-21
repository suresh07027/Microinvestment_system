import { motion } from 'framer-motion'

function Card({ children, className = '', hover = true, glow = false, as: Component, ...props }) {
  const MotionComp = motion.div

  return (
    <MotionComp
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className={`relative rounded-2xl glass-panel ${hover ? 'glass-panel-hover' : ''} ${
        glow ? 'shadow-glow-indigo' : ''
      } overflow-hidden ${className}`}
      {...props}
    >
      <div className="pointer-events-none absolute inset-0 bg-card-sheen opacity-60" />
      <div className="relative">{children}</div>
    </MotionComp>
  )
}

export default Card
