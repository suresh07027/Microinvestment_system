import { motion } from 'framer-motion'

const variants = {
  primary:
    'bg-brand-gradient text-white shadow-glow-indigo hover:brightness-110',
  secondary:
    'bg-white/[0.06] text-ink-50 border border-white/10 hover:bg-white/[0.1]',
  ghost:
    'bg-transparent text-ink-400 hover:text-ink-50 hover:bg-white/[0.06]',
  danger:
    'bg-rose-400/10 text-rose-400 border border-rose-400/30 hover:bg-rose-400/20',
}

const sizes = {
  sm: 'px-3 py-1.5 text-sm rounded-lg',
  md: 'px-5 py-2.5 text-sm rounded-xl',
  lg: 'px-7 py-3.5 text-base rounded-xl',
}

function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  ...props
}) {
  return (
    <motion.button
      whileHover={disabled ? {} : { scale: 1.02, y: -1 }}
      whileTap={disabled ? {} : { scale: 0.97 }}
      transition={{ duration: 0.15 }}
      disabled={disabled}
      className={`font-semibold transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2 ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  )
}

export default Button
