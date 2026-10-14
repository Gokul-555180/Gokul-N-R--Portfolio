'use client'

import { Float } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { useEffect, useState } from 'react'

type MiniSceneProps = { variant: 'portal' }

function useReducedMotion() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(media.matches)
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])
  return reduced
}

function ContactLantern() {
  return <group>
    <mesh position={[0, -.42, 0]} castShadow><cylinderGeometry args={[.38, .44, .17, 8]} /><meshStandardMaterial color="#534e5b" roughness={.9} /></mesh>
    <mesh position={[0, -.08, 0]} castShadow><cylinderGeometry args={[.28, .28, .55, 8]} /><meshStandardMaterial color="#6b7186" roughness={.78} /></mesh>
    <mesh position={[0, -.08, .285]}><planeGeometry args={[.27, .32]} /><meshBasicMaterial color="#fff0cd" /></mesh>
    <mesh position={[0, .33, 0]} castShadow><coneGeometry args={[.4, .28, 8]} /><meshStandardMaterial color="#c4a77a" roughness={.82} flatShading /></mesh>
    <mesh position={[0, .53, 0]}><sphereGeometry args={[.065, 10, 10]} /><meshStandardMaterial color="#fff0cd" emissive="#fff0cd" emissiveIntensity={1.1} /></mesh>
    <pointLight position={[0, .04, .42]} color="#fff0cd" intensity={2.2} distance={2.7} />
  </group>
}

function Scene({ variant }: MiniSceneProps) {
  const reduced = useReducedMotion()
  return <>
    <ambientLight intensity={1.6} />
    <pointLight position={[2, 3, 3]} color="#ffffff" intensity={12} distance={8} />
    <pointLight position={[-3, 0, 1]} color="#8d8bff" intensity={10} distance={8} />
    <Float speed={reduced ? 0 : .45} floatIntensity={reduced ? 0 : .12} rotationIntensity={0}><ContactLantern /></Float>
  </>
}

export default function MiniScene({ variant }: MiniSceneProps) {
  return <Canvas shadows dpr={[1, 1.3]} camera={{ position: [0, 0, 4.1], fov: 40 }} gl={{ antialias: true, powerPreference: 'high-performance' }} aria-label="A small animated 3D contact portal">
    <Scene variant={variant} />
  </Canvas>
}
