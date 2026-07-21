import { useRef, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Float, Sparkles, Torus, Icosahedron } from '@react-three/drei'
import * as THREE from 'three'

function Coin({ radius, speed, offset, size, color }) {
  const ref = useRef()

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * speed + offset
    ref.current.position.x = Math.cos(t) * radius
    ref.current.position.z = Math.sin(t) * radius
    ref.current.position.y = Math.sin(t * 1.6) * 0.4
    ref.current.rotation.y = t * 1.4
    ref.current.rotation.x = 0.6
  })

  return (
    <mesh ref={ref}>
      <cylinderGeometry args={[size, size, size * 0.16, 40]} />
      <meshStandardMaterial
        color={color}
        metalness={0.85}
        roughness={0.25}
        emissive={color}
        emissiveIntensity={0.15}
      />
    </mesh>
  )
}

function Scene() {
  const group = useRef()
  const { pointer } = useThree()

  const coins = useMemo(
    () => [
      { radius: 2.1, speed: 0.35, offset: 0, size: 0.34, color: '#FBBF24' },
      { radius: 2.4, speed: -0.28, offset: 2, size: 0.26, color: '#818CF8' },
      { radius: 1.9, speed: 0.42, offset: 4, size: 0.22, color: '#A78BFA' },
      { radius: 2.6, speed: -0.22, offset: 1, size: 0.3, color: '#FBBF24' },
      { radius: 2.2, speed: 0.3, offset: 5, size: 0.2, color: '#34D399' },
    ],
    []
  )

  useFrame(() => {
    if (!group.current) return
    // gentle mouse-parallax tilt of the whole scene
    group.current.rotation.y += (pointer.x * 0.6 - group.current.rotation.y) * 0.04
    group.current.rotation.x += (-pointer.y * 0.3 - group.current.rotation.x) * 0.04
  })

  return (
    <group ref={group}>
      <Float speed={1.4} rotationIntensity={0.5} floatIntensity={1.1}>
        <Icosahedron args={[1.15, 1]}>
          <meshStandardMaterial
            color="#6366F1"
            metalness={0.6}
            roughness={0.15}
            emissive="#4338CA"
            emissiveIntensity={0.35}
            wireframe={false}
          />
        </Icosahedron>
      </Float>

      <Float speed={1} rotationIntensity={0.2} floatIntensity={0.6}>
        <Torus args={[1.9, 0.045, 16, 100]} rotation={[Math.PI / 2.3, 0, 0]}>
          <meshStandardMaterial color="#A78BFA" metalness={0.7} roughness={0.3} emissive="#7C3AED" emissiveIntensity={0.3} />
        </Torus>
      </Float>

      {coins.map((c, i) => (
        <Coin key={i} {...c} />
      ))}

      <Sparkles count={60} scale={6} size={2} speed={0.3} color="#A5B4FC" opacity={0.6} />
    </group>
  )
}

function InvestmentScene({ className = '' }) {
  return (
    <div className={className}>
      <Canvas
        camera={{ position: [0, 0, 6.5], fov: 42 }}
        gl={{ alpha: true, antialias: true }}
        dpr={[1, 1.75]}
      >
        <ambientLight intensity={0.55} />
        <directionalLight position={[4, 5, 4]} intensity={1.1} color="#C7D2FE" />
        <pointLight position={[-4, -3, 2]} intensity={1.2} color="#8B5CF6" />
        <Scene />
      </Canvas>
    </div>
  )
}

export default InvestmentScene