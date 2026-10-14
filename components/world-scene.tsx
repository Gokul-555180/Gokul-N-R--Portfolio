'use client'

import { ContactShadows, Float, OrbitControls, PerspectiveCamera } from '@react-three/drei'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useEffect, useRef, useState } from 'react'
import type { Group, Mesh, MeshBasicMaterial, PlaneGeometry } from 'three'

type Destination = 'projects' | 'about' | 'contact'
type WorldSceneProps = { onStationSelect?: (id: Destination) => void, resetKey?: number }
type Position = [number, number, number]

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

function Pine({ position, scale = 1, tint = '#4f7969' }: { position: Position, scale?: number, tint?: string }) {
  return <group position={position} scale={scale}>
    <mesh position={[0, .32, 0]} castShadow><cylinderGeometry args={[.055, .09, .64, 7]} /><meshStandardMaterial color="#745441" roughness={1} /></mesh>
    <mesh position={[0, .68, 0]} castShadow><coneGeometry args={[.33, .72, 7]} /><meshStandardMaterial color={tint} roughness={1} flatShading /></mesh>
    <mesh position={[0, 1.04, 0]} castShadow><coneGeometry args={[.24, .6, 7]} /><meshStandardMaterial color={tint} roughness={1} flatShading /></mesh>
  </group>
}

function Rock({ position, scale = 1, color = '#687574' }: { position: Position, scale?: number, color?: string }) {
  return <mesh position={position} scale={scale} rotation={[.22, .38, .1]} castShadow><dodecahedronGeometry args={[.22, 0]} /><meshStandardMaterial color={color} roughness={1} flatShading /></mesh>
}

function Island({ position, radius, height = .55, grass = '#8cae79', earth = '#8e6554', children }: { position: Position, radius: number, height?: number, grass?: string, earth?: string, children: React.ReactNode }) {
  return <group position={position}>
    <mesh position={[0, -height * .48, 0]} castShadow receiveShadow><coneGeometry args={[radius * .78, height * 1.8, 8]} /><meshStandardMaterial color={earth} roughness={1} flatShading /></mesh>
    <mesh position={[0, 0, 0]} castShadow receiveShadow><cylinderGeometry args={[radius, radius * .9, height, 8]} /><meshStandardMaterial color={grass} roughness={1} flatShading /></mesh>
    <mesh position={[0, height * .52, 0]} receiveShadow><cylinderGeometry args={[radius * .92, radius * .92, .055, 8]} /><meshStandardMaterial color="#afc984" roughness={1} flatShading /></mesh>
    {children}
  </group>
}

function Cabin() {
  const screen = useRef<Mesh<PlaneGeometry, MeshBasicMaterial>>(null)
  const reduced = useReducedMotion()
  useFrame(({ clock }) => {
    if (screen.current && !reduced) screen.current.material.opacity = .68 + Math.sin(clock.getElapsedTime() * 1.7) * .18
  })
  return <group position={[.12, .42, .04]} rotation={[0, -.18, 0]}>
    <mesh position={[0, .38, 0]} castShadow receiveShadow><boxGeometry args={[1.16, .7, .84]} /><meshStandardMaterial color="#635f69" roughness={.9} /></mesh>
    <mesh position={[0, .96, 0]} rotation={[0, Math.PI / 4, 0]} castShadow><coneGeometry args={[.85, .61, 4]} /><meshStandardMaterial color="#303750" roughness={.78} flatShading /></mesh>
    <mesh position={[-.31, .42, .431]}><planeGeometry args={[.22, .28]} /><meshBasicMaterial color="#a9dcff" /></mesh>
    <mesh position={[.27, .42, .431]}><planeGeometry args={[.22, .28]} /><meshBasicMaterial color="#a9dcff" /></mesh>
    <mesh position={[-.06, .27, .434]}><planeGeometry args={[.18, .36]} /><meshStandardMaterial color="#413a4a" roughness={1} /></mesh>
    <mesh position={[.54, 1.16, -.13]} castShadow><boxGeometry args={[.12, .47, .12]} /><meshStandardMaterial color="#714f43" /></mesh>
    <group position={[-.15, .84, .5]}>
      <mesh position={[0, -.18, 0]} castShadow><boxGeometry args={[.48, .05, .18]} /><meshStandardMaterial color="#a97d5e" /></mesh>
      <mesh position={[0, .05, 0]} castShadow><boxGeometry args={[.29, .22, .045]} /><meshStandardMaterial color="#1d2737" /></mesh>
      <mesh ref={screen} position={[0, .05, .027]}><planeGeometry args={[.22, .15]} /><meshBasicMaterial color="#d9efff" transparent opacity={.82} /></mesh>
    </group>
    <pointLight position={[-.12, .83, .72]} color="#b9dcff" intensity={1.5} distance={1.45} />
  </group>
}

