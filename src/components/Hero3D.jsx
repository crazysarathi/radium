import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Icosahedron, Line, Float } from '@react-three/drei'
import * as THREE from 'three'

/* ------------------------------------------------------------------ */
/* A slowly rotating "data core": a glowing wireframe icosahedron, an   */
/* orbiting ring, and a field of drifting points. The whole rig leans   */
/* toward the pointer so it feels physical without being distracting.   */
/* ------------------------------------------------------------------ */

const BEAM = new THREE.Color('#ff4d5e')
const HOT = new THREE.Color('#ff97a1')

function Core() {
  const group = useRef()
  const inner = useRef()

  useFrame((state, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * 0.18
      // Ease the rig toward the pointer position.
      const { x, y } = state.pointer
      group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, y * 0.35, 0.05)
      group.current.rotation.z = THREE.MathUtils.lerp(group.current.rotation.z, -x * 0.25, 0.05)
    }
    if (inner.current) inner.current.rotation.y -= delta * 0.4
  })

  return (
    <group ref={group}>
      {/* Outer wireframe shell */}
      <Icosahedron args={[1.6, 1]}>
        <meshBasicMaterial color={BEAM} wireframe transparent opacity={0.28} />
      </Icosahedron>

      {/* Solid inner facets that catch the light */}
      <Icosahedron ref={inner} args={[1.12, 0]}>
        <meshStandardMaterial
          color="#2a0d12"
          emissive={BEAM}
          emissiveIntensity={0.35}
          metalness={0.6}
          roughness={0.25}
          flatShading
        />
      </Icosahedron>

      {/* Glowing nodes at each outer vertex */}
      <Nodes radius={1.6} />
    </group>
  )
}

function Nodes({ radius }) {
  const geo = useMemo(() => new THREE.IcosahedronGeometry(radius, 1), [radius])
  const positions = useMemo(() => {
    const pos = geo.attributes.position
    const seen = new Set()
    const out = []
    for (let i = 0; i < pos.count; i += 1) {
      const key = `${pos.getX(i).toFixed(2)}|${pos.getY(i).toFixed(2)}|${pos.getZ(i).toFixed(2)}`
      if (seen.has(key)) continue
      seen.add(key)
      out.push([pos.getX(i), pos.getY(i), pos.getZ(i)])
    }
    return out
  }, [geo])

  return positions.map((p, i) => (
    <mesh key={i} position={p}>
      <sphereGeometry args={[0.035, 12, 12]} />
      <meshBasicMaterial color={i % 3 === 0 ? HOT : BEAM} />
    </mesh>
  ))
}

function Ring({ radius = 2.5, tilt = 1.1 }) {
  const ref = useRef()
  const points = useMemo(() => {
    const p = []
    for (let i = 0; i <= 128; i += 1) {
      const a = (i / 128) * Math.PI * 2
      p.push([Math.cos(a) * radius, 0, Math.sin(a) * radius])
    }
    return p
  }, [radius])

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.z += delta * 0.1
  })

  return (
    <group rotation={[tilt, 0, 0]}>
      <Line ref={ref} points={points} color="#ff4d5e" lineWidth={1} transparent opacity={0.35} />
    </group>
  )
}

function ParticleField({ count = 900 }) {
  const ref = useRef()
  const geometry = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i += 1) {
      // Distribute in a spherical shell around the core.
      const r = 3 + Math.pow(Math.random(), 2) * 5
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.6
      arr[i * 3 + 2] = r * Math.cos(phi)
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(arr, 3))
    return g
  }, [count])

  useFrame((state, delta) => {
    if (!ref.current) return
    ref.current.rotation.y += delta * 0.03
    ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, state.pointer.y * 0.1, 0.03)
  })

  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial
        size={0.028}
        color="#ff7f88"
        transparent
        opacity={0.7}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  )
}

export default function Hero3D() {
  return (
    <Canvas
      dpr={[1, 1.8]}
      camera={{ position: [0, 0, 7], fov: 42 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      style={{ width: '100%', height: '100%' }}
    >
      <ambientLight intensity={0.6} />
      <pointLight position={[6, 6, 8]} intensity={2.4} color="#ff97a1" />
      <pointLight position={[-8, -4, -6]} intensity={1.4} color="#d02f4a" />

      <Float speed={1.4} rotationIntensity={0.35} floatIntensity={0.7}>
        <Core />
      </Float>
      <Ring radius={2.6} tilt={1.15} />
      <Ring radius={3.3} tilt={-0.6} />
      <ParticleField />
    </Canvas>
  )
}
