import { motion, useSpring, useTransform } from 'framer-motion'
import investHero from '../../assets/invest-hero.png.png'

/**
 * Renders the uploaded investment illustration with a real 3D tilt
 * (driven by page-level mouseX/mouseY motion values passed in from the parent),
 * a continuous gentle float, and a soft glow halo behind it.
 */
function HeroImage3D({ mouseX, mouseY, className = '' }) {
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), { stiffness: 120, damping: 18 })
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-12, 12]), { stiffness: 120, damping: 18 })
  const translateX = useSpring(useTransform(mouseX, [-0.5, 0.5], [-14, 14]), { stiffness: 80, damping: 20 })
  const translateY = useSpring(useTransform(mouseY, [-0.5, 0.5], [-10, 10]), { stiffness: 80, damping: 20 })

  return (
    <div className={`relative flex items-center justify-center ${className}`} style={{ perspective: 1400 }}>
      {/* glow halo behind the image */}
      <motion.div
        className="absolute inset-6 rounded-full bg-brand-gradient blur-[70px] opacity-35"
        animate={{ scale: [1, 1.12, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute w-2/3 h-2/3 rounded-full bg-amber-400/20 blur-[60px]"
        animate={{ scale: [1, 1.25, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      />

      {/* the 3D-tilted, floating hero image */}
      <motion.div
        style={{
          rotateX,
          rotateY,
          x: translateX,
          y: translateY,
          transformStyle: 'preserve-3d',
        }}
        className="relative w-full max-w-[26rem]"
      >
        <motion.img
          src={investHero}
          alt="Coins growing into an investment on a phone"
          className="w-full h-auto rounded-[2rem] shadow-[0_35px_70px_rgba(0,0,0,0.55)] object-contain"
          animate={{ y: [0, -16, 0], rotate: [0, 1.2, 0, -1.2, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transform: 'translateZ(40px)' }}
        />

        {/* floating badge for extra depth */}
        <motion.div
          className="absolute -top-3 -right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full glass-panel text-xs font-bold text-mint-400 shadow-glow-indigo"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transform: 'translateZ(60px)' }}
        >
          +12.4% growth
        </motion.div>
        <motion.div
          className="absolute -bottom-3 -left-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full glass-panel text-xs font-bold text-indigo-300 shadow-glow-indigo"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
          style={{ transform: 'translateZ(60px)' }}
        >
          Spare change, invested
        </motion.div>
      </motion.div>
    </div>
  )
}

export default HeroImage3D