function Lookout({ reduced }: { reduced: boolean }) {
  const fan = useRef<Group>(null)
  useFrame(({ clock }) => {
    if (fan.current && !reduced) fan.current.rotation.z = clock.getElapsedTime() * 1.25
  })
  return <group position={[-.96, .37, -.48]}>
    <mesh position={[0, .38, 0]} castShadow><cylinderGeometry args={[.32, .42, .76, 8]} /><meshStandardMaterial color="#56617a" roughness={.85} flatShading /></mesh>
    <mesh position={[0, .84, 0]} castShadow><coneGeometry args={[.44, .4, 8]} /><meshStandardMaterial color="#d6c991" roughness={.75} flatShading /></mesh>
    <group ref={fan} position={[0, 1.16, .04]} rotation={[0, 0, Math.PI / 6]}>
      {[0, Math.PI / 2, Math.PI, Math.PI * 1.5].map((rotation) => <mesh key={rotation} rotation={[0, 0, rotation]} position={[.24, 0, 0]}><boxGeometry args={[.43, .07, .035]} /><meshStandardMaterial color="#9bc4db" roughness={.65} /></mesh>)}
      <mesh><sphereGeometry args={[.11, 10, 10]} /><meshStandardMaterial color="#fff0cd" emissive="#fff0cd" emissiveIntensity={.5} /></mesh>
    </group>
    <pointLight position={[0, 1.14, .1]} color="#fff0cd" intensity={1.7} distance={1.7} />
  </group>
}

function ArchiveDeck() {
  return <group position={[0, .33, 0]} rotation={[0, -.2, 0]}>
    <mesh position={[0, .04, 0]} castShadow receiveShadow><cylinderGeometry args={[.74, .74, .1, 8]} /><meshStandardMaterial color="#c9b482" roughness={1} /></mesh>
    <mesh position={[-.22, .42, 0]} castShadow><boxGeometry args={[.36, .72, .42]} /><meshStandardMaterial color="#52566e" roughness={.8} /></mesh>
    <mesh position={[-.22, .43, .215]}><planeGeometry args={[.22, .42]} /><meshBasicMaterial color="#9bcbff" /></mesh>
    <mesh position={[.27, .27, .04]} castShadow><boxGeometry args={[.33, .43, .34]} /><meshStandardMaterial color="#88735c" roughness={1} /></mesh>
    <mesh position={[.27, .56, .04]} rotation={[0, Math.PI / 4, 0]} castShadow><coneGeometry args={[.29, .25, 4]} /><meshStandardMaterial color="#393e58" roughness={.85} flatShading /></mesh>
    <pointLight position={[-.22, .52, .48]} color="#9bcbff" intensity={1.3} distance={1.3} />
  </group>
}

