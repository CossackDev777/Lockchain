"use client"

import type React from "react"

import { useEffect, useRef } from "react"

interface GridBackgroundProps {
  className?: string
  color?: string
  lineOpacity?: number
  dotOpacity?: number
  speed?: number
  dotSize?: number
  lineWidth?: number
  spacing?: number
  children?: React.ReactNode
}

export function GridBackground({
  className = "",
  color = "#94A3B8",
  lineOpacity = 0.07,
  dotOpacity = 0.15,
  speed = 0.5,
  dotSize = 1,
  lineWidth = 0.5,
  spacing = 30,
  children,
}: GridBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number | null>(null)
  const offsetRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1
      canvas.width = canvas.offsetWidth * dpr
      canvas.height = canvas.offsetHeight * dpr
      ctx.scale(dpr, dpr)
    }

    window.addEventListener("resize", resizeCanvas)
    resizeCanvas()

    const drawGrid = () => {
      if (!canvas || !ctx) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Calculate grid dimensions
      const width = canvas.offsetWidth
      const height = canvas.offsetHeight
      const cols = Math.floor(width / spacing) + 2
      const rows = Math.floor(height / spacing) + 2

      // Calculate offset for smooth animation
      offsetRef.current.x = (offsetRef.current.x + speed) % spacing
      offsetRef.current.y = (offsetRef.current.y + speed) % spacing

      // Draw grid lines
      ctx.strokeStyle = color
      ctx.lineWidth = lineWidth
      ctx.globalAlpha = lineOpacity

      // Horizontal lines
      for (let i = 0; i < rows; i++) {
        const y = i * spacing - offsetRef.current.y
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(width, y)
        ctx.stroke()
      }

      // Vertical lines
      for (let i = 0; i < cols; i++) {
        const x = i * spacing - offsetRef.current.x
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, height)
        ctx.stroke()
      }

      // Draw dots at intersections
      ctx.fillStyle = color
      ctx.globalAlpha = dotOpacity
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const x = i * spacing - offsetRef.current.x
          const y = j * spacing - offsetRef.current.y
          ctx.beginPath()
          ctx.arc(x, y, dotSize, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      animationRef.current = requestAnimationFrame(drawGrid)
    }

    drawGrid()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [color, lineOpacity, dotOpacity, speed, dotSize, lineWidth, spacing])

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ opacity: 0.8, mixBlendMode: "lighten" }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  )
}
