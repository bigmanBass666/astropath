<template>
  <canvas
    ref="canvasRef"
    class="star-background"
    :style="{ opacity: props.opacity }"
  />
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface Props {
  particleCount?: number
  connectionDistance?: number
  opacity?: number
  color?: string
}

const props = withDefaults(defineProps<Props>(), {
  particleCount: 120,
  connectionDistance: 100,
  opacity: 1,
  color: '217, 119, 6' // Amber-600 RGB
})

const canvasRef = ref<HTMLCanvasElement | null>(null)
let animationId: number | null = null
let ctx: CanvasRenderingContext2D | null = null
let particles: Particle[] = []
let mouseX = 0
let mouseY = 0
let width = 0
let height = 0

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  alpha: number
}

function initParticles() {
  particles = []
  for (let i = 0; i < props.particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      radius: Math.random() * 1.5 + 0.5,
      alpha: Math.random() * 0.5 + 0.2
    })
  }
}

function resize() {
  if (!canvasRef.value) return
  width = window.innerWidth
  height = window.innerHeight
  canvasRef.value.width = width
  canvasRef.value.height = height
}

function handleMouseMove(e: MouseEvent) {
  mouseX = e.clientX
  mouseY = e.clientY
}

function animate() {
  if (!ctx || !canvasRef.value) return

  const context = ctx
  context.clearRect(0, 0, width, height)

  // Update and draw particles
  particles.forEach((p, i) => {
    // Mouse interaction - gentle repulsion
    const dx = mouseX - p.x
    const dy = mouseY - p.y
    const dist = Math.sqrt(dx * dx + dy * dy)
    if (dist < 150) {
      const force = (150 - dist) / 150 * 0.02
      p.vx -= dx * force * 0.01
      p.vy -= dy * force * 0.01
    }

    // Update position
    p.x += p.vx
    p.y += p.vy

    // Boundary check - wrap around
    if (p.x < 0) p.x = width
    if (p.x > width) p.x = 0
    if (p.y < 0) p.y = height
    if (p.y > height) p.y = 0

    // Damping
    p.vx *= 0.99
    p.vy *= 0.99

    // Draw particle
    context.beginPath()
    context.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
    context.fillStyle = `rgba(${props.color}, ${p.alpha})`
    context.fill()

    // Draw connections
    for (let j = i + 1; j < particles.length; j++) {
      const p2 = particles[j]
      const d = Math.sqrt((p.x - p2.x) ** 2 + (p.y - p2.y) ** 2)
      if (d < props.connectionDistance) {
        context.beginPath()
        context.moveTo(p.x, p.y)
        context.lineTo(p2.x, p2.y)
        const alpha = (1 - d / props.connectionDistance) * 0.15
        context.strokeStyle = `rgba(${props.color}, ${alpha})`
        context.lineWidth = 0.5
        context.stroke()
      }
    }
  })

  animationId = requestAnimationFrame(animate)
}

onMounted(() => {
  if (!canvasRef.value) return
  
  ctx = canvasRef.value.getContext('2d')
  if (!ctx) return

  resize()
  initParticles()
  animate()

  window.addEventListener('resize', resize)
  window.addEventListener('mousemove', handleMouseMove)
})

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
  window.removeEventListener('resize', resize)
  window.removeEventListener('mousemove', handleMouseMove)
})
</script>

<style scoped>
.star-background {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}
</style>