function SignalDock() {
  return <group position={[0, .36, 0]}>
    <mesh position={[0, .04, 0]} castShadow receiveShadow><cylinderGeometry args={[.7, .7, .08, 8]} /><meshStandardMaterial color="#b9977b" roughness={1} /></mesh>
    <mesh position={[0, .38, 0]} castShadow><cylinderGeometry args={[.16, .21, .7, 8]} /><meshStandardMaterial color="#4b5169" roughness={.8} /></mesh>
    <mesh position={[0, .76, 0]}><sphereGeometry args={[.23, 16, 16]} /><meshStandardMaterial color="#ffbf9c" emissive="#ffbf9c" emissiveIntensity={.82} roughness={.32} /></mesh>
    <mesh position={[-.36, .21, .1]} castShadow><boxGeometry args={[.25, .35, .24]} /><meshStandardMaterial color="#607668" roughness={1} /></mesh>
    <mesh position={[.36, .21, -.08]} castShadow><boxGeometry args={[.25, .35, .24]} /><meshStandardMaterial color="#607668" roughness={1} /></mesh>
    <pointLight position={[0, .78, 0]} color="#ffbf9c" intensity={2.1} distance={1.8} />
  </group>
}

function Trailhead({ position, accent, onChoose }: { position: Position, accent: string, onChoose: () => void }) {
  const [hovered, setHovered] = useState(false)
  useEffect(() => {
    if (hovered) document.body.style.cursor = 'pointer'
    return () => { document.body.style.cursor = '' }
  }, [hovered])
  return <group position={position} onClick={(event) => { event.stopPropagation(); onChoose() }} onPointerOver={(event) => { event.stopPropagation(); setHovered(true) }} onPointerOut={() => setHovered(false)}>
    <mesh position={[0, .18, 0]} castShadow><cylinderGeometry args={[.08, .1, .36, 6]} /><meshStandardMaterial color="#604b42" roughness={1} /></mesh>
    <mesh position={[0, .39, .015]} castShadow><boxGeometry args={[.42, .24, .05]} /><meshStandardMaterial color={hovered ? accent : '#e1d7bb'} emissive={hovered ? accent : '#000000'} emissiveIntensity={hovered ? .5 : 0} roughness={.7} /></mesh>
    <mesh position={[-.27, .38, 0]} castShadow><boxGeometry args={[.08, .53, .08]} /><meshStandardMaterial color="#604b42" roughness={1} /></mesh>
    <pointLight position={[0, .46, .22]} color={accent} intensity={hovered ? 1.7 : .72} distance={1.25} />
  </group>
}

function Bridge({ position, length, rotation = 0 }: { position: Position, length: number, rotation?: number }) {
  return <group position={position} rotation={[0, rotation, 0]}>
    <mesh position={[0, 0, 0]} castShadow receiveShadow><boxGeometry args={[length, .1, .38]} /><meshStandardMaterial color="#c9aa79" roughness={1} /></mesh>
    <mesh position={[0, .17, -.21]} castShadow><boxGeometry args={[length, .05, .04]} /><meshStandardMaterial color="#6e5b54" roughness={1} /></mesh>
    <mesh position={[0, .17, .21]} castShadow><boxGeometry args={[length, .05, .04]} /><meshStandardMaterial color="#6e5b54" roughness={1} /></mesh>
  </group>
}

function Cloud({ position, scale = 1 }: { position: Position, scale?: number }) {
  return <group position={position} scale={scale}>
    <mesh><sphereGeometry args={[.55, 14, 12]} /><meshStandardMaterial color="#f3f1e8" roughness={1} /></mesh>
    <mesh position={[.45, .04, 0]}><sphereGeometry args={[.38, 14, 12]} /><meshStandardMaterial color="#f3f1e8" roughness={1} /></mesh>
    <mesh position={[-.42, -.05, .03]}><sphereGeometry args={[.35, 14, 12]} /><meshStandardMaterial color="#f3f1e8" roughness={1} /></mesh>
  </group>
}

