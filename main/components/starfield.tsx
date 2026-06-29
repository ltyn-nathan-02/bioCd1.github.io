"use client"

import { useEffect, useRef } from "react"

type Star = { x: number; y: number; size: number; speed: number; opacity: number }
type Meteor = { x: number; y: number; vx: number; vy: number; life: number; maxLife: number }

export default function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animId: number
    let stars: Star[] = []
    let meteors: Meteor[] = []

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener("resize", resize)

    const starCount = 200
    stars = Array.from({ length: starCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 1.5 + 0.5,
      speed: Math.random() * 0.3 + 0.1,
      opacity: Math.random() * 0.5 + 0.3,
    }))

    let frameCount = 0

    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (const star of stars) {
        star.y += star.speed
        if (star.y > canvas.height) {
          star.y = 0
          star.x = Math.random() * canvas.width
        }
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,255,255,${star.opacity})`
        ctx.fill()
      }

      frameCount++
      if (frameCount % 120 === 0 && meteors.length < 3) {
        meteors.push({
          x: Math.random() * canvas.width,
          y: 0,
          vx: (Math.random() - 0.5) * 6,
          vy: Math.random() * 4 + 3,
          life: 0,
          maxLife: 60 + Math.random() * 40,
        })
      }

      meteors = meteors.filter((m) => m.life < m.maxLife)
      for (const m of meteors) {
        m.x += m.vx
        m.y += m.vy
        m.life++
        const alpha = 1 - m.life / m.maxLife
        ctx.beginPath()
        ctx.moveTo(m.x, m.y)
        ctx.lineTo(m.x - m.vx * 3, m.y - m.vy * 3)
        ctx.strokeStyle = `rgba(200,200,255,${alpha})`
        ctx.lineWidth = 1.5
        ctx.stroke()
      }

      animId = requestAnimationFrame(loop)
    }

    loop()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener("resize", resize)
    }
  }, [])

  return <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" />
}
