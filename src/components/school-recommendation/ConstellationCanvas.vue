<template>
  <div class="constellation-wrapper">
    <canvas
      ref="canvasRef"
      class="constellation-canvas"
    />
    <div class="constellation-glow" />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  size: {
    type: Number,
    default: 400
  },
  active: {
    type: Boolean,
    default: false
  },
  dimensions: {
    type: Array,
    default: () => [
      { label: '学术能力', value: 75 },
      { label: '语言成绩', value: 72 },
      { label: '科研经历', value: 68 },
      { label: '实习实践', value: 65 },
      { label: '综合素质', value: 70 },
      { label: '目标匹配', value: 78 }
    ]
  }
})

const canvasRef = ref(null)
let ctx = null
let animFrame = null
let time = 0

const getNodePositions = (cx, cy, radius) => {
  const n = props.dimensions.length
  const angleStep = (Math.PI * 2) / n
  return props.dimensions.map((_, i) => {
    const angle = i * angleStep - Math.PI / 2
    return {
      x: cx + Math.cos(angle) * radius,
      y: cy + Math.sin(angle) * radius,
      baseX: cx + Math.cos(angle) * radius,
      baseY: cy + Math.sin(angle) * radius
    }
  })
}

const draw = () => {
  if (!ctx || !canvasRef.value) return
  const canvas = canvasRef.value
  const dpr = window.devicePixelRatio || 1
  const displaySize = props.size
  canvas.width = displaySize * dpr
  canvas.height = displaySize * dpr
  canvas.style.width = displaySize + 'px'
  canvas.style.height = displaySize + 'px'
  ctx.scale(dpr, dpr)

  const w = displaySize
  const h = displaySize
  const cx = w / 2
  const cy = h / 2
  const radius = Math.min(w, h) / 2 - 50

  ctx.clearRect(0, 0, w, h)

  const nodes = getNodePositions(cx, cy, radius)
  const n = nodes.length

  for (let level = 4; level >= 1; level--) {
    const r = (radius * level) / 4
    ctx.beginPath()
    for (let i = 0; i <= n; i++) {
      const angle = (i * Math.PI * 2) / n - Math.PI / 2
      const px = cx + Math.cos(angle) * r
      const py = cy + Math.sin(angle) * r
      if (i === 0) ctx.moveTo(px, py)
      else ctx.lineTo(px, py)
    }
    ctx.closePath()
    ctx.strokeStyle = level === 4 ? 'rgba(15,23,42,0.06)' : 'rgba(15,23,42,0.03)'
    ctx.lineWidth = 1
    ctx.stroke()
  }

  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const nx1 = nodes[i].baseX + Math.sin(time * 0.8 + i) * 3
      const ny1 = nodes[i].baseY + Math.cos(time * 0.8 + i) * 3
      const nx2 = nodes[j].baseX + Math.sin(time * 0.8 + j) * 3
      const ny2 = nodes[j].baseY + Math.cos(time * 0.8 + j) * 3

      const lineOpacity = props.active
        ? 0.12 + Math.sin(time * 1.5 + i + j) * 0.08
        : 0.06 + Math.sin(time * 0.8 + i + j) * 0.03

      ctx.beginPath()
      ctx.moveTo(nx1, ny1)
      ctx.lineTo(nx2, ny2)
      ctx.strokeStyle = `rgba(15,23,42,${Math.max(0.02, lineOpacity)})`
      ctx.lineWidth = 1
      ctx.stroke()
    }
  }

  nodes.forEach((node, i) => {
    const dim = props.dimensions[i]
    const pulseScale = props.active
      ? 1 + Math.sin(time * 2.5 + i * 0.8) * 0.18
      : 1 + Math.sin(time * 1.2 + i * 0.6) * 0.08
    const nodeRadius = (dim.value / 100) * 10 + 4
    const r = nodeRadius * pulseScale
    const nx = node.baseX + Math.sin(time * 0.8 + i) * 3
    const ny = node.baseY + Math.cos(time * 0.8 + i) * 3

    const glowGrad = ctx.createRadialGradient(nx, ny, 0, nx, ny, r * 3)
    glowGrad.addColorStop(0, props.active ? 'rgba(217,119,6,0.12)' : 'rgba(15,23,42,0.08)')
    glowGrad.addColorStop(1, 'transparent')
    ctx.beginPath()
    ctx.arc(nx, ny, r * 3, 0, Math.PI * 2)
    ctx.fillStyle = glowGrad
    ctx.fill()

    ctx.beginPath()
    ctx.arc(nx, ny, r, 0, Math.PI * 2)
    ctx.fillStyle = props.active ? 'rgba(217,119,6,0.85)' : 'rgba(15,23,42,0.75)'
    ctx.fill()

    ctx.beginPath()
    ctx.arc(nx, ny, r * 0.45, 0, Math.PI * 2)
    ctx.fillStyle = 'rgba(255,255,255,0.7)'
    ctx.fill()

    const labelR = radius + 24
    const lx = cx + Math.cos((i * Math.PI * 2) / n - Math.PI / 2) * labelR
    const ly = cy + Math.sin((i * Math.PI * 2) / n - Math.PI / 2) * labelR
    ctx.fillStyle = props.active ? 'rgba(15,23,42,0.7)' : 'rgba(15,23,42,0.45)'
    ctx.font = '11px var(--font-family-base)'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(dim.label, lx, ly)
  })

  time += 0.016
  animFrame = requestAnimationFrame(draw)
}

onMounted(() => {
  ctx = canvasRef.value?.getContext('2d')
  draw()
})

onUnmounted(() => {
  if (animFrame) cancelAnimationFrame(animFrame)
})
</script>

<style scoped>
.constellation-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.constellation-canvas {
  position: relative;
  z-index: 1;
}

.constellation-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 60%;
  height: 60%;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(217, 119, 6, 0.06) 0%, transparent 70%);
  transform: translate(-50%, -50%);
  pointer-events: none;
  z-index: 0;
}
</style>
