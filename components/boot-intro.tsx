'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { useEffect, useState } from 'react'

type BootIntroProps = {
  onComplete: () => void
}

const loadingStripes = [
  'M42 43c4-11 8-21 12-31',
  'M65 44c3-11 9-22 13-32',
  'M89 42c5-10 9-22 12-30',
  'M113 44c3-12 8-22 14-32',
  'M138 43c4-10 8-20 12-30',
  'M163 44c4-12 9-23 13-32',
  'M188 42c3-11 8-21 12-30',
  'M213 44c4-10 9-22 14-32',
  'M239 42c3-11 8-21 12-30',
  'M264 44c4-12 10-23 14-32',
  'M290 42c3-10 8-20 12-30',
  'M315 44c4-12 9-22 14-32',
  'M341 42c3-11 8-21 12-30',
  'M366 44c4-11 9-22 14-32',
  'M392 42c3-10 8-20 11-29',
].map((path, index) => ({ path, index }))

export function BootIntro({ onComplete }: BootIntroProps) {
  const reduced = useReducedMotion()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const readyTimer = window.setTimeout(() => setReady(true), reduced ? 90 : 2380)
    const completeTimer = window.setTimeout(onComplete, reduced ? 360 : 2820)
    return () => {
      window.clearTimeout(readyTimer)
      window.clearTimeout(completeTimer)
    }
  }, [onComplete, reduced])

  return <motion.div className={`boot-intro${ready ? ' is-ready' : ''}`} initial={reduced ? false : { opacity: 0 }} animate={{ opacity: 1 }} exit={reduced ? undefined : { opacity: 0, y: -10 }} transition={{ duration: reduced ? .01 : .32, ease: [0.22, 1, 0.36, 1] }} aria-hidden="true">
    <div className="boot-intro__ornament boot-intro__ornament--left" />
    <div className="boot-intro__ornament boot-intro__ornament--right" />
    <div className="boot-intro__content">
      <p className="boot-intro__eyebrow">GOKUL N. R. / STARTUP SEQUENCE</p>
      <svg className="boot-computer" viewBox="0 0 560 400" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path className="boot-draw boot-screen-shell" style={{ animationDelay: '.08s' }} d="M138 47c72-8 170-6 249 1 6 55 4 142-2 195-70 8-175 8-248-2-7-51-7-141 1-194Z" fill="#f5ebdd" />
        <path className="boot-draw" style={{ animationDelay: '.21s' }} d="M158 75c59-5 141-5 207 1 3 38 3 98-1 135-62 5-147 5-207-1-4-40-4-97 1-135Z" fill="#103b70" />
        <path className="boot-screen-line" style={{ animationDelay: '.66s' }} d="M181 108c25 2 50 2 75 1M181 128c41 2 78 2 113 1M181 148c24 1 47 1 66 0M181 168c32 2 68 2 98 0" />
        <path className="boot-cursor" d="M291 159v16" />
        <path className="boot-draw" style={{ animationDelay: '.34s' }} d="M230 243c24 4 74 4 97 0l7 55c-30 7-83 7-111 0l7-55Z" fill="#e1d5c3" />
        <path className="boot-draw" style={{ animationDelay: '.43s' }} d="M183 303c58 6 138 5 192 0 18 9 31 21 40 37-80 9-199 9-278 0 10-17 27-29 46-37Z" fill="#f5ebdd" />
        <path className="boot-draw" style={{ animationDelay: '.55s' }} d="M123 345c91 8 230 7 314-1 8 9 11 19 12 28-94 10-242 10-337 0 1-11 4-19 11-27Z" fill="#e1d5c3" />
        <path className="boot-key" style={{ animationDelay: '.82s' }} d="M144 355h21m8 2h22m8-2h21m9 2h23m9-2h21m9 2h22m8-2h21m8 2h22m8-2h22" />
        <path className="boot-key" style={{ animationDelay: '.92s' }} d="M137 365h35m8 1h22m8-1h45m8 1h23m8-1h22m8 1h46m8-1h24" />
        <path className="boot-draw boot-star" style={{ animationDelay: '.74s' }} d="m86 105 6 16 16 5-16 5-6 16-5-16-17-5 17-5 5-16Z" />
        <path className="boot-draw boot-arrow" style={{ animationDelay: '.91s' }} d="M407 143c28 5 44 20 54 43m-12-8 12 8 2-14" />
        <path className="boot-draw boot-underline" style={{ animationDelay: '1s' }} d="M397 210c24-5 47-5 70-1" />
      </svg>
      <svg className="boot-loader" viewBox="0 0 440 56" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs><clipPath id="boot-loader-clip"><path d="M16 8c96-6 251-5 409 1 4 12 4 26-1 38-127 5-289 4-408-1-5-13-5-25 0-38Z" /></clipPath></defs>
        <path className="boot-loader__track" d="M16 8c96-6 251-5 409 1 4 12 4 26-1 38-127 5-289 4-408-1-5-13-5-25 0-38Z" />
        <g clipPath="url(#boot-loader-clip)">{loadingStripes.map(({ path, index }) => <path key={path} className={`boot-loader__stripe ${index % 3 === 1 ? 'boot-loader__stripe--blue' : ''}`} style={{ animationDelay: `${1.03 + index * .085}s` }} d={path} />)}</g>
      </svg>
      <p className="boot-status"><span>BOOTING UP...</span><strong>READY. COME ON IN.</strong></p>
    </div>
  </motion.div>
}
