import { useEffect, useRef, useMemo } from 'react'
import styles from './SkillSphere.module.scss'

const SKILLS = [
  'React 18',  'TypeScript',  'Redux Toolkit', 'React Query',
  'SignalR',   'Auth0',       'Entra SSO',     'Firebase',
  'Jest',      'RTL',         'Vite',          'SCSS',
  'Azure',     'Git',         'CI/CD',         'Vercel',
  'Copilot',   'Prompt Eng.', 'OpenAI API',    'WebSockets',
  'HTML5',     'CSS3',        'REST APIs',     'Agile',
  'i18n',      'Framer',      'Recharts',      'Node',
]

interface TagData {
  text:  string
  x:     number
  y:     number
  z:     number
  scale: number
  alpha: number
}

const RADIUS   = 160
const SPEED    = 0.004
const DAMPING  = 0.92  // Momentum damping (0-1)
const MOUSE_SENSITIVITY = 0.005

// Fibonacci sphere — evenly distributes N points on a sphere surface
function fibonacciSphere(n: number): { x: number; y: number; z: number }[] {
  const phi     = Math.PI * (Math.sqrt(5) - 1)
  return Array.from({ length: n }, (_, i) => {
    const y     = 1 - (i / (n - 1)) * 2
    const r     = Math.sqrt(1 - y * y)
    const theta = phi * i
    return { x: Math.cos(theta) * r, y, z: Math.sin(theta) * r }
  })
}

export default function SkillSphere() {
  const containerRef = useRef<HTMLDivElement>(null)
  const tagsRef      = useRef<TagData[]>([])
  const angleX       = useRef(0.3)
  const angleY       = useRef(0)
  const velocityX    = useRef(0)
  const velocityY    = useRef(0)
  const mouse        = useRef({ x: 0, y: 0 })
  const rafId        = useRef(0)
  const isHovering   = useRef(false)

  const basePositions = useMemo(() => fibonacciSphere(SKILLS.length), [])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    // Initialise tag data
    tagsRef.current = SKILLS.map((text, i) => ({
      text,
      ...basePositions[i],
      scale: 1,
      alpha: 1,
    }))

    const tagEls = Array.from(
      container.querySelectorAll<HTMLSpanElement>(`.${styles.tag}`)
    )

    // Track mouse movement across entire window for better interaction
    const onGlobalMouseMove = (e: MouseEvent) => {
      // Calculate normalized coordinates (-1 to 1) based on viewport center
      const centerX = window.innerWidth / 2
      const centerY = window.innerHeight / 2
      
      mouse.current = {
        x: (e.clientX - centerX) / window.innerWidth,
        y: (e.clientY - centerY) / window.innerHeight,
      }
    }

    // Detect when mouse enters/leaves container for interaction toggle
    const onMouseEnter = () => {
      isHovering.current = true
    }

    const onMouseLeave = () => {
      isHovering.current = false
      mouse.current = { x: 0, y: 0 }
    }

    // Touch support for mobile devices
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0]
        const centerX = window.innerWidth / 2
        const centerY = window.innerHeight / 2
        
        mouse.current = {
          x: (touch.clientX - centerX) / window.innerWidth,
          y: (touch.clientY - centerY) / window.innerHeight,
        }
      }
    }

    const onTouchStart = () => {
      isHovering.current = true
    }

    const onTouchEnd = () => {
      isHovering.current = false
      mouse.current = { x: 0, y: 0 }
    }

    window.addEventListener('mousemove', onGlobalMouseMove)
    container.addEventListener('mouseenter', onMouseEnter)
    container.addEventListener('mouseleave', onMouseLeave)
    container.addEventListener('touchmove', onTouchMove, { passive: true })
    container.addEventListener('touchstart', onTouchStart)
    container.addEventListener('touchend', onTouchEnd)

    const tick = () => {
      // Apply velocity (momentum)
      velocityX.current *= DAMPING
      velocityY.current *= DAMPING

      // Add mouse input if hovering
      if (isHovering.current) {
        velocityX.current += mouse.current.y * MOUSE_SENSITIVITY
        velocityY.current += mouse.current.x * MOUSE_SENSITIVITY
      }

      // Update angles with base speed + velocity
      angleY.current += SPEED + velocityY.current
      angleX.current += velocityX.current

      const cosX = Math.cos(angleX.current)
      const sinX = Math.sin(angleX.current)
      const cosY = Math.cos(angleY.current)
      const sinY = Math.sin(angleY.current)

      tagsRef.current.forEach((tag, i) => {
        const { x: ox, y: oy, z: oz } = basePositions[i]

        // Rotate around Y axis
        const x1 = ox * cosY - oz * sinY
        const z1 = ox * sinY + oz * cosY

        // Rotate around X axis
        const y2 = oy * cosX - z1 * sinX
        const z2 = oy * sinX + z1 * cosX

        const px = x1 * RADIUS
        const py = y2 * RADIUS
        const pz = z2 * RADIUS

        const depth  = (pz + RADIUS) / (2 * RADIUS)
        const alpha  = 0.18 + depth * 0.82
        const scale  = 0.55 + depth * 0.55

        tag.x = px; tag.y = py; tag.z = pz
        tag.alpha = alpha; tag.scale = scale

        const el = tagEls[i]
        if (el) {
          el.style.transform = `translate(${px}px, ${py}px) scale(${scale})`
          el.style.opacity   = `${alpha}`
          el.style.zIndex    = `${Math.round(depth * 100)}`
        }
      })

      rafId.current = requestAnimationFrame(tick)
    }

    if (reducedMotion) {
      // Render one static frame — no continuous animation.
      const frame = tick
      const id = requestAnimationFrame(() => {
        frame()
        cancelAnimationFrame(rafId.current)
      })
      return () => cancelAnimationFrame(id)
    }

    // Only run the animation loop while the sphere is on screen.
    let visible = false
    const visibility = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !visible) {
          visible = true
          rafId.current = requestAnimationFrame(tick)
        } else if (!entry.isIntersecting && visible) {
          visible = false
          cancelAnimationFrame(rafId.current)
        }
      },
      { threshold: 0.05 }
    )
    visibility.observe(container)

    return () => {
      visibility.disconnect()
      cancelAnimationFrame(rafId.current)
      window.removeEventListener('mousemove', onGlobalMouseMove)
      container.removeEventListener('mouseenter', onMouseEnter)
      container.removeEventListener('mouseleave', onMouseLeave)
      container.removeEventListener('touchmove', onTouchMove)
      container.removeEventListener('touchstart', onTouchStart)
      container.removeEventListener('touchend', onTouchEnd)
    }
  }, [basePositions])

  return (
    <div className={styles.wrapper} aria-label="Interactive skill sphere">
      <div ref={containerRef} className={styles.sphere}>
        {SKILLS.map((skill) => (
          <span key={skill} className={styles.tag}>
            {skill}
          </span>
        ))}
      </div>
      <p className={styles.hint}>Move cursor around to rotate</p>
    </div>
  )
}