function Airship({ reduced }: { reduced: boolean }) {
  const ship = useRef<Group>(null)
  useFrame(({ clock }) => {
    if (!ship.current || reduced) return
    ship.current.position.x = 2.3 + Math.sin(clock.getElapsedTime() * .18) * .6
    ship.current.position.y = 2.2 + Math.sin(clock.getElapsedTime() * .62) * .08
  })
  return <group ref={ship} position={[2.3, 2.2, -2.2]} rotation={[0, -.4, 0]}>
    <mesh scale={[1.1, .55, .55]}><sphereGeometry args={[.34, 16, 12]} /><meshStandardMaterial color="#e8d9b6" roughness={.8} /></mesh>
    <mesh position={[0, -.34, 0]} castShadow><boxGeometry args={[.48, .16, .22]} /><meshStandardMaterial color="#665d66" roughness={.85} /></mesh>
    <mesh position={[-.42, .01, 0]} rotation={[0, 0, Math.PI / 2]}><coneGeometry args={[.14, .26, 4]} /><meshStandardMaterial color="#a7d4e8" flatShading /></mesh>
  </group>
}

function World({ onChoose }: { onChoose: (destination: Destination) => void }) {
  const root = useRef<Group>(null)
  const reduced = useReducedMotion()
  const { pointer } = useThree()
  useFrame(({ clock }) => {
    if (!root.current || reduced) return
    root.current.position.y = Math.sin(clock.getElapsedTime() * .45) * .045
    root.current.rotation.y += (pointer.x * .045 - root.current.rotation.y) * .028
  })

  return <group ref={root}>
    <mesh position={[0, -1.47, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow><circleGeometry args={[7.4, 64]} /><meshStandardMaterial color="#3e6580" roughness={.45} metalness={.12} /></mesh>
    <mesh position={[0, -1.43, 0]} rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[4.7, 6.1, 64]} /><meshBasicMaterial color="#719bb0" transparent opacity={.27} /></mesh>
    <Island position={[0, 0, 0]} radius={2.2} height={.58}>
      <mesh position={[.12, .35, .2]} rotation={[0, -.54, 0]}><boxGeometry args={[.15, .026, 2.28]} /><meshStandardMaterial color="#e2ca91" roughness={1} /></mesh>
      <mesh position={[.77, .35, -.54]} rotation={[0, .8, 0]}><boxGeometry args={[.12, .026, 1.67]} /><meshStandardMaterial color="#e2ca91" roughness={1} /></mesh>
      <Cabin />
      <Lookout reduced={reduced} />
      <Pine position={[-1.36, .37, .67]} scale={1.14} />
      <Pine position={[1.28, .37, .68]} scale={.83} tint="#668c72" />
      <Pine position={[-1.3, .37, -1.08]} scale={.7} tint="#507467" />
      <Pine position={[.93, .37, -1.25]} scale={.68} tint="#6b8f70" />
      <Rock position={[-1.7, .37, -.08]} scale={.88} /><Rock position={[1.53, .37, .3]} scale={.63} color="#788076" /><Rock position={[-.7, .37, 1.53]} scale={.54} color="#887d6b" />
      <Trailhead position={[1.42, .36, -.04]} accent="#9bcbff" onChoose={() => onChoose('about')} />
    </Island>
    <Island position={[-3.45, -.37, -.28]} radius={1.26} height={.45} grass="#8fab7b" earth="#876252"><ArchiveDeck /><Pine position={[-.68, .3, .5]} scale={.58} tint="#5e846d" /><Rock position={[.7, .3, -.35]} scale={.55} /><Trailhead position={[.62, .3, .35]} accent="#d8ccff" onChoose={() => onChoose('projects')} /></Island>
    <Island position={[-5.28, -.78, .72]} radius={1.02} height={.34} grass="#78927b" earth="#795c52"><Pine position={[-.34, .25, .08]} scale={.68} tint="#527767" /><Pine position={[.36, .24, -.24]} scale={.48} tint="#668a70" /><Rock position={[.42, .24, .35]} scale={.48} color="#6d7772" /></Island>
    <Island position={[3.14, -.54, -.77]} radius={1.12} height={.38} grass="#90a977" earth="#8f6757"><SignalDock /><Pine position={[-.58, .27, -.32]} scale={.52} tint="#5e826b" /><Rock position={[.58, .28, .34]} scale={.5} /><Trailhead position={[-.58, .28, .34]} accent="#ffbfa8" onChoose={() => onChoose('contact')} /></Island>
    <Bridge position={[-1.75, -.02, -.14]} length={1.35} rotation={-.03} />
    <Bridge position={[1.72, -.23, -.39]} length={1.48} rotation={-.17} />
    <Airship reduced={reduced} />
    <Float speed={reduced ? 0 : .3} floatIntensity={reduced ? 0 : .13} rotationIntensity={0}><Cloud position={[-5.05, 1.34, -2.55]} scale={.78} /></Float>
    <Float speed={reduced ? 0 : .35} floatIntensity={reduced ? 0 : .16} rotationIntensity={0}><Cloud position={[-3.9, 2.12, -3.4]} scale={1.08} /></Float>
    <Float speed={reduced ? 0 : .43} floatIntensity={reduced ? 0 : .17} rotationIntensity={0}><Cloud position={[3.92, 1.24, -3.6]} scale={.72} /></Float>
  </group>
}

function Scene({ onStationSelect }: Pick<WorldSceneProps, 'onStationSelect'>) {
  const reduced = useReducedMotion()
  const choose = onStationSelect ?? (() => undefined)
  return <>
    <color attach="background" args={['#171d32']} />
    <fog attach="fog" args={['#171d32', 7.8, 18]} />
    <PerspectiveCamera makeDefault position={[6.9, 4.25, 8.6]} fov={33} />
    <hemisphereLight args={['#cce4ff', '#6c5146', 1.55]} />
    <directionalLight position={[4, 8, 5]} intensity={2.65} color="#fff0d5" castShadow shadow-mapSize-width={1024} shadow-mapSize-height={1024} />
    <pointLight position={[-4.7, 2.5, 1]} intensity={7} distance={10} color="#8fb9ff" />
    <World onChoose={choose} />
    <ContactShadows position={[0, -1.48, 0]} opacity={.34} scale={12} blur={2.8} far={4.5} color="#0d1221" />
    <OrbitControls enablePan={false} enableZoom={false} minPolarAngle={.86} maxPolarAngle={1.27} minAzimuthAngle={-.48} maxAzimuthAngle={.48} autoRotate={!reduced} autoRotateSpeed={.12} />
  </>
}

function Fallback() {
  return <div className="grid h-full min-h-[430px] place-items-center bg-[radial-gradient(circle_at_52%_50%,#465b78_0%,#171d32_68%)] text-center text-[var(--lavender)]"><div><span className="block font-mono text-[10px] tracking-[.18em]">WORLD VIEW PAUSED</span><span className="mt-3 block text-sm text-[#d6d7e3]">The portfolio is still fully open below.</span></div></div>
}

export default function WorldScene({ onStationSelect, resetKey = 0 }: WorldSceneProps) {
  const [failed, setFailed] = useState(false)
  useEffect(() => {
    const handleLoss = () => setFailed(true)
    window.addEventListener('webglcontextlost', handleLoss)
    return () => window.removeEventListener('webglcontextlost', handleLoss)
  }, [])
  if (failed) return <Fallback />
  return <Canvas key={resetKey} shadows dpr={[1, 1.5]} gl={{ antialias: true, powerPreference: 'high-performance' }} aria-label="An interactive Three.js portfolio world with a studio island, archive deck, signal dock, bridges, trees, and an airship">
    <Scene onStationSelect={onStationSelect} />
  </Canvas>
}